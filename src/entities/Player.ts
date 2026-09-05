import { Entity } from './Entity';
import { Physics } from '../game/core/Physics';
import { InputManager } from '../game/core/InputManager';
import { AudioManager } from '../game/audio/AudioManager';
import { ParticleSystem } from '../game/graphics/ParticleSystem';
import { Sprites } from '../game/graphics/Sprites';
import { Vector2D } from '../types/physics';
import { PowerUpType, ActivePowerUpInfo } from '../types/game';

export type PlayerState = 'idle' | 'running' | 'jumping' | 'falling' | 'hurt' | 'dead' | 'victory';

export class Player extends Entity {
  public state: PlayerState = 'idle';
  public facingRight: boolean = true;
  public isGrounded: boolean = false;
  private wasGrounded: boolean = false;

  // Timers di game feel
  public coyoteTimer: number = 0;
  public invincibleTimer: number = 0;

  // Sistema Power-Up avanzato con Bonus e Malus (durata >= 10s)
  public activePowerUp: PowerUpType = 'none';
  public powerUpTimer: number = 0;
  public readonly maxPowerUpDuration: number = 12.0; // 12 secondi pieni
  public hasDoubleJumped: boolean = false;

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
    particles: ParticleSystem
  ) {
    super(id, x, y, 32, 48);
    this.respawnPoint = { x, y };
    this.audio = audio;
    this.particles = particles;
  }

  public setCheckpoint(x: number, y: number): void {
    this.respawnPoint = { x, y };
  }

  /**
   * Attiva una sostanza/collezionabile con bonus e malus dedicati (durata 12s)
   */
  public activatePowerUp(type: PowerUpType): void {
    if (type === 'none') return;
    this.activePowerUp = type;
    this.powerUpTimer = this.maxPowerUpDuration;
    this.audio.playPowerUp();

    // Effetti speciali istantanei
    if (type === 'marijuana') {
      // Bonus: cura immediata di +1 cuore
      this.lives = Math.min(this.maxLives, this.lives + 1);
      this.particles.emitWaterDroplets(this.x + this.width / 2, this.y, 14);
    } else if (type === 'cocaina') {
      this.particles.emitDust(this.x + this.width / 2, this.y + this.height / 2, 16);
    } else if (type === 'lsd') {
      this.hasDoubleJumped = false;
      this.particles.emitGoldSparks(this.x + this.width / 2, this.y, 18);
    } else if (type === 'funghetti') {
      this.particles.emitGoldSparks(this.x + this.width / 2, this.y, 22);
    }
  }

  public hasPowerUp(): boolean {
    return this.activePowerUp !== 'none' && this.powerUpTimer > 0;
  }

  public getActivePowerUpInfo(): ActivePowerUpInfo | null {
    if (!this.hasPowerUp()) return null;

    const percent = Math.max(0, Math.min(1, this.powerUpTimer / this.maxPowerUpDuration));
    const durationLeft = Math.ceil(this.powerUpTimer);

    switch (this.activePowerUp) {
      case 'cocaina':
        return {
          type: 'cocaina',
          name: 'COCAINA',
          durationLeft,
          durationPercent: percent,
          bonusText: '⚡ Super Velocità (+70%) & Super Salto',
          malusText: '⚠️ Cuore fragile: subisci danno doppio!',
          color: '#06b6d4',
        };
      case 'marijuana':
        return {
          type: 'marijuana',
          name: 'MARIJUANA',
          durationLeft,
          durationPercent: percent,
          bonusText: '🛡️ +1 Vita & Nemici innocui (nessun danno)',
          malusText: '🐌 Movimenti e riflessi molto rallentati',
          color: '#22c55e',
        };
      case 'md':
        return {
          type: 'md',
          name: 'MDMA (PASTICCA)',
          durationLeft,
          durationPercent: percent,
          bonusText: '✨ Punti x2 & Magnete Gianduiotti',
          malusText: '🧊 Scivoli come sul ghiaccio (zero attrito)',
          color: '#ec4899',
        };
      case 'lsd':
        return {
          type: 'lsd',
          name: 'LSD (BLOTTER)',
          durationLeft,
          durationPercent: percent,
          bonusText: '🌀 Doppio Salto infinito a mezz\'aria',
          malusText: '🌈 Distorsione psichedelica arcobaleno',
          color: '#a855f7',
        };
      case 'funghetti':
        return {
          type: 'funghetti',
          name: 'FUNGHETTI',
          durationLeft,
          durationPercent: percent,
          bonusText: '🍄 Gigante: schiaccia i nemici al tocco',
          malusText: '🧱 Corpo enorme e caduta pesante',
          color: '#f59e0b',
        };
      default:
        return null;
    }
  }

  public takeDamage(): boolean {
    if (this.invincibleTimer > 0 || this.state === 'dead' || this.state === 'victory') {
      return false;
    }

    // BONUS MARIJUANA: I nemici non fanno male!
    if (this.activePowerUp === 'marijuana') {
      this.particles.emitWaterDroplets(this.x + this.width / 2, this.y + this.height / 2, 6);
      return false;
    }

    // FUNGHETTO GIGANTE: assorbe il colpo tornando normale
    if (this.activePowerUp === 'funghetti') {
      this.activePowerUp = 'none';
      this.powerUpTimer = 0;
      this.invincibleTimer = 1.4;
      this.audio.playHurt();
      this.particles.emitGoldSparks(this.x + this.width / 2, this.y + this.height / 2, 14);
      return false;
    }

    // MALUS COCAINA: Ti rende più debole, perdi 2 vite al colpo!
    const damage = this.activePowerUp === 'cocaina' ? 2 : 1;
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
    this.activePowerUp = 'none';
    this.powerUpTimer = 0;
    this.audio.playDeath();
  }

  public respawn(): void {
    this.x = this.respawnPoint.x;
    this.y = this.respawnPoint.y;
    this.vx = 0;
    this.vy = 0;
    this.state = 'idle';
    this.invincibleTimer = 1.5;
    this.activePowerUp = 'none';
    this.powerUpTimer = 0;
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

    // Aggiornamento timer sostanza/power-up
    if (this.powerUpTimer > 0) {
      this.powerUpTimer -= dt;
      if (this.powerUpTimer <= 0) {
        this.activePowerUp = 'none';
      }
    }

    // Calcolo velocità target in base al power-up attivo
    let targetSpeed = input.isRun() ? Physics.RUN_SPEED : Physics.WALK_SPEED;

    if (this.activePowerUp === 'cocaina') {
      // BONUS COCAINA: +70% velocità estrema
      targetSpeed *= 1.7;
    } else if (this.activePowerUp === 'marijuana') {
      // MALUS MARIJUANA: -40% velocità (molto rallentato)
      targetSpeed *= 0.6;
    }

    // Accelerazione e Decelerazione (con malus scivolamento per MD)
    let accel = this.isGrounded ? Physics.ACCELERATION_GROUND : Physics.ACCELERATION_AIR;
    let decel = this.isGrounded ? Physics.DECELERATION_GROUND : Physics.DECELERATION_AIR;

    if (this.activePowerUp === 'md') {
      // MALUS MD: Scivola sul ghiaccio (attrito ridottissimo)
      decel *= 0.18;
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

    // Gestione Coyote Time & reset Doppio Salto
    if (this.isGrounded) {
      this.coyoteTimer = Physics.COYOTE_TIME;
      this.hasDoubleJumped = false;
    } else {
      this.coyoteTimer -= dt;
    }

    // Salto base alto e soddisfacente
    let baseJump = Physics.JUMP_FORCE; // -830
    if (this.activePowerUp === 'cocaina') {
      baseJump *= 1.22; // Salto super potente con Cocaina
    }

    // 1. Salto Standard da terra o coyote time
    if ((this.isGrounded || this.coyoteTimer > 0) && input.consumeJump()) {
      this.vy = baseJump;
      this.isGrounded = false;
      this.coyoteTimer = 0;
      this.audio.playJump();
      this.particles.emitDust(this.x + this.width / 2, this.y + this.height, 6);
    }
    // 2. BONUS LSD: DOPPIO SALTO a mezz'aria!
    else if (!this.isGrounded && this.activePowerUp === 'lsd' && !this.hasDoubleJumped && input.consumeJump()) {
      this.vy = Physics.JUMP_FORCE * 0.95;
      this.hasDoubleJumped = true;
      this.audio.playJump();
      this.particles.emitGoldSparks(this.x + this.width / 2, this.y + this.height / 2, 12);
    }

    // Variable Jump Cut per controllo millimetrico
    if (!input.isJumpHeld && this.vy < Physics.JUMP_CUT_LIMIT) {
      this.vy = Physics.JUMP_CUT_LIMIT;
    }
  }

  public update(dt: number): void {
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= dt;
    }

    // Gravità (morbida/lenta con marijuana, pesante con funghetti)
    let gravity = Physics.GRAVITY;
    if (this.activePowerUp === 'marijuana') {
      gravity *= 0.65; // Caduta fluttuante
    } else if (this.activePowerUp === 'funghetti') {
      gravity *= 1.15; // Caduta pesante gigante
    }

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
    Sprites.drawPlayer(
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
      this.activePowerUp
    );
  }
}
