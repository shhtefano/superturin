import { EngineCallbacks, GameStatus, HudData } from '../../types/game';
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

    // 1. Inizializza Piattaforme (con blocchi interrogativi e piattaforme mobili)
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
          p.moveSpeed ?? 1.5
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

    // 4. Inizializza Nemici (Piccioni, Tram, Torinese, Scoiattolo)
    this.enemies = levelData.enemies.map((e) => {
      if (e.type === 'tram') {
        return new Tram(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
      } else if (e.type === 'angryLocal') {
        return new AngryLocal(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
      } else if (e.type === 'squirrel') {
        return new Squirrel(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
      }
      return new Pigeon(e.id, e.x, e.y, e.patrolLeft, e.patrolRight);
    });

    // 5. Inizializza Goal
    this.goal = new Goal('level_goal', levelData.goal.x, levelData.goal.y);

    // 6. Inizializza Player
    this.player = new Player(
      'player_hero',
      levelData.playerStart.x,
      levelData.playerStart.y,
      this.audio,
      this.particles
    );

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
    if (this.player.activePowerUp === 'cocaina' && Math.random() < 0.35) {
      this.camera.triggerShake(2, 0.05);
    }

    // BONUS MD: Magnete Gianduiotti (attira a sé le monete entro 260px)
    if (this.player.activePowerUp === 'md') {
      const pCenterX = this.player.x + this.player.width / 2;
      const pCenterY = this.player.y + this.player.height / 2;
      for (const col of this.collectibles) {
        if (!col.collected && col instanceof PowerUpItem && col.itemType === 'gianduiotto') {
          const cCenterX = col.x + col.width / 2;
          const cCenterY = col.y + col.height / 2;
          const dx = pCenterX - cCenterX;
          const dy = pCenterY - cCenterY;
          const dist = Math.hypot(dx, dy);
          if (dist < 260 && dist > 5) {
            const speed = 440;
            col.x += (dx / dist) * speed * dt;
            col.y += (dy / dist) * speed * dt;
          }
        }
      }
    }

    // --- RISOLUZIONE COLLISIONI FISICHE DEL GIOCATORE ---
    const prevBottom = this.player.y + this.player.height;

    // 1. Spostamento orizzontale e collisione con muri
    this.player.x += this.player.vx * dt;
    let playerBox = this.player.getHitbox();

    for (const plat of this.platforms) {
      if (plat.isOneWay) continue;
      const res = CollisionSystem.resolveHorizontal(playerBox, this.player.vx, plat.getHitbox());
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
      } else if (res.hitCeiling) {
        this.player.y = res.resolvedY;
        this.player.vy = 0;
        playerBox = this.player.getHitbox();

        // MECCANICA SUPER MARIO: Colpito blocco sorpresa "?" da sotto con la testa
        if (plat.isQuestionBlock && !plat.isHit) {
          const reward = plat.bump();
          this.camera.triggerShake(5, 0.15);

          if (reward === 'gianduiotto') {
            const mult = this.player.activePowerUp === 'md' ? 2 : 1;
            this.score += 100 * mult;
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
              const mult = this.player.activePowerUp === 'md' ? 2 : 1;
              this.score += col.value * mult;
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
    for (const enemy of this.enemies) {
      if (!enemy.active) continue;
      enemy.update(dt);

      if (!enemy.isDead && CollisionSystem.checkAABB(playerBox, enemy.getHitbox())) {
        // BONUS FUNGHETTI: schiaccia qualsiasi nemico anche frontalmente al tocco (Mega Mario)!
        if (this.player.activePowerUp === 'funghetti') {
          enemy.die();
          this.score += 200;
          this.camera.triggerShake(8, 0.2);
          this.particles.emitFeathers(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 15);
          this.audio.playStomp();
          this.emitHudUpdate(true);
          continue;
        }

        // Controllo se il giocatore lo ha calpestato dall'alto (Stomp)
        const isFalling = this.player.vy > 50;
        const hitFromAbove = prevBottom <= enemy.y + 20;

        if (enemy.isStompable && isFalling && hitFromAbove) {
          enemy.die();
          this.player.bounce();
          const mult = this.player.activePowerUp === 'md' ? 2 : 1;
          this.score += 200 * mult;
          this.particles.emitFeathers(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 10);
          this.emitHudUpdate(true);
        } else {
          // Collisione dannosa per il giocatore (annullata se sotto Marijuana!)
          const dead = this.player.takeDamage();
          if (dead) {
            this.handlePlayerDeath();
          } else if (this.player.activePowerUp !== 'marijuana') {
            this.camera.triggerShake(10, 0.25);
          }
          this.emitHudUpdate(true);
        }
      }
    }

    // --- TRAGUARDO (GOAL) ---
    if (CollisionSystem.checkAABB(playerBox, this.goal.getHitbox())) {
      this.completeLevel();
      return;
    }

    // Aggiornamento particelle e camera
    this.particles.update(dt);
    this.camera.update(dt, this.player.x, this.player.y, this.player.facingRight);
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
      activePowerUp: this.player ? this.player.getActivePowerUpInfo() : null,
    };
    this.callbacks.onHudUpdate(data);
  }

  public render(_alpha: number): void {
    // 1. Pulisci viewport Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // MALUS LSD: Distorsione visiva psichedelica arcobaleno hue-rotate
    if (this.player && this.player.activePowerUp === 'lsd') {
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

    // 9. Disegna Giocatore
    if (this.player) {
      this.player.render(this.ctx);
    }

    // 10. Disegna Particelle
    this.particles.render(this.ctx);

    // 11. Ripristina coordinate della Camera
    this.camera.restoreTransform(this.ctx);

    // Ripristina filtri canvas
    this.ctx.filter = 'none';
  }

  public destroy(): void {
    this.loop.stop();
    this.input.destroy();
    this.audio.destroy();
  }
}
