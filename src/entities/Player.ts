import { Entity } from './Entity';
import { Physics } from '../game/core/Physics';
import { InputManager } from '../game/core/InputManager';
import { AudioManager } from '../game/audio/AudioManager';
import { ParticleSystem } from '../game/graphics/ParticleSystem';
import { Sprites } from '../game/graphics/Sprites';
import { Vector2D, Hitbox } from '../types/physics';
import { CharacterId, PowerUpType, ActivePowerUpInfo, SynergyInfo, SkillInfo } from '../types/game';
import { getCharacterConfig } from '../characters';

export type PlayerState = 'idle' | 'running' | 'jumping' | 'falling' | 'hurt' | 'dead' | 'victory';

export class Player extends Entity {
  public state: PlayerState = 'idle';
  public facingRight: boolean = true;
  public isGrounded: boolean = false;
  private wasGrounded: boolean = false;

  // Timers di game feel
  public coyoteTimer: number = 0;
  public invincibleTimer: number = 0;

  // Sistema Power-Up avanzato: COMBINAZIONI MULTIPLE CONCURRENTI (Map di tipo -> secondi rimanenti)
  public activePowerUps: Map<PowerUpType, number> = new Map();
  public readonly maxPowerUpDuration: number = 12.0; // Durata di 12s per ciascun effetto
  public hasDoubleJumped: boolean = false;

  // --- SELEZIONE PERSONAGGIO & SUPER-ABILITÀ (BARRA SPAZIATRICE) ---
  public characterId: CharacterId = 'shhte';
  public specialSkillCooldown: number = 0;
  public maxSpecialCooldown: number = 12.0;

  // Stati temporanei delle abilità speciali
  public isMatrixActive: boolean = false;
  public matrixTimer: number = 0;
  public isGliding: boolean = false;
  public glideTimer: number = 0;
  public isBioAuraActive: boolean = false;
  public bioAuraTimer: number = 0;
  public isGhostActive: boolean = false;
  public ghostTimer: number = 0;
  public isCharmActive: boolean = false;
  public charmTimer: number = 0;

  // Callbacks per GameEngine
  public onSpecialSkill?: (characterId: CharacterId) => void;
  public onGroundSlam?: (x: number, y: number, radius: number) => void;
  public onSpreadShot?: (x: number, y: number, facingRight: boolean) => void;
  public onJackpotShower?: (x: number, y: number) => void;
  public onCharmBurst?: (x: number, y: number, radius: number) => void;

  // --- SISTEMA SKILL TATTICHE (Tastierino Numerico 1, 2, 3) ---
  public isSliding: boolean = false;
  public slideTimer: number = 0;
  public slideCooldown: number = 0;
  public readonly SLIDE_DURATION: number = 0.35;
  public readonly SLIDE_COOLDOWN_MAX: number = 0.7;

  public shootCooldown: number = 0;
  public readonly SHOOT_COOLDOWN_MAX: number = 0.35;

  public bombCooldown: number = 0;
  public readonly BOMB_COOLDOWN_MAX: number = 1.3;

  public onShoot?: (x: number, y: number, facingRight: boolean) => void;
  public onBomb?: (x: number, y: number, facingRight: boolean) => void;

  // Salute e checkpoint
  public lives: number = 3;
  public readonly maxLives: number = 3;
  public respawnPoint: Vector2D;

  // Riferimenti ai sistemi
  private audio: AudioManager;
  private particles: ParticleSystem;

  constructor(
    id: string,
    x: number,
    y: number,
    audio: AudioManager,
    particles: ParticleSystem,
    characterId: CharacterId = 'shhte'
  ) {
    super(id, x, y, 32, 48);
    this.respawnPoint = { x, y };
    this.audio = audio;
    this.particles = particles;
    this.characterId = characterId;
    this.maxSpecialCooldown = getCharacterConfig(characterId).skillCooldown;
  }

