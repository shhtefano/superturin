import { EngineCallbacks, GameStatus, HudData, CharacterId, PowerUpType } from '../../types/game';
import { GameLoop } from './GameLoop';
import { InputManager } from './InputManager';
import { Camera } from './Camera';
import { CollisionSystem } from './CollisionSystem';
import { AudioManager } from '../audio/AudioManager';
import { ParticleSystem } from '../graphics/ParticleSystem';
import { ParallaxBackground } from '../graphics/ParallaxBackground';
import { SaveManager } from '../storage/SaveManager';
import { Player } from '../../entities/Player';
import { Platform } from '../../entities/Platform';
import { Checkpoint } from '../../entities/Checkpoint';
import { Goal } from '../../entities/Goal';
import { Collectible } from '../../entities/collectibles/Collectible';
import { PowerUpItem } from '../../entities/collectibles/PowerUpItem';
import { Enemy } from '../../entities/enemies/Enemy';
import { Pigeon } from '../../entities/enemies/Pigeon';
import { Tram } from '../../entities/enemies/Tram';
import { AngryLocal } from '../../entities/enemies/AngryLocal';
import { Squirrel } from '../../entities/enemies/Squirrel';
import { Vigile } from '../../entities/enemies/Vigile';
import { Nutria } from '../../entities/enemies/Nutria';
import { Gabbiano } from '../../entities/enemies/Gabbiano';
import { Rider } from '../../entities/enemies/Rider';
import { Cinghiale } from '../../entities/enemies/Cinghiale';
import { RobotLingotto } from '../../entities/enemies/RobotLingotto';
import { BossEnemy } from '../../entities/enemies/BossEnemy';
import { BossPiccione } from '../../entities/enemies/BossPiccione';
import { BossNutria } from '../../entities/enemies/BossNutria';
import { BossComau } from '../../entities/enemies/BossComau';
import { Bullet } from '../../entities/projectiles/Bullet';
import { GianduiottoBomb } from '../../entities/projectiles/GianduiottoBomb';
import { LevelData } from '../../levels/types';
import { getLevelById, LEVELS } from '../../levels';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private callbacks: EngineCallbacks;

  // Core Subsystems
  public input: InputManager;
  public audio: AudioManager;
  public loop: GameLoop;
  public camera: Camera;
  public particles: ParticleSystem;
  public parallax: ParallaxBackground;

  // World Entities
  public player!: Player;
  public platforms: Platform[] = [];
  public checkpoints: Checkpoint[] = [];
  public collectibles: Collectible[] = [];
  public enemies: Enemy[] = [];
  public bullets: Bullet[] = [];
  public bombs: GianduiottoBomb[] = [];
  public goal!: Goal;
  public currentLevel!: LevelData;

  // Game Progress State
  public status: GameStatus = 'menu';
  public score: number = 0;
  public gianduiottiCount: number = 0;
  public timeLeft: number = 0;
  private hudThrottleTimer: number = 0;
  private deathDelayTimer: number = 0;

  constructor(canvas: HTMLCanvasElement, callbacks: EngineCallbacks) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Impossibile ottenere il contesto 2D del Canvas');
    }
    this.ctx = context;
    this.ctx.imageSmoothingEnabled = false; // Pixel art crisp

    this.callbacks = callbacks;
    this.input = new InputManager();
    this.audio = new AudioManager();
    this.camera = new Camera(1280, 720);
    this.particles = new ParticleSystem();
    this.parallax = new ParallaxBackground(1280, 720);

    this.loop = new GameLoop(
      (dt) => this.update(dt),
      (alpha) => this.render(alpha)
    );
  }

  public init(): void {
    this.loadLevel(1);
    this.loop.start();
  }

  public loadLevel(levelId: number): void {
    const levelData = getLevelById(levelId);
    this.currentLevel = levelData;
    this.camera.setLevelBounds(levelData.width, levelData.height);
    this.parallax.setTheme(levelData.theme);
    this.timeLeft = levelData.timeLimit;
    this.particles.reset();

    // 1. Inizializza Piattaforme (con blocchi interrogativi, piattaforme mobili e ostacoli interattivi)
    this.platforms = levelData.platforms.map(
      (p) =>
        new Platform(
          p.id,
          p.x,
          p.y,
          p.width,
          p.height,
          p.isOneWay ?? false,
          p.style ?? 'ground_pave',
          p.isQuestionBlock ?? false,
          p.questionContent ?? 'gianduiotto',
          p.isMoving ?? false,
          p.moveAxis ?? 'x',
          p.moveRange ?? 0,
          p.moveSpeed ?? 1.5,
          p.isBouncer ?? false,
          p.isCrumbling ?? false,
          p.isSpikeHazard ?? false,
          p.isBreakable ?? false
        )
    );

    // 2. Inizializza Checkpoint (Toret)
    this.checkpoints = levelData.checkpoints.map(
      (c) => new Checkpoint(c.id, c.x, c.y)
    );

    // 3. Inizializza Collezionabili & Sostanze (Gianduiotto, Cocaina, Marijuana, MD, LSD, Funghetti)
    this.collectibles = levelData.collectibles.map((c) => {
      return new PowerUpItem(c.id, c.type, c.x, c.y);
    });

    // 4. Inizializza Nemici (inclusi i 3 Mini Boss torinesi)
    this.enemies = levelData.enemies.map((e) => {
      switch (e.type) {
        case 'tram':
          return new Tram(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
        case 'angryLocal':
          return new AngryLocal(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
        case 'squirrel':
          return new Squirrel(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
        case 'vigile':
          return new Vigile(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
        case 'nutria':
          return new Nutria(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
        case 'gabbiano':
          return new Gabbiano(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
        case 'rider':
          return new Rider(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
        case 'cinghiale':
          return new Cinghiale(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
        case 'robotLingotto':
          return new RobotLingotto(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
        case 'bossPiccione':
          return new BossPiccione(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
        case 'bossNutria':
          return new BossNutria(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
        case 'bossComau':
          return new BossComau(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
        default:
          return new Pigeon(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
      }
    });

    // 5. Inizializza Goal (bloccato finché il boss del livello non viene sconfitto)
    const hasBoss = this.enemies.some((e) => e instanceof BossEnemy);
    this.goal = new Goal('level_goal', levelData.goal.x, levelData.goal.y);
    this.goal.isLocked = hasBoss;

    this.bullets = [];
    this.bombs = [];

    // 6. Inizializza Player con il personaggio selezionato
    const selectedChar = SaveManager.getSelectedCharacter();
    this.player = new Player(
      'player_hero',
      levelData.playerStart.x,
      levelData.playerStart.y,
      this.audio,
      this.particles,
      selectedChar
    );

    // Connetti le Skill (Tastierino Numerico) del Giocatore al motore di gioco
    this.player.onShoot = (x, y, facingRight) => {
      this.bullets.push(new Bullet(x, y, facingRight));
    };

    this.player.onBomb = (x, y, facingRight) => {
      this.bombs.push(new GianduiottoBomb(x, y, facingRight));
    };

    // Connetti le Super-Abilità speciali (Barra Spaziatrice)
    this.player.onGroundSlam = (x, y, radius) => {
      this.camera.triggerShake(18, 0.45);
      this.audio.playExplosion();
      let hitAny = false;
      for (const enemy of this.enemies) {
        if (enemy.active && !enemy.isDead) {
          const eX = enemy.x + enemy.width / 2;
          if (Math.abs(eX - x) <= radius) {
            if (enemy instanceof BossEnemy) {
              const defeated = enemy.takeHit(2); // Ground slam fa 2 danni al Boss!
              this.particles.emitGoldSparks(eX, enemy.y + enemy.height / 2, 20);
              if (defeated) {
                this.score += 2500;
                this.particles.emitFeathers(eX, enemy.y + enemy.height / 2, 45);
                this.audio.playLevelComplete();
                this.goal.isLocked = false;
              }
            } else {
              enemy.die();
              this.score += 250;
              this.particles.emitFeathers(eX, enemy.y + enemy.height / 2, 14);
            }
            hitAny = true;
          }
        }
      }
      if (hitAny) {
        this.emitHudUpdate(true);
      }
    };

    this.player.onSpreadShot = (x, y, facingRight) => {
      this.audio.playShoot();
      for (let i = -2; i <= 2; i++) {
        const bullet = new Bullet(x, y + i * 8, facingRight);
        bullet.vx = (facingRight ? 1 : -1) * (620 + Math.abs(i) * 25);
        this.bullets.push(bullet);
      }
    };

    this.player.onJackpotShower = (x, y) => {
      this.audio.playCoin();
      this.score += 500;
      this.gianduiottiCount += 5;
      const buffs: PowerUpType[] = ['cocaina', 'marijuana', 'md', 'lsd', 'funghetti'];
      const randomBuff = buffs[Math.floor(Math.random() * buffs.length)];
      this.player.activatePowerUp(randomBuff);
      for (let i = 0; i < 6; i++) {
        const bx = x + (i - 2.5) * 55;
        const bomb = new GianduiottoBomb(bx, y - 80 - i * 15, i % 2 === 0);
        bomb.vy = 120 + Math.random() * 80;
        bomb.vx = (Math.random() - 0.5) * 140;
        this.bombs.push(bomb);
      }
      this.emitHudUpdate(true);
    };

    this.player.onCharmBurst = (x, y, radius) => {
      this.camera.triggerShake(14, 0.35);
      this.audio.playCoin();
      let hitAny = false;
      for (const enemy of this.enemies) {
        if (enemy.active && !enemy.isDead) {
          const eX = enemy.x + enemy.width / 2;
          const eY = enemy.y + enemy.height / 2;
          const dist = Math.hypot(eX - x, eY - y);
          if (dist <= radius) {
            if (enemy instanceof BossEnemy) {
              const defeated = enemy.takeHit(1);
              this.particles.emitGoldSparks(eX, eY, 20);
              if (defeated) {
                this.score += 2500;
                this.particles.emitFeathers(eX, eY, 45);
                this.audio.playLevelComplete();
                this.goal.isLocked = false;
              }
            } else {
              enemy.die();
              this.score += 250;
              this.particles.emitGoldSparks(eX, eY, 16);
            }
            this.gianduiottiCount += 1;
            hitAny = true;
          }
        }
      }
      if (hitAny) {
        this.emitHudUpdate(true);
      }
    };

    // 1. Alessiuccia: Fascio Glamour & Raggio Arcobaleno
    this.player.onGlamourBeam = (x, y, facingRight) => {
      this.camera.triggerShake(14, 0.3);
      this.audio.playLevelComplete();
      const beamLength = 650;
      const minX = facingRight ? x : x - beamLength;
      const maxX = facingRight ? x + beamLength : x;
      for (let offset = 0; offset <= beamLength; offset += 35) {
        const px = facingRight ? x + offset : x - offset;
        this.particles.emitGoldSparks(px, y, 6);
      }
      let hitAny = false;
      for (const enemy of this.enemies) {
        if (enemy.active && !enemy.isDead) {
          const eX = enemy.x + enemy.width / 2;
          const eY = enemy.y + enemy.height / 2;
          if (eX >= minX && eX <= maxX && Math.abs(eY - y) <= 45) {
            if (enemy instanceof BossEnemy) {
              const defeated = enemy.takeHit(2);
              this.particles.emitGoldSparks(eX, eY, 25);
              if (defeated) {
                this.score += 2500;
                this.particles.emitFeathers(eX, eY, 45);
                this.audio.playLevelComplete();
                this.goal.isLocked = false;
              }
            } else {
              enemy.die();
              this.score += 300;
              this.particles.emitGoldSparks(eX, eY, 18);
            }
            hitAny = true;
          }
        }
      }
      if (hitAny) {
        this.emitHudUpdate(true);
      }
    };

    // 2. Ludo: EMP Glitch Sonico
    this.player.onEmpBurst = (x, y, radius) => {
      this.camera.triggerShake(16, 0.4);
      this.audio.playExplosion();
      this.particles.emitGoldSparks(x, y, 35);
      this.particles.emitWaterDroplets(x, y, 30);
      let hitAny = false;
      for (const enemy of this.enemies) {
        if (enemy.active && !enemy.isDead) {
          const eX = enemy.x + enemy.width / 2;
          const eY = enemy.y + enemy.height / 2;
          if (Math.hypot(eX - x, eY - y) <= radius) {
            if (enemy instanceof BossEnemy) {
              const defeated = enemy.takeHit(2);
              this.particles.emitGoldSparks(eX, eY, 25);
              if (defeated) {
                this.score += 2500;
                this.particles.emitFeathers(eX, eY, 45);
                this.audio.playLevelComplete();
                this.goal.isLocked = false;
              }
            } else {
              enemy.die();
              this.score += 300;
              this.particles.emitWaterDroplets(eX, eY, 16);
            }
            hitAny = true;
          }
        }
      }
      if (hitAny) {
        this.emitHudUpdate(true);
      }
    };

    // 3. Ariannuccia: Scatto Fionda Alpina
    this.player.onAlpineDash = (x, y, facingRight) => {
      this.camera.triggerShake(10, 0.25);
      this.audio.playJump();
      const dashLength = 260;
      const minX = facingRight ? x : x - dashLength;
      const maxX = facingRight ? x + dashLength : x;
      for (let offset = 0; offset <= dashLength; offset += 30) {
        const px = facingRight ? x + offset : x - offset;
        this.particles.emitDust(px, y + 10, 4);
      }
      let hitAny = false;
      for (const enemy of this.enemies) {
        if (enemy.active && !enemy.isDead) {
          const eX = enemy.x + enemy.width / 2;
          const eY = enemy.y + enemy.height / 2;
          if (eX >= minX && eX <= maxX && Math.abs(eY - y) <= 45) {
            if (enemy instanceof BossEnemy) {
              const defeated = enemy.takeHit(2);
              this.particles.emitGoldSparks(eX, eY, 20);
              if (defeated) {
                this.score += 2500;
                this.particles.emitFeathers(eX, eY, 45);
                this.audio.playLevelComplete();
                this.goal.isLocked = false;
              }
            } else {
              enemy.die();
              this.score += 250;
              this.particles.emitDust(eX, eY, 14);
            }
            hitAny = true;
          }
        }
      }
      if (hitAny) {
        this.emitHudUpdate(true);
      }
    };

    // 4. Sandrone: Maglio Sismico d'Acciaio FIAT
    this.player.onTitanSmash = (x, y, radius) => {
      this.camera.triggerShake(24, 0.5);
      this.audio.playExplosion();
      this.particles.emitDust(x, y, 45);
      this.particles.emitGoldSparks(x, y - 20, 25);
      let hitAny = false;
      for (const enemy of this.enemies) {
        if (enemy.active && !enemy.isDead) {
          const eX = enemy.x + enemy.width / 2;
          const eY = enemy.y + enemy.height / 2;
          if (Math.abs(eX - x) <= radius && Math.abs(eY - y) <= 120) {
            if (enemy instanceof BossEnemy) {
              const defeated = enemy.takeHit(3);
              this.particles.emitGoldSparks(eX, eY, 30);
              if (defeated) {
                this.score += 2500;
                this.particles.emitFeathers(eX, eY, 45);
                this.audio.playLevelComplete();
                this.goal.isLocked = false;
              }
            } else {
              enemy.die();
              this.score += 350;
              this.particles.emitDust(eX, eY, 20);
            }
            hitAny = true;
          }
        }
      }
      if (hitAny) {
        this.emitHudUpdate(true);
      }
    };

    // 5. Vinzert: Subwoofer Bass Drop 808
    this.player.onBassDrop = (x, y, radius) => {
      this.camera.triggerShake(20, 0.45);
      this.audio.playStomp();
      this.audio.playCoin();
      this.particles.emitGoldSparks(x, y, 40);
      this.gianduiottiCount += 3;
      this.score += 300;
      let hitAny = false;
      for (const enemy of this.enemies) {
        if (enemy.active && !enemy.isDead) {
          const eX = enemy.x + enemy.width / 2;
          const eY = enemy.y + enemy.height / 2;
          if (Math.hypot(eX - x, eY - y) <= radius) {
            if (enemy instanceof BossEnemy) {
              const defeated = enemy.takeHit(2);
              this.particles.emitGoldSparks(eX, eY, 25);
              if (defeated) {
                this.score += 2500;
                this.particles.emitFeathers(eX, eY, 45);
                this.audio.playLevelComplete();
                this.goal.isLocked = false;
              }
            } else {
              enemy.die();
              this.score += 300;
              this.particles.emitGoldSparks(eX, eY, 15);
            }
            hitAny = true;
          }
        }
      }
      this.emitHudUpdate(true);
    };

    this.camera.setPositionImmediate(this.player.x, this.player.y);
    this.emitHudUpdate(true);
  }

  public play(): void {
    this.audio.unlockAudio();
    this.audio.startBgm();
    this.status = 'playing';
    this.callbacks.onStateChange('playing');
  }

  public pause(): void {
    if (this.status === 'playing') {
      this.status = 'paused';
      this.callbacks.onStateChange('paused');
    }
  }

  public resume(): void {
    if (this.status === 'paused') {
      this.status = 'playing';
      this.callbacks.onStateChange('playing');
    }
  }

  public restart(): void {
    this.score = 0;
    this.gianduiottiCount = 0;
    this.loadLevel(this.currentLevel.id);
    this.play();
  }

  public setSelectedCharacter(characterId: CharacterId): void {
    SaveManager.setSelectedCharacter(characterId);
    if (this.player) {
      this.player.setCharacter(characterId);
      this.emitHudUpdate(true);
    }
  }

  private handlePlayerDeath(): void {
    this.camera.triggerShake(14, 0.4);

    if (this.player.lives <= 0) {
      this.status = 'gameOver';
      this.audio.stopBgm();
      this.callbacks.onStateChange('gameOver');
    } else {
      this.deathDelayTimer = 1.0;
    }
  }

  private completeLevel(): void {
    this.status = 'levelComplete';
    this.player.state = 'victory';
    this.audio.stopBgm();
    this.audio.playLevelComplete();

    // Bonus tempo residuo
    const timeBonus = Math.floor(this.timeLeft) * 10;
    this.score += timeBonus;

    // Salva progresso
    const totalLevelsCount = Object.keys(LEVELS).length;
    const nextLevelId = Math.min(totalLevelsCount, this.currentLevel.id + 1);
    SaveManager.unlockLevel(nextLevelId);
    SaveManager.recordScore(this.currentLevel.id, this.score, this.gianduiottiCount);

    this.emitHudUpdate(true);
    this.callbacks.onStateChange('levelComplete');
  }

  public update(dt: number): void {
    if (this.status !== 'playing') return;

    // Gestione timer di morte e respawn al checkpoint
    if (this.deathDelayTimer > 0) {
      this.deathDelayTimer -= dt;
      if (this.deathDelayTimer <= 0) {
        this.player.respawn();
        this.camera.setPositionImmediate(this.player.x, this.player.y);
      }
      return;
    }

    // Aggiornamento piattaforme mobili e rimbalzi blocchi
    for (const plat of this.platforms) {
      plat.update(dt);
    }

    // Aggiornamento tempo livello
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.player.die();
      this.handlePlayerDeath();
      return;
    }

    this.input.update(dt);
    this.player.handleInput(this.input, dt);

    // MALUS COCAINA: Micro-jitter visivo della telecamera (frenesia)
    if (this.player.hasPowerUp('cocaina') && Math.random() < 0.35) {
      this.camera.triggerShake(2, 0.05);
    }

    // BONUS MD & INCANTO BENEDETTA: Magnete Gianduiotti (attira a sé le monete)
    if (this.player.hasPowerUp('md') || this.player.isCharmActive) {
      const pCenterX = this.player.x + this.player.width / 2;
      const pCenterY = this.player.y + this.player.height / 2;
      const magnetDist = this.player.isCharmActive ? 380 : 260;
      for (const col of this.collectibles) {
        if (!col.collected && col instanceof PowerUpItem && col.itemType === 'gianduiotto') {
          const cCenterX = col.x + col.width / 2;
          const cCenterY = col.y + col.height / 2;
          const dx = pCenterX - cCenterX;
          const dy = pCenterY - cCenterY;
          const dist = Math.hypot(dx, dy);
          if (dist < magnetDist && dist > 5) {
            const speed = 460;
            col.x += (dx / dist) * speed * dt;
            col.y += (dy / dist) * speed * dt;
          }
        }
      }
    }

    // Calcolo moltiplicatore punteggio (x3 se Polydoping >= 3 sostanze, x2 se MD)
    let scoreMultiplier = 1;
    if (this.player.activePowerUps.size >= 3) {
      scoreMultiplier = 3;
    } else if (this.player.hasPowerUp('md')) {
      scoreMultiplier = 2;
    }

    // Aggiorna piattaforme (blocchi rimbalzanti, piattaforme mobili, crolli)
    for (const plat of this.platforms) {
      plat.update(dt);
    }

    // --- RISOLUZIONE COLLISIONI FISICHE DEL GIOCATORE ---
    const prevBottom = this.player.y + this.player.height;

    // 1. Spostamento orizzontale e collisione con muri
    this.player.x += this.player.vx * dt;
    const insetX = 3;
    for (const plat of this.platforms) {
      if (plat.isOneWay || !plat.active) continue;
      const res = CollisionSystem.resolveHorizontal(playerBox, this.player.vx, plat.getHitbox(), insetX);
      if (res.collided) {
        this.player.x = res.resolvedX;
        this.player.vx = 0;
        playerBox = this.player.getHitbox();
      }
    }

    // 2. Spostamento verticale e collisione con piattaforme
    this.player.y += this.player.vy * dt;
    this.player.isGrounded = false;
    playerBox = this.player.getHitbox();

    for (const plat of this.platforms) {
      if (!plat.active) continue;

      const res = CollisionSystem.resolveVertical(
        playerBox,
        this.player.vy,
        plat.getHitbox(),
        plat.isOneWay,
        prevBottom
      );

      if (res.grounded) {
        this.player.y = res.resolvedY;
        this.player.vy = 0;
        this.player.isGrounded = true;
        playerBox = this.player.getHitbox();

        if (plat.isMoving && plat.moveAxis === 'x') {
          this.player.x += plat.vx * dt;
        }

        // Interazione 1: Molla Sabauda (Bouncer) - Super salto elastico
        if (plat.isBouncer) {
          plat.triggerBounce();
          this.player.vy = -860;
          this.player.isGrounded = false;
          this.audio.playJump();
          this.particles.emitGoldSparks(this.player.x + this.player.width / 2, plat.y, 14);
          this.camera.triggerShake(6, 0.15);
        }

        // Interazione 2: Piattaforma Traballante (Crumbling) - Inizia a tremare e crolla
        if (plat.isCrumbling) {
          plat.stepOn();
        }

        // Interazione 3: Dissuasori / Spuntoni Acuminati (Spike Hazard) - Danno e respingimento
        if (plat.isSpikeHazard) {
          const dead = this.player.takeDamage();
          this.player.vy = -380;
          this.player.isGrounded = false;
          this.camera.triggerShake(12, 0.25);
          if (dead) {
            this.handlePlayerDeath();
          }
          this.emitHudUpdate(true);
        }

        // Interazione 4: Cassa Distruggibile (Breakable) - Si frantuma all'atterraggio
        if (plat.isBreakable) {
          plat.shatter();
          this.score += 150 * scoreMultiplier;
          this.audio.playStomp();
          this.particles.emitFeathers(plat.x + plat.width / 2, plat.y + plat.height / 2, 14);
          this.player.bounce();
          this.emitHudUpdate(true);
        }
      } else if (res.hitCeiling) {
        this.player.y = res.resolvedY;
        this.player.vy = 0;
        playerBox = this.player.getHitbox();

        // MECCANICA SUPER MARIO: Colpito blocco sorpresa "?" da sotto con la testa
        if (plat.isQuestionBlock && !plat.isHit) {
          const reward = plat.bump();
          this.camera.triggerShake(5, 0.15);

          if (reward === 'gianduiotto') {
            this.score += 100 * scoreMultiplier;
            this.gianduiottiCount += 1;
            this.audio.playCoin();
            this.particles.emitGoldSparks(plat.x + plat.width / 2, plat.y - 12, 12);
          } else if (reward) {
            this.player.activatePowerUp(reward);
            this.camera.triggerShake(7, 0.25);
          }
          this.emitHudUpdate(true);
        }
      }
    }

    this.player.update(dt);

    // Caduta nel vuoto / fuori mappa
    if (this.player.y > this.currentLevel.height + 40 && this.player.state !== 'dead') {
      const isGameOver = this.player.takeDamage();
      if (isGameOver) {
        this.handlePlayerDeath();
      } else {
        this.player.respawn();
        this.camera.setPositionImmediate(this.player.x, this.player.y);
      }
    }

    // --- CHECKPOINT (TORET) ---
    for (const toret of this.checkpoints) {
      if (!toret.isActivated && CollisionSystem.checkAABB(playerBox, toret.getHitbox())) {
        toret.activate();
        this.player.setCheckpoint(toret.x - 10, toret.y);
        this.audio.playCheckpoint();
        this.particles.emitWaterDroplets(toret.x + toret.width + 4, toret.y + 20, 15);
      }
    }

    // --- COLLEZIONABILI & SOSTANZE ---
    for (const col of this.collectibles) {
      if (!col.collected) {
        col.update(dt);
        if (CollisionSystem.checkAABB(playerBox, col.getHitbox())) {
          col.collected = true;

          if (col instanceof PowerUpItem) {
            if (col.itemType === 'gianduiotto') {
              this.score += col.value * scoreMultiplier;
              this.gianduiottiCount += 1;
              this.audio.playCoin();
              this.particles.emitGoldSparks(col.x + col.width / 2, col.y + col.height / 2, 10);
            } else {
              this.score += col.value;
              this.player.activatePowerUp(col.itemType);
              this.camera.triggerShake(7, 0.25);
            }
          }
          this.emitHudUpdate(true);
        }
      }
    }

    // --- NEMICI (PICCIONE, TRAM, TORINESE, SCOIATTOLO) ---
    // Bullet-time: se Shhte ha attivo Matrix Overclock, i nemici rallentano al 35% di velocità
    const enemyDt = this.player.isMatrixActive ? dt * 0.35 : dt;
    const playerCenterX = this.player.x + this.player.width / 2;
    const playerCenterY = this.player.y + this.player.height / 2;

    for (const enemy of this.enemies) {
      if (!enemy.active) continue;
      enemy.update(enemyDt);

      // Aura Tossica di Krebs: stermina i nemici entro raggio di 85px
      if (!enemy.isDead && this.player.isBioAuraActive) {
        const eCenterX = enemy.x + enemy.width / 2;
        const eCenterY = enemy.y + enemy.height / 2;
        const dist = Math.hypot(playerCenterX - eCenterX, playerCenterY - eCenterY);
        if (dist <= 85) {
          enemy.die();
          this.score += 150 * scoreMultiplier;
          this.particles.emitFeathers(eCenterX, eCenterY, 10);
          this.audio.playStomp();
          this.emitHudUpdate(true);
          continue;
        }
      }

      // Fase Spettrale di Devis: attraversa i nemici senza subire danni fisici
      if (this.player.isGhostActive) {
        continue;
      }

      // Incanto Reale di Bennipi: respinge e sconfigge i nemici al tocco
      if (this.player.isCharmActive && !enemy.isDead && CollisionSystem.checkAABB(playerBox, enemy.getHitbox())) {
        enemy.die();
        this.score += 200 * scoreMultiplier;
        this.gianduiottiCount += 1;
        this.camera.triggerShake(6, 0.15);
        this.particles.emitGoldSparks(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 14);
        this.audio.playCoin();
        this.emitHudUpdate(true);
        continue;
      }

      // Scudo di Rovi di Prato: barriera di spine che trafigge e annienta i nemici al contatto
      if (this.player.isBrambleActive && !enemy.isDead && CollisionSystem.checkAABB(playerBox, enemy.getHitbox())) {
        if (enemy instanceof BossEnemy) {
          const defeated = enemy.takeHit(1);
          this.particles.emitWaterDroplets(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 18);
          if (defeated) {
            this.score += 2500 * scoreMultiplier;
            this.audio.playLevelComplete();
            this.goal.isLocked = false;
          }
        } else {
          enemy.die();
          this.score += 200 * scoreMultiplier;
          this.particles.emitWaterDroplets(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 16);
          this.audio.playStomp();
        }
        this.camera.triggerShake(6, 0.15);
        this.emitHudUpdate(true);
        continue;
      }

      if (!enemy.isDead && CollisionSystem.checkAABB(playerBox, enemy.getHitbox())) {
        // BONUS FUNGHETTI: schiaccia qualsiasi nemico o danneggia il boss anche frontalmente al tocco!
        if (this.player.hasPowerUp('funghetti')) {
          if (enemy instanceof BossEnemy) {
            const defeated = enemy.takeHit(1);
            this.camera.triggerShake(12, 0.25);
            this.audio.playStomp();
            this.particles.emitGoldSparks(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20);
            if (defeated) {
              this.score += 2500 * scoreMultiplier;
              this.particles.emitFeathers(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 40);
              this.audio.playLevelComplete();
              this.goal.isLocked = false;
            }
          } else {
            enemy.die();
            this.score += 200 * scoreMultiplier;
            this.camera.triggerShake(8, 0.2);
            this.particles.emitFeathers(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 15);
            this.audio.playStomp();
          }
          this.emitHudUpdate(true);
          continue;
        }

        // Controllo se il giocatore lo ha calpestato dall'alto (Stomp) - generoso e soddisfacente
        const isFalling = this.player.vy >= -50;
        const hitFromAbove = (this.player.y + this.player.height) <= enemy.y + enemy.height * 0.70 || prevBottom <= enemy.y + 28;

        if (enemy.isStompable && (isFalling || hitFromAbove)) {
          if (enemy instanceof BossEnemy) {
            const defeated = enemy.takeHit(1);
            this.player.bounce();
            this.camera.triggerShake(12, 0.25);
            this.audio.playStomp();
            this.particles.emitGoldSparks(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 18);
            if (defeated) {
              this.score += 2500 * scoreMultiplier;
              this.particles.emitFeathers(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 45);
              this.particles.emitGoldSparks(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 30);
              this.audio.playLevelComplete();
              this.goal.isLocked = false;
            }
          } else {
            enemy.die();
            this.player.bounce();
            this.score += 200 * scoreMultiplier;
            this.particles.emitFeathers(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 10);
          }
          this.emitHudUpdate(true);
        } else {
          // Collisione dannosa per il giocatore (annullata se sotto Marijuana o se il Boss è in i-frames)
          if (enemy instanceof BossEnemy && enemy.invulnerableTimer > 0) {
            // Nessun danno al giocatore durante il rinculo post-hit del boss
            this.player.vx = this.player.x < enemy.x ? -160 : 160;
          } else {
            const dead = this.player.takeDamage();
            if (dead) {
              this.handlePlayerDeath();
            } else if (!this.player.hasPowerUp('marijuana')) {
              this.camera.triggerShake(10, 0.25);
            }
            this.emitHudUpdate(true);
          }
        }
      }
    }

    // --- AGGIORNAMENTO PROIETTILI (PISTOLA - SKILL 2) ---
    for (const bullet of this.bullets) {
      bullet.update(dt);
      if (!bullet.active) continue;

      const bBox = bullet.getHitbox();

      // Collisione proiettile con piattaforme, blocchi sorpresa e casse distruggibili
      for (const plat of this.platforms) {
        if (!plat.active) continue;

        if (CollisionSystem.checkAABB(bBox, plat.getHitbox())) {
          if (plat.isBreakable) {
            plat.shatter();
            this.score += 150 * scoreMultiplier;
            this.audio.playExplosion();
            this.particles.emitGoldSparks(plat.x + plat.width / 2, plat.y + plat.height / 2, 12);
            this.emitHudUpdate(true);
          } else if (plat.isQuestionBlock && !plat.isHit) {
            const reward = plat.bump();
            this.camera.triggerShake(5, 0.15);
            if (reward === 'gianduiotto') {
              this.score += 100 * scoreMultiplier;
              this.gianduiottiCount += 1;
              this.audio.playCoin();
              this.particles.emitGoldSparks(plat.x + plat.width / 2, plat.y - 12, 12);
            } else if (reward) {
              this.player.activatePowerUp(reward);
              this.camera.triggerShake(7, 0.25);
            }
            this.emitHudUpdate(true);
          }
          bullet.active = false;
          this.particles.emitGoldSparks(bullet.x, bullet.y, 4);
          break;
        }
      }

      if (!bullet.active) continue;

      // Collisione proiettile con nemici e Boss
      for (const enemy of this.enemies) {
        if (enemy.active && !enemy.isDead && CollisionSystem.checkAABB(bBox, enemy.getHitbox())) {
          bullet.active = false;
          if (enemy instanceof BossEnemy) {
            const defeated = enemy.takeHit(1);
            this.camera.triggerShake(8, 0.2);
            this.audio.playStomp();
            this.particles.emitGoldSparks(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 16);
            if (defeated) {
              this.score += 2500 * scoreMultiplier;
              this.particles.emitFeathers(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 45);
              this.particles.emitGoldSparks(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 35);
              this.audio.playLevelComplete();
              this.goal.isLocked = false;
            }
          } else {
            enemy.die();
            this.score += 200 * scoreMultiplier;
            this.camera.triggerShake(7, 0.15);
            this.particles.emitFeathers(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 12);
            this.audio.playStomp();
          }
          this.emitHudUpdate(true);
          break;
        }
      }
    }
    this.bullets = this.bullets.filter((b) => b.active);

    // --- AGGIORNAMENTO BOMBE GIANDUIOTTO (SKILL 3) ---
    for (const bomb of this.bombs) {
      bomb.update(dt, this.platforms);

      // Impatto diretto su nemici prima dell'esplosione
      if (!bomb.hasExploded) {
        const bombBox = bomb.getHitbox();
        for (const enemy of this.enemies) {
          if (enemy.active && !enemy.isDead && CollisionSystem.checkAABB(bombBox, enemy.getHitbox())) {
            bomb.explode();
            break;
          }
        }
      }

      // Se appena esplosa, applica danni ad area (AoE) su nemici, boss e casse
      if (bomb.hasExploded && bomb.lifeTime <= 0.15) {
        this.audio.playExplosion();
        this.camera.triggerShake(14, 0.35);
        this.particles.emitGoldSparks(bomb.x, bomb.y, 25);
        this.particles.emitWaterDroplets(bomb.x, bomb.y, 15);

        // Rompe casse breakable nel raggio d'azione
        for (const plat of this.platforms) {
          if (plat.active && plat.isBreakable) {
            const dist = Math.hypot(plat.x + plat.width / 2 - bomb.x, plat.y + plat.height / 2 - bomb.y);
            if (dist <= bomb.explosionRadius) {
              plat.shatter();
              this.score += 150 * scoreMultiplier;
              this.particles.emitGoldSparks(plat.x + plat.width / 2, plat.y + plat.height / 2, 12);
            }
          }
        }

        // Colpisce nemici e boss nell'area
        for (const enemy of this.enemies) {
          if (enemy.active && !enemy.isDead) {
            const eCenterX = enemy.x + enemy.width / 2;
            const eCenterY = enemy.y + enemy.height / 2;
            const dist = Math.hypot(eCenterX - bomb.x, eCenterY - bomb.y);
            if (dist <= bomb.explosionRadius) {
              if (enemy instanceof BossEnemy) {
                const defeated = enemy.takeHit(2); // La bomba infligge 2 danni al Boss!
                this.camera.triggerShake(16, 0.35);
                this.particles.emitGoldSparks(eCenterX, eCenterY, 25);
                if (defeated) {
                  this.score += 2500 * scoreMultiplier;
                  this.particles.emitFeathers(eCenterX, eCenterY, 50);
                  this.audio.playLevelComplete();
                  this.goal.isLocked = false;
                }
              } else {
                enemy.die();
                this.score += 300 * scoreMultiplier;
                this.particles.emitFeathers(eCenterX, eCenterY, 15);
              }
              this.emitHudUpdate(true);
            }
          }
        }
      }
    }
    this.bombs = this.bombs.filter((b) => !b.isFinished);

    // --- TRAGUARDO (GOAL) ---
    if (CollisionSystem.checkAABB(playerBox, this.goal.getHitbox())) {
      if (this.goal.isLocked) {
        // Se il boss è ancora in vita, respingi delicatamente il giocatore
        this.player.x -= 4;
        this.player.vx = -120;
      } else {
        this.completeLevel();
        return;
      }
    }

    // Aggiornamento particelle e camera
    this.particles.update(dt);
    this.camera.update(dt, this.player.x, this.player.y, this.player.facingRight, this.player.vx);
    this.parallax.update(this.camera.x);

    // Throttled HUD update a circa 10Hz per non pesare su React
    this.hudThrottleTimer += dt;
    if (this.hudThrottleTimer >= 0.1) {
      this.hudThrottleTimer = 0;
      this.emitHudUpdate(false);
    }
  }

  private emitHudUpdate(_immediate: boolean): void {
    const data: HudData = {
      lives: this.player ? this.player.lives : 3,
      maxLives: this.player ? this.player.maxLives : 3,
      score: this.score,
      gianduiotti: this.gianduiottiCount,
      timeLeft: Math.max(0, Math.ceil(this.timeLeft)),
      currentLevelId: this.currentLevel ? this.currentLevel.id : 1,
      levelTitle: this.currentLevel ? this.currentLevel.title : 'Torino',
      activePowerUps: this.player ? this.player.getActivePowerUpsList() : [],
      activeSynergies: this.player ? this.player.getActiveSynergies() : [],
      skills: this.player ? this.player.getSkillInfo() : undefined,
    };
    this.callbacks.onHudUpdate(data);
  }

  public render(_alpha: number): void {
    // 1. Pulisci viewport Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // MALUS LSD: Distorsione visiva psichedelica arcobaleno hue-rotate
    if (this.player && this.player.hasPowerUp('lsd')) {
      const hue = Math.floor((Date.now() * 0.15) % 360);
      this.ctx.filter = `hue-rotate(${hue}deg) saturate(1.5)`;
    } else {
      this.ctx.filter = 'none';
    }

    // 2. Disegna sfondo Parallax
    this.parallax.render(this.ctx);

    // 3. Applica trasformazione Camera per il mondo di gioco
    this.camera.applyTransform(this.ctx);

    // 4. Disegna Piattaforme e blocchi sorpresa
    for (const plat of this.platforms) {
      plat.render(this.ctx);
    }

    // 5. Disegna Checkpoint (Toret)
    for (const toret of this.checkpoints) {
      toret.render(this.ctx);
    }

    // 6. Disegna Traguardo
    if (this.goal) {
      this.goal.render(this.ctx);
    }

    // 7. Disegna Collezionabili
    for (const col of this.collectibles) {
      col.render(this.ctx);
    }

    // 8. Disegna Nemici
    for (const enemy of this.enemies) {
      enemy.render(this.ctx);
    }

    // 8b. Disegna Proiettili e Bombe
    for (const bullet of this.bullets) {
      bullet.render(this.ctx);
    }
    for (const bomb of this.bombs) {
      bomb.render(this.ctx);
    }

    // 9. Disegna Giocatore
    if (this.player) {
      this.player.render(this.ctx);
    }

    // 10. Disegna Particelle
    this.particles.render(this.ctx);

    // 11. Ripristina coordinate della Camera
    this.camera.restoreTransform(this.ctx);

    // 12. Disegna Barra Boss Arcade in coordinate assolute HUD a schermo
    const activeBoss = this.enemies.find((e): e is BossEnemy => e instanceof BossEnemy && !e.isDead);
    if (activeBoss) {
      activeBoss.renderBossHealthBar(this.ctx, this.canvas.width);
    }

    // Ripristina filtri canvas
    this.ctx.filter = 'none';
  }

  public destroy(): void {
    this.loop.stop();
    this.input.destroy();
    this.audio.destroy();
  }
}
