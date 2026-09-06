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
  public isBrambleActive: boolean = false; // Prato: Scudo di rovi
  public brambleTimer: number = 0;

  // Callbacks per GameEngine
  public onSpecialSkill?: (characterId: CharacterId) => void;
  public onGroundSlam?: (x: number, y: number, radius: number) => void;
  public onSpreadShot?: (x: number, y: number, facingRight: boolean) => void;
  public onJackpotShower?: (x: number, y: number) => void;
  public onCharmBurst?: (x: number, y: number, radius: number) => void;
  public onGlamourBeam?: (x: number, y: number, facingRight: boolean) => void;
  public onEmpBurst?: (x: number, y: number, radius: number) => void;
  public onAlpineDash?: (x: number, y: number, facingRight: boolean) => void;
  public onTitanSmash?: (x: number, y: number, radius: number) => void;
  public onBassDrop?: (x: number, y: number, radius: number) => void;

  // --- SISTEMA SKILL TATTICHE (Tasti 1 e 2) ---
  public shootCooldown: number = 0;
  public readonly SHOOT_COOLDOWN_MAX: number = 0.28;

  public bombCooldown: number = 0;
  public readonly BOMB_COOLDOWN_MAX: number = 0.75;

  public onShoot?: (x: number, y: number, facingRight: boolean) => void;
  public onBomb?: (x: number, y: number, facingRight: boolean) => void;

  // Salute e checkpoint (4 vite per un gameplay accessibile e rilassante)
  public lives: number = 4;
  public readonly maxLives: number = 4;
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
    this.isBrambleActive = false;
    this.brambleTimer = 0;
  }

  public override getHitbox(): Hitbox {
    // Leggero inset laterale per evitare di incastrarsi o subire danni ingiusti sui bordi delle piattaforme
    const insetX = 3;
    return {
      x: this.x + insetX,
      y: this.y,
      width: this.width - insetX * 2,
      height: this.height,
    };
  }

  public getSkillInfo(): SkillInfo {
    const shootTimeLeft = Math.max(0, this.shootCooldown);
    const bombTimeLeft = Math.max(0, this.bombCooldown);
    const specialTimeLeft = Math.max(0, this.specialSkillCooldown);
    const charConfig = getCharacterConfig(this.characterId);

    return {
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

      case 'alessiuccia':
        // Fascio Glamour & Raggio Arcobaleno (abbaglia i nemici e cura +1 Cuore)
        if (this.lives < this.maxLives) {
          this.lives++;
        }
        this.particles.emitGoldSparks(this.x + this.width / 2, this.y + this.height / 2, 35);
        this.onGlamourBeam?.(this.x + (this.facingRight ? this.width : 0), this.y + 16, this.facingRight);
        this.onSpecialSkill?.('alessiuccia');
        break;

      case 'ludo':
        // EMP Glitch Sonico (scarica a 360° e ricarica istantanea colpi)
        this.shootCooldown = 0;
        this.bombCooldown = 0;
        this.particles.emitWaterDroplets(this.x + this.width / 2, this.y + this.height / 2, 25);
        this.particles.emitGoldSparks(this.x + this.width / 2, this.y + this.height / 2, 25);
        this.onEmpBurst?.(this.x + this.width / 2, this.y + this.height / 2, 420);
        this.onSpecialSkill?.('ludo');
        break;

      case 'ariannuccia':
        // Scatto Fionda Alpina (super spinta e invulnerabilità per 3s)
        this.vx = (this.facingRight ? 1 : -1) * 780;
        this.vy = -380;
        this.isGrounded = false;
        this.invincibleTimer = 3.0;
        this.particles.emitDust(this.x + this.width / 2, this.y + this.height, 20);
        this.onAlpineDash?.(this.x, this.y + this.height / 2, this.facingRight);
        this.onSpecialSkill?.('ariannuccia');
        break;

      case 'prato':
        // Scudo di Rovi Rampicanti (barriera protettiva per 5s e cura +1)
        this.isBrambleActive = true;
        this.brambleTimer = 5.0;
        if (this.lives < this.maxLives) {
          this.lives++;
        }
        this.particles.emitWaterDroplets(this.x + this.width / 2, this.y + this.height / 2, 30);
        this.onSpecialSkill?.('prato');
        break;

      case 'sandrone':
        // Maglio Sismico d'Acciaio FIAT (schianto tellurico a terra nel raggio di 520px)
        this.particles.emitDust(this.x + this.width / 2, this.y + this.height, 40);
        this.onTitanSmash?.(this.x + this.width / 2, this.y + this.height, 520);
        this.onSpecialSkill?.('sandrone');
        break;

      case 'vinzert':
        // Subwoofer Bass Drop 808 (drop a 360° e magnete monete x2 per 6s)
        this.isCharmActive = true;
        this.charmTimer = 6.0;
        this.particles.emitGoldSparks(this.x + this.width / 2, this.y + this.height / 2, 40);
        this.onBassDrop?.(this.x + this.width / 2, this.y + this.height / 2, 420);
        this.onSpecialSkill?.('vinzert');
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
            icon: '⚡',
            durationLeft,
            durationPercent: percent,
            bonusText: '⚡ Super Velocità (+50%) & Super Salto (+25%)',
            malusText: '⚠️ Frenesia visiva arcade',
            color: '#06b6d4',
            badges: [
              { icon: '⚡', label: '+50% SPD', type: 'bonus', tooltip: 'Velocità corsa +50%' },
              { icon: '⬆️', label: '+25% JMP', type: 'bonus', tooltip: 'Salto +25%' },
              { icon: '🌀', label: 'RUSH', type: 'malus', tooltip: 'Frenesia visiva' },
            ],
          });
          break;
        case 'marijuana':
          list.push({
            type: 'marijuana',
            name: 'MARIJUANA',
            icon: '🌿',
            durationLeft,
            durationPercent: percent,
            bonusText: '🛡️ +1 Vita & Nemici completamente innocui',
            malusText: '🐌 Ritmo rilassato (-15% velocità)',
            color: '#22c55e',
            badges: [
              { icon: '❤️', label: '+1 HP', type: 'bonus', tooltip: '+1 Cuore vita' },
              { icon: '🛡️', label: 'CALM', type: 'bonus', tooltip: 'Nemici innocui' },
              { icon: '🐌', label: '-15% SPD', type: 'malus', tooltip: 'Velocità -15%' },
            ],
          });
          break;
        case 'md':
          list.push({
            type: 'md',
            name: 'MDMA',
            icon: '✨',
            durationLeft,
            durationPercent: percent,
            bonusText: '✨ Punti x2 & Magnete Gianduiotti',
            malusText: '🧊 Scivoli come sul ghiaccio (attrito ridotto)',
            color: '#ec4899',
            badges: [
              { icon: '⭐', label: 'x2 PTS', type: 'bonus', tooltip: 'Punti raddoppiati' },
              { icon: '🧲', label: 'MAG', type: 'bonus', tooltip: 'Magnete gianduiotti' },
              { icon: '🧊', label: 'SLIP', type: 'malus', tooltip: 'Attrito ridotto (scivoloso)' },
            ],
          });
          break;
        case 'lsd':
          list.push({
            type: 'lsd',
            name: 'LSD',
            icon: '🌀',
            durationLeft,
            durationPercent: percent,
            bonusText: '🌀 Doppio Salto a mezz\'aria sbloccato',
            malusText: '🌈 Distorsione visiva psichedelica',
            color: '#a855f7',
            badges: [
              { icon: '🌀', label: '2x JUMP', type: 'bonus', tooltip: 'Doppio salto sbloccato' },
              { icon: '🌈', label: 'TRIP', type: 'malus', tooltip: 'Distorsione psichedelica' },
            ],
          });
          break;
        case 'funghetti':
          list.push({
            type: 'funghetti',
            name: 'FUNGHETTI',
            icon: '🍄',
            durationLeft,
            durationPercent: percent,
            bonusText: '🍄 Gigante: schiaccia i nemici anche frontalmente',
            malusText: '🧱 Corpo enorme e caduta pesante',
            color: '#f59e0b',
            badges: [
              { icon: '🍄', label: 'GIANT', type: 'bonus', tooltip: 'Modalità gigante' },
              { icon: '💥', label: 'CRUSH', type: 'bonus', tooltip: 'Schiaccia nemici' },
              { icon: '🧱', label: 'HEAVY', type: 'malus', tooltip: 'Caduta pesante' },
            ],
          });
          break;
      }
    }

    return list;
  }

  /**
   * Ritorna sinergie attive (disattivate per mantenere solo gli effetti individuali cumulabili)
   */
  public getActiveSynergies(): SynergyInfo[] {
    return [];
  }

  public takeDamage(): boolean {
    if (this.invincibleTimer > 0 || this.state === 'dead' || this.state === 'victory' || this.isGhostActive || this.isCharmActive || this.isBrambleActive) {
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
      this.invincibleTimer = 1.8;
      this.audio.playHurt();
      this.particles.emitGoldSparks(this.x + this.width / 2, this.y + this.height / 2, 14);
      return false;
    }

    // Danno equo: 1 vita (cocaina velocizza ma non punisce con morte istantanea)
    this.lives -= 1;
    this.audio.playHurt();
    this.particles.emitFeathers(this.x + this.width / 2, this.y + this.height / 2, 10);

    if (this.lives <= 0) {
      this.die();
      return true;
    } else {
      this.invincibleTimer = 2.2; // Generosi 2.2s di invulnerabilità post-danno per allontanarsi in sicurezza
      this.vy = -380;
      return false;
    }
  }

  public die(): void {
    if (this.state === 'dead') return;
    this.state = 'dead';
    this.vy = -520;
    this.vx = 0;
    this.isMatrixActive = false;
    this.isGliding = false;
    this.bioAuraTimer = 0;
    this.isBioAuraActive = false;
    this.isGhostActive = false;
    this.ghostTimer = 0;
    this.isCharmActive = false;
    this.charmTimer = 0;
    this.isBrambleActive = false;
    this.brambleTimer = 0;
    this.activePowerUps.clear();
    this.audio.playDeath();
  }

  public respawn(): void {
    this.x = this.respawnPoint.x;
    this.y = this.respawnPoint.y;
    this.vx = 0;
    this.vy = 0;
    this.isMatrixActive = false;
    this.isGliding = false;
    this.bioAuraTimer = 0;
    this.isBioAuraActive = false;
    this.isGhostActive = false;
    this.ghostTimer = 0;
    this.isCharmActive = false;
    this.charmTimer = 0;
    this.isBrambleActive = false;
    this.brambleTimer = 0;
    this.state = 'idle';
    this.invincibleTimer = 2.5; // 2.5s di scudo all'atterraggio per non essere sorpresi
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

    // CALCOLO VELOCITÀ COMBINATA (calibrata per massimo controllo e giocabilità)
    let speedMult = 1.0;
    if (this.hasPowerUp('cocaina')) speedMult *= 1.5; // +50% veloce ma perfettamente controllabile
    if (this.hasPowerUp('marijuana')) speedMult *= 0.85; // leggermente rilassato (-15%), salti sempre precisi
    if (this.hasPowerUp('funghetti')) speedMult *= 0.95;
    if (this.isMatrixActive) speedMult *= 1.8; // Shhte Matrix Overclock
    if (this.isGhostActive) speedMult *= 1.6; // Devis Phantom Dash

    // SUPER-ABILITÀ DEL PERSONAGGIO (Tasto SPACE o Touch ⭐ SPECIAL)
    if (this.specialSkillCooldown <= 0 && input.consumeSpecialSkill()) {
      this.triggerSpecialSkill();
    }

    // SKILL 1: SPARO CON LA PISTOLA (Tasto 1 / Num1 / J / Touch 🔫)
    if (this.shootCooldown <= 0 && input.consumeSkill1()) {
      this.shootCooldown = this.SHOOT_COOLDOWN_MAX;
      this.audio.playShoot();
      const bulletX = this.facingRight ? this.x + this.width + 4 : this.x - 16;
      const bulletY = this.y + 18;
      this.onShoot?.(bulletX, bulletY, this.facingRight);
      this.particles.emitGoldSparks(bulletX, bulletY, 6);
    }

    // SKILL 2: BOMBA AL GIANDUIOTTO (Tasto 2 / Num2 / K / Touch 💣)
    if (this.bombCooldown <= 0 && input.consumeSkill2()) {
      this.bombCooldown = this.BOMB_COOLDOWN_MAX;
      this.audio.playJump();
      const bombX = this.facingRight ? this.x + this.width + 4 : this.x - 18;
      const bombY = this.y + 10;
      this.onBomb?.(bombX, bombY, this.facingRight);
      this.particles.emitGoldSparks(bombX, bombY, 8);
    }

    // MOVIMENTO ORIZZONTALE — velocità fissa (corsa rimossa)
    const baseSpeed = Physics.WALK_SPEED;
    const targetSpeed = baseSpeed * speedMult;

    // ACCELERAZIONE & DECELERAZIONE (Reattività migliorata per game feel eccezionale)
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
    if (this.hasPowerUp('marijuana')) jumpMult *= 1.0; // Salto pieno per superare qualsiasi baratro con facilità

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
    if (this.isBrambleActive) {
      this.brambleTimer -= dt;
      if (this.brambleTimer <= 0) this.isBrambleActive = false;
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
      false,
      this.characterId,
      this.isGhostActive,
      this.isBioAuraActive,
      this.isCharmActive,
      this.isBrambleActive
    );
  }
}