  public setCharacter(characterId: CharacterId): void {
    this.characterId = characterId;
    this.maxSpecialCooldown = getCharacterConfig(characterId).skillCooldown;
    this.specialSkillCooldown = 0;
    this.isMatrixActive = false;
    this.matrixTimer = 0;
    this.isGliding = false;
    this.glideTimer = 0;
    this.isBioAuraActive = false;
    this.bioAuraTimer = 0;
    this.isGhostActive = false;
    this.ghostTimer = 0;
    this.isCharmActive = false;
    this.charmTimer = 0;
  }

  public override getHitbox(): Hitbox {
    if (this.isSliding) {
      return {
        x: this.x,
        y: this.y + 24,
        width: this.width,
        height: 24,
      };
    }
    return super.getHitbox();
  }

  public getSkillInfo(): SkillInfo {
    const slideTimeLeft = Math.max(0, this.slideCooldown);
    const shootTimeLeft = Math.max(0, this.shootCooldown);
    const bombTimeLeft = Math.max(0, this.bombCooldown);
    const specialTimeLeft = Math.max(0, this.specialSkillCooldown);
    const charConfig = getCharacterConfig(this.characterId);

    return {
      slideReady: slideTimeLeft <= 0,
      slideCooldownRatio: this.SLIDE_COOLDOWN_MAX > 0 ? slideTimeLeft / this.SLIDE_COOLDOWN_MAX : 0,
      slideTimeLeft,
      shootReady: shootTimeLeft <= 0,
      shootCooldownRatio: this.SHOOT_COOLDOWN_MAX > 0 ? shootTimeLeft / this.SHOOT_COOLDOWN_MAX : 0,
      shootTimeLeft,
      bombReady: bombTimeLeft <= 0,
      bombCooldownRatio: this.BOMB_COOLDOWN_MAX > 0 ? bombTimeLeft / this.BOMB_COOLDOWN_MAX : 0,
      bombTimeLeft,
      characterId: this.characterId,
      characterName: charConfig.name,
      specialSkillName: charConfig.skillName,
      specialSkillReady: specialTimeLeft <= 0,
      specialSkillCooldownRatio: this.maxSpecialCooldown > 0 ? specialTimeLeft / this.maxSpecialCooldown : 0,
      specialSkillTimeLeft: specialTimeLeft,
    };
  }

  public triggerSpecialSkill(): void {
    if (this.specialSkillCooldown > 0) return;
    this.specialSkillCooldown = this.maxSpecialCooldown;

    this.audio.playPowerUp();

    switch (this.characterId) {
      case 'shhte':
        // Matrix Overclock: 4s tempo rallentato per nemici e super corsa
        this.isMatrixActive = true;
        this.matrixTimer = 4.0;
        this.particles.emitGoldSparks(this.x + this.width / 2, this.y + this.height / 2, 24);
        this.onSpecialSkill?.('shhte');
        break;

      case 'ugo':
        // Terremoto Sismico dei Murazzi
        this.particles.emitDust(this.x + this.width / 2, this.y + this.height, 30);
        this.onGroundSlam?.(this.x + this.width / 2, this.y + this.height, 450);
        this.onSpecialSkill?.('ugo');
        break;

      case 'jari':
        // Salto Jet & Planata Reale
        this.vy = -720;
        this.isGrounded = false;
        this.isGliding = true;
        this.glideTimer = 3.5;
        this.particles.emitGoldSparks(this.x + this.width / 2, this.y + this.height, 25);
        this.onSpecialSkill?.('jari');
        break;

      case 'jonson':
        // Raffica a ventaglio 5x
        this.onSpreadShot?.(
          this.facingRight ? this.x + this.width + 4 : this.x - 16,
          this.y + 16,
          this.facingRight
        );
        this.particles.emitGoldSparks(this.x + this.width / 2, this.y + 16, 15);
        this.onSpecialSkill?.('jonson');
        break;

      case 'krebs':
        // Bio-Aura Tossica & Cura +1 Cuore
        this.isBioAuraActive = true;
        this.bioAuraTimer = 5.0;
        if (this.lives < this.maxLives) {
          this.lives++;
        }
        this.particles.emitWaterDroplets(this.x + this.width / 2, this.y + this.height / 2, 25);
        this.onSpecialSkill?.('krebs');
        break;

      case 'devis':
        // Fase Spettrale Incorporea
        this.isGhostActive = true;
        this.ghostTimer = 4.0;
        this.particles.emitFeathers(this.x + this.width / 2, this.y + this.height / 2, 20);
        this.onSpecialSkill?.('devis');
        break;

      case 'willy':
        // Jackpot Sabaudo (Pioggia di gianduiotti dorati & buff)
        this.onJackpotShower?.(this.x + this.width / 2, this.y - 120);
        this.onSpecialSkill?.('willy');
        break;

      case 'benedetta':
        // Incanto Reale & Pioggia di Cuori
        this.isCharmActive = true;
        this.charmTimer = 4.0;
        this.particles.emitGoldSparks(this.x + this.width / 2, this.y + this.height / 2, 30);
        this.onCharmBurst?.(this.x + this.width / 2, this.y + this.height / 2, 380);
        this.onSpecialSkill?.('benedetta');
        break;
    }
  }

