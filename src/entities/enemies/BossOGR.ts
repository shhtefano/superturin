import { BossEnemy } from './BossEnemy';
import { EnemyProjectile } from '../projectiles/EnemyProjectile';

export class BossOGR extends BossEnemy {
  private cannonTimer: number = 0;
  private steamTimer: number = 0;
  private wheelRotation: number = 0;
  private isEnraged: boolean = false;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    super(
      id,
      x,
      y,
      108,
      82,
      patrolLeft,
      patrolRight,
      140, // moveSpeed
      16,  // 16 HP per il maestoso Boss delle Officine OGR!
      'LocoTitan OGR-X',
      'Il Supremo Colosso Elettro-Meccanico delle Grandi Riparazioni'
    );
  }

  public update(dt: number, playerX?: number, playerY?: number): void {
    if (this.isDead) {
      this.y += 240 * dt;
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    this.isEnraged = this.hp <= 8;
    this.moveSpeed = this.isEnraged ? 180 : 140;

    this.updateBossBase(dt);
    this.wheelRotation += dt * 8;
    this.steamTimer += dt * 5;
    this.cannonTimer += dt;

    if (this.punchTimer > 0) {
      this.punchTimer -= dt;
      if (this.punchTimer <= 0) {
        this.isPunching = false;
      }
    }

    // Pugno Idraulico / Sfollamento se il giocatore è a distanza ravvicinata (<120px)
    if (!this.isPunching && playerX !== undefined && playerY !== undefined) {
      const dx = playerX - (this.x + this.width / 2);
      const dy = Math.abs(playerY - (this.y + this.height / 2));
      const isFront = (this.movingRight && dx > 0 && dx < 120) || (!this.movingRight && dx < 0 && dx > -120);
      if (isFront && dy < 60) {
        this.isPunching = true;
        this.punchTimer = 0.45;
      }
    }

    // Cannoneggiamento a doppio raggio Laser OGR ogni 2.3s (o 1.5s se furente)
    const fireInterval = this.isEnraged ? 1.5 : 2.3;
    if (this.cannonTimer >= fireInterval && this.onShoot) {
      this.cannonTimer = 0;
      const bCenterX = this.x + this.width / 2;
      const isPlayerRight = playerX !== undefined ? playerX > bCenterX : this.movingRight;
      this.movingRight = isPlayerRight;
      const vx = isPlayerRight ? 380 : -380;

      // Doppio dardo laser a quote differenti
      this.onShoot(
        new EnemyProjectile(
          isPlayerRight ? this.x + this.width + 6 : this.x - 28,
          this.y + 18,
          vx,
          0,
          'laser',
          3.0
        )
      );
      this.onShoot(
        new EnemyProjectile(
          isPlayerRight ? this.x + this.width + 6 : this.x - 28,
          this.y + 44,
          vx,
          -15,
          'laser',
          3.0
        )
      );
    }

    // Pattuglia orizzontale
    const currentSpeed = this.isPunching ? this.moveSpeed * 0.4 : this.moveSpeed;
    if (this.movingRight) {
      this.x += currentSpeed * dt;
      if (this.x >= this.patrolRight) {
        this.movingRight = false;
      }
    } else {
      this.x -= currentSpeed * dt;
      if (this.x <= this.patrolLeft) {
        this.movingRight = true;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    ctx.save();
    ctx.translate(Math.round(this.x + this.width / 2), Math.round(this.y + this.height / 2));
    if (!this.movingRight) {
      ctx.scale(-1, 1);
    }

    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 60) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Aura Energetica se Furente
    if (this.isEnraged) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
    }

    // Vapori dalla ciminiera
    const steamAlpha = 0.6 + Math.sin(this.steamTimer) * 0.3;
    ctx.fillStyle = `rgba(241, 245, 249, ${steamAlpha})`;
    ctx.beginPath();
    ctx.arc(-26, -48, 8, 0, Math.PI * 2);
    ctx.arc(-20, -56, 12, 0, Math.PI * 2);
    ctx.fill();

    // Ciminiera della locomotiva
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-32, -42, 14, 20);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-34, -44, 18, 4);

    // Corpo Principale della Caldaia Corazzata OGR (Nero antracite e acciaio)
    ctx.fillStyle = this.isEnraged ? '#1e1b4b' : '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-46, -22, 78, 44, 8);
    ctx.fill();

    // Rivestimento con piastre imbullonate
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(-44, -20, 74, 40);

    // Cabina di pilotaggio posteriore con luci neon blu/magenta OGR Sound
    ctx.fillStyle = '#090d16';
    ctx.fillRect(-48, -34, 26, 26);
    ctx.fillStyle = this.isEnraged ? '#f43f5e' : '#38bdf8';
    ctx.fillRect(-44, -30, 18, 10);

    // Fanale anteriore gigante ad alta visibilità
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(34, -2, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(34, -2, 5, 0, Math.PI * 2);
    ctx.fill();

    // Canne dei cannoni laser doppi frontali
    ctx.fillStyle = '#334155';
    ctx.fillRect(28, -16, 22, 6);
    ctx.fillRect(28, 10, 22, 6);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(48, -15, 4, 4);
    ctx.fillRect(48, 11, 4, 4);

    // Pugno Meccanico a Pistone Telescopico
    if (this.isPunching) {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(36, -6, 26, 12);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(60, -10, 16, 20);
      // Scia pugno
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, -10, 16, 20);
    }

    // Ruote dentate giganti della locomotiva
    const wheelRadius = 14;
    const wheels = [-32, -2, 28];
    for (const wx of wheels) {
      ctx.save();
      ctx.translate(wx, 26);
      ctx.rotate(this.wheelRotation);

      // Cerchione
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, wheelRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Raggi della ruota
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-wheelRadius, 0);
        ctx.lineTo(wheelRadius, 0);
        ctx.stroke();
        ctx.rotate(Math.PI / 4);
      }

      ctx.restore();
    }

    // Biella di accoppiamento che connette le ruote
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-34, 23 + Math.sin(this.wheelRotation) * 4, 64, 5);

    ctx.restore();
  }
}