  public setCheckpoint(x: number, y: number): void {
    this.respawnPoint = { x, y };
  }

  /**
   * Attiva o ricarica un power-up/sostanza senza sovrascrivere gli altri già attivi (effetti cumulabili!)
   */
  public activatePowerUp(type: PowerUpType): void {
    this.activePowerUps.set(type, this.maxPowerUpDuration);
    this.audio.playPowerUp();

    // Effetti speciali istantanei al consumo
    if (type === 'marijuana') {
      this.lives = Math.min(this.maxLives, this.lives + 1);
      this.particles.emitWaterDroplets(this.x + this.width / 2, this.y, 14);
    } else if (type === 'cocaina') {
      this.particles.emitDust(this.x + this.width / 2, this.y + this.height / 2, 16);
    } else if (type === 'lsd') {
      this.hasDoubleJumped = false;
      this.particles.emitGoldSparks(this.x + this.width / 2, this.y, 18);
    } else if (type === 'funghetti') {
      this.particles.emitGoldSparks(this.x + this.width / 2, this.y, 22);
    } else if (type === 'md') {
      this.particles.emitGoldSparks(this.x + this.width / 2, this.y, 16);
    }
  }

  public hasPowerUp(type: PowerUpType): boolean {
    return (this.activePowerUps.get(type) ?? 0) > 0;
  }

  public hasAnyPowerUp(): boolean {
    return this.activePowerUps.size > 0;
  }

  /**
   * Ritorna la lista di tutte le sostanze attive con i rispettivi bonus/malus e timer
   */
  public getActivePowerUpsList(): ActivePowerUpInfo[] {
    const list: ActivePowerUpInfo[] = [];

    for (const [type, timer] of this.activePowerUps.entries()) {
      if (timer <= 0) continue;
      const percent = Math.max(0, Math.min(1, timer / this.maxPowerUpDuration));
      const durationLeft = Math.ceil(timer);

      switch (type) {
        case 'cocaina':
          list.push({
            type: 'cocaina',
            name: 'COCAINA',
            durationLeft,
            durationPercent: percent,
            bonusText: '⚡ Super Velocità (+70%) & Super Salto (+25%)',
            malusText: '⚠️ Cuore fragile: danni subiti raddoppiati!',
            color: '#06b6d4',
          });
          break;
        case 'marijuana':
          list.push({
            type: 'marijuana',
            name: 'MARIJUANA',
            durationLeft,
            durationPercent: percent,
            bonusText: '🛡️ +1 Vita & Nemici completamente innocui',
            malusText: '🐌 Movimenti rallentati (-35%)',
            color: '#22c55e',
          });
          break;
        case 'md':
          list.push({
            type: 'md',
            name: 'MDMA (PASTICCA)',
            durationLeft,
            durationPercent: percent,
            bonusText: '✨ Punti x2 & Magnete Gianduiotti',
            malusText: '🧊 Scivoli come sul ghiaccio (attrito ridotto)',
            color: '#ec4899',
          });
          break;
        case 'lsd':
          list.push({
            type: 'lsd',
            name: 'LSD (BLOTTER)',
            durationLeft,
            durationPercent: percent,
            bonusText: '🌀 Doppio Salto a mezz\'aria sbloccato',
            malusText: '🌈 Distorsione visiva psichedelica',
            color: '#a855f7',
          });
          break;
        case 'funghetti':
          list.push({
            type: 'funghetti',
            name: 'FUNGHETTI',
            durationLeft,
            durationPercent: percent,
            bonusText: '🍄 Gigante: schiaccia i nemici anche frontalmente',
            malusText: '🧱 Corpo enorme e caduta pesante',
            color: '#f59e0b',
          });
          break;
      }
    }

    return list;
  }

  /**
   * Rileva combinazioni sinergiche speciali tra sostanze assunte insieme!
   */
  public getActiveSynergies(): SynergyInfo[] {
    const synergies: SynergyInfo[] = [];

    const hasCocaina = this.hasPowerUp('cocaina');
    const hasMarijuana = this.hasPowerUp('marijuana');
    const hasMD = this.hasPowerUp('md');
    const hasLSD = this.hasPowerUp('lsd');
    const hasFunghetti = this.hasPowerUp('funghetti');

    // 1. SINERGIA SPEEDBALL SABAUDO (Cocaina + Marijuana)
    if (hasCocaina && hasMarijuana) {
      synergies.push({
        id: 'speedball',
        name: '⚡🌿 SPEEDBALL SABAUDO',
        description: 'Immunità totale ai nemici con super velocità e salto amplificato!',
        badge: 'SPEEDBALL',
        color: '#10b981',
      });
    }

    // 2. SINERGIA CANDYFLIP (MD + LSD)
    if (hasMD && hasLSD) {
      synergies.push({
        id: 'candyflip',
        name: '✨🌀 CANDYFLIP COSMICO',
        description: 'Doppio salto fluttuante con magnetismo dorato totale e punti x2!',
        badge: 'CANDYFLIP',
        color: '#f43f5e',
      });
    }

    // 3. SINERGIA MEGA-TRIP (Funghetti + LSD)
    if (hasFunghetti && hasLSD) {
      synergies.push({
        id: 'megatrip',
        name: '🍄🌀 COLOSSO PSICHEDELICO',
        description: 'Gigante con doppio salto a mezz\'aria inarrestabile!',
        badge: 'MEGA-TRIP',
        color: '#8b5cf6',
      });
    }

    // 4. SINERGIA ULTRA POLYDOPING (3 o più sostanze attive insieme!)
    if (this.activePowerUps.size >= 3) {
      synergies.push({
        id: 'polydoping',
        name: '🔥👑 POLYDOPING DEI MURAZZI',
        description: 'Potere sovrano sabaudo: Moltiplicatore punti moltiplicato a x3!',
        badge: 'POLYDOPING x3',
        color: '#ffb703',
      });
    }

    return synergies;
  }

  public takeDamage(): boolean {
    if (this.invincibleTimer > 0 || this.state === 'dead' || this.state === 'victory' || this.isGhostActive || this.isCharmActive) {
      return false;
    }

    // SE HA MARIJUANA ATTIVA: I nemici non fanno male in nessun caso!
    if (this.hasPowerUp('marijuana')) {
      this.particles.emitWaterDroplets(this.x + this.width / 2, this.y + this.height / 2, 6);
      return false;
    }

    // SE HA FUNGHETTI ATTIVI: assorbe il danno tornando di dimensioni normali, salvando le vite
    if (this.hasPowerUp('funghetti')) {
      this.activePowerUps.delete('funghetti');
      this.invincibleTimer = 1.4;
      this.audio.playHurt();
      this.particles.emitGoldSparks(this.x + this.width / 2, this.y + this.height / 2, 14);
      return false;
    }

    // SE HA COCAINA ATTIVA: cuore fragile, subisce danno doppio (perde 2 vite)!
    const damage = this.hasPowerUp('cocaina') ? 2 : 1;
    this.lives -= damage;
    this.audio.playHurt();
    this.particles.emitFeathers(this.x + this.width / 2, this.y + this.height / 2, 10);

    if (this.lives <= 0) {
      this.die();
      return true;
    } else {
      this.invincibleTimer = 1.8;
      this.vy = -380;
      return false;
    }
  }

  public die(): void {
    if (this.state === 'dead') return;
    this.state = 'dead';
    this.vy = -520;
    this.vx = 0;
    this.isSliding = false;
    this.slideTimer = 0;
    this.isMatrixActive = false;
    this.isGliding = false;
    this.isBioAuraActive = false;
    this.isGhostActive = false;
    this.isCharmActive = false;
    this.charmTimer = 0;
    this.activePowerUps.clear();
    this.audio.playDeath();
  }

  public respawn(): void {
    this.x = this.respawnPoint.x;
    this.y = this.respawnPoint.y;
    this.vx = 0;
    this.vy = 0;
    this.isSliding = false;
    this.slideTimer = 0;
    this.isMatrixActive = false;
    this.isGliding = false;
    this.isBioAuraActive = false;
    this.isGhostActive = false;
    this.isCharmActive = false;
    this.charmTimer = 0;
    this.state = 'idle';
    this.invincibleTimer = 1.5;
    this.activePowerUps.clear();
  }

  public bounce(): void {
    this.vy = Physics.BOUNCE_FORCE;
    this.isGrounded = false;
    this.coyoteTimer = 0;
    this.hasDoubleJumped = false;
    this.audio.playStomp();
  }

  public handleInput(input: InputManager, dt: number): void {
    if (this.state === 'dead' || this.state === 'victory') return;

    // --- AGGIORNAMENTO COOLDOWN DELLE SKILL ---
    this.slideCooldown = Math.max(0, this.slideCooldown - dt);
    this.shootCooldown = Math.max(0, this.shootCooldown - dt);
    this.bombCooldown = Math.max(0, this.bombCooldown - dt);
    this.specialSkillCooldown = Math.max(0, this.specialSkillCooldown - dt);

    // Aggiorna ciascun timer indipendente delle sostanze
    for (const [type, timer] of this.activePowerUps.entries()) {
      const remaining = timer - dt;
      if (remaining <= 0) {
        this.activePowerUps.delete(type);
      } else {
        this.activePowerUps.set(type, remaining);
      }
    }

    // CALCOLO VELOCITÀ COMBINATA
    let speedMult = 1.0;
    if (this.hasPowerUp('cocaina')) speedMult *= 1.7; // +70%
    if (this.hasPowerUp('marijuana')) speedMult *= 0.65; // -35%
    if (this.hasPowerUp('funghetti')) speedMult *= 0.9; // un po' più pesante
    if (this.isMatrixActive) speedMult *= 1.8; // Shhte Matrix Overclock
    if (this.isGhostActive) speedMult *= 1.6; // Devis Phantom Dash

    // SUPER-ABILITÀ DEL PERSONAGGIO (Tasto SPACE o Touch ⭐ SPECIAL)
    if (this.specialSkillCooldown <= 0 && input.consumeSpecialSkill()) {
      this.triggerSpecialSkill();
    }

    // SKILL 1: SCIVOLATA (Numpad 1 / 1 / J)
    if (this.isGrounded && !this.isSliding && this.slideCooldown <= 0 && input.consumeSkill1()) {
      this.isSliding = true;
      this.slideTimer = this.SLIDE_DURATION;
      this.slideCooldown = this.SLIDE_COOLDOWN_MAX;
      this.audio.playSlide();
      this.particles.emitDust(this.x + this.width / 2, this.y + this.height, 10);
    }

    if (this.isSliding) {
      this.slideTimer -= dt;
      this.vx = (this.facingRight ? 1 : -1) * Physics.WALK_SPEED * 1.85 * speedMult;
      if (Math.random() < 0.35) {
        this.particles.emitDust(this.x + (this.facingRight ? 0 : this.width), this.y + this.height, 2);
      }
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    // SKILL 2: SPARO CON LA PISTOLA (Numpad 2 / 2 / K)
    if (this.shootCooldown <= 0 && input.consumeSkill2()) {
      this.shootCooldown = this.SHOOT_COOLDOWN_MAX;
      this.audio.playShoot();
      const bulletX = this.facingRight ? this.x + this.width + 4 : this.x - 16;
      const bulletY = this.y + (this.isSliding ? 28 : 18);
      this.onShoot?.(bulletX, bulletY, this.facingRight);
      this.particles.emitGoldSparks(bulletX, bulletY, 6);
    }

    // SKILL 3: BOMBA AL GIANDUIOTTO (Numpad 3 / 3 / L)
    if (this.bombCooldown <= 0 && input.consumeSkill3()) {
      this.bombCooldown = this.BOMB_COOLDOWN_MAX;
      this.audio.playJump();
      const bombX = this.facingRight ? this.x + this.width + 4 : this.x - 18;
      const bombY = this.y + 10;
      this.onBomb?.(bombX, bombY, this.facingRight);
      this.particles.emitGoldSparks(bombX, bombY, 8);
    }

    if (!this.isSliding) {
      const baseSpeed = input.isRun() ? Physics.RUN_SPEED : Physics.WALK_SPEED;
      const targetSpeed = baseSpeed * speedMult;

      // ACCELERAZIONE & DECELERAZIONE (Malus MD scivolamento)
      let accel = this.isGrounded ? Physics.ACCELERATION_GROUND : Physics.ACCELERATION_AIR;
      let decel = this.isGrounded ? Physics.DECELERATION_GROUND : Physics.DECELERATION_AIR;

      if (this.hasPowerUp('md')) {
        decel *= 0.18; // Scivola come sul ghiaccio!
      }

      if (input.isLeft()) {
        this.facingRight = false;
        if (this.vx > 0) {
          this.vx -= decel * dt;
        } else {
          this.vx = Math.max(-targetSpeed, this.vx - accel * dt);
        }
      } else if (input.isRight()) {
        this.facingRight = true;
        if (this.vx < 0) {
          this.vx += decel * dt;
        } else {
          this.vx = Math.min(targetSpeed, this.vx + accel * dt);
        }
      } else {
        if (this.vx > 0) {
          this.vx = Math.max(0, this.vx - decel * dt);
        } else if (this.vx < 0) {
          this.vx = Math.min(0, this.vx + decel * dt);
        }
      }

      if (Math.abs(this.vx) < Physics.MIN_MOVE_EPSILON) {
        this.vx = 0;
      }
    }

    // COYOTE TIME & RESET DOPPIO SALTO
    if (this.isGrounded) {
      this.coyoteTimer = Physics.COYOTE_TIME;
      this.hasDoubleJumped = false;
      this.isGliding = false;
    } else {
      this.coyoteTimer -= dt;
    }

    // FORZA DEL SALTO COMBINATA
    let jumpMult = 1.0;
    if (this.hasPowerUp('cocaina')) jumpMult *= 1.25; // Salto super con cocaina
    if (this.hasPowerUp('marijuana')) jumpMult *= 0.92; // Salto morbido con marijuana

    const currentJumpForce = Physics.JUMP_FORCE * jumpMult;

    // 1. Salto Standard da terra o coyote time
    if ((this.isGrounded || this.coyoteTimer > 0) && input.consumeJump()) {
      this.vy = currentJumpForce;
      this.isGrounded = false;
      this.coyoteTimer = 0;
      this.audio.playJump();
      this.particles.emitDust(this.x + this.width / 2, this.y + this.height, 6);
    }
    // 2. BONUS LSD: DOPPIO SALTO A MEZZ'ARIA
    else if (!this.isGrounded && this.hasPowerUp('lsd') && !this.hasDoubleJumped && input.consumeJump()) {
      this.vy = currentJumpForce * 0.95;
      this.hasDoubleJumped = true;
      this.audio.playJump();
      this.particles.emitGoldSparks(this.x + this.width / 2, this.y + this.height / 2, 14);
    }

    // Variable Jump Cut per controllo millimetrico
    if (!input.isJumpHeld && this.vy < Physics.JUMP_CUT_LIMIT && !this.isGliding) {
      this.vy = Physics.JUMP_CUT_LIMIT;
    }
  }

  public update(dt: number): void {
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= dt;
    }

    // Cooldown delle abilità attive
    if (this.slideCooldown > 0) {
      this.slideCooldown = Math.max(0, this.slideCooldown - dt);
    }
    if (this.shootCooldown > 0) {
      this.shootCooldown = Math.max(0, this.shootCooldown - dt);
    }
    if (this.bombCooldown > 0) {
      this.bombCooldown = Math.max(0, this.bombCooldown - dt);
    }
    if (this.specialSkillCooldown > 0) {
      this.specialSkillCooldown = Math.max(0, this.specialSkillCooldown - dt);
    }

    // Aggiornamento timer super-abilità del personaggio
    if (this.isMatrixActive) {
      this.matrixTimer -= dt;
      if (this.matrixTimer <= 0) this.isMatrixActive = false;
    }
    if (this.isGliding) {
      this.glideTimer -= dt;
      if (this.glideTimer <= 0 || this.isGrounded) this.isGliding = false;
    }
    if (this.isBioAuraActive) {
      this.bioAuraTimer -= dt;
      if (this.bioAuraTimer <= 0) this.isBioAuraActive = false;
    }
    if (this.isGhostActive) {
      this.ghostTimer -= dt;
      if (this.ghostTimer <= 0) this.isGhostActive = false;
    }
    if (this.isCharmActive) {
      this.charmTimer -= dt;
      if (this.charmTimer <= 0) this.isCharmActive = false;
    }

    // Effetto planata morbida ad aria di Jari
    if (this.isGliding && this.vy > 35) {
      this.vy = 35;
    }

    // GRAVITÀ COMBINATA (fluttuante con marijuana o planata, pesante con funghetti)
    let gravity = Physics.GRAVITY;
    if (this.isGliding) gravity *= 0.15;
    else if (this.hasPowerUp('marijuana')) gravity *= 0.68;
    if (this.hasPowerUp('funghetti')) gravity *= 1.15;

    this.vy += gravity * dt;
    if (this.vy > Physics.MAX_FALL_SPEED) {
      this.vy = Physics.MAX_FALL_SPEED;
    }

    // Particelle di corsa
    if (this.isGrounded && Math.abs(this.vx) > Physics.WALK_SPEED * 0.7 && Math.random() < 0.3) {
      this.particles.emitDust(this.x + (this.facingRight ? 4 : this.width - 4), this.y + this.height, 2);
    }

    // Rilevamento atterraggio
    if (!this.wasGrounded && this.isGrounded) {
      this.particles.emitDust(this.x + this.width / 2, this.y + this.height, 5);
      this.hasDoubleJumped = false;
      this.isGliding = false;
    }
    this.wasGrounded = this.isGrounded;

    // FSM
    if (this.state !== 'dead' && this.state !== 'victory') {
      if (!this.isGrounded) {
        this.state = this.vy < 0 ? 'jumping' : 'falling';
      } else if (Math.abs(this.vx) > 10) {
        this.state = 'running';
      } else {
        this.state = 'idle';
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    Sprites.drawPlayerCombined(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      this.facingRight,
      this.isGrounded,
      this.vx,
      this.vy,
      this.invincibleTimer,
      this.activePowerUps,
      this.isSliding,
      this.characterId,
      this.isGhostActive,
      this.isBioAuraActive,
      this.isCharmActive
    );
  }
}
