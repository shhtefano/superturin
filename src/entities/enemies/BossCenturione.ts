import { BossEnemy } from './BossEnemy';
import { EnemyProjectile } from '../projectiles/EnemyProjectile';

export class BossCenturione extends BossEnemy {
  private spearTimer: number = 0;
  private shieldTimer: number = 0;
  private walkCycle: number = 0;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    super(
      id,
      x,
      y,
      64,
      76,
      patrolLeft,
      patrolRight,
      130, // moveSpeed
      12,  // 12 HP
      'Centurio Taurinus',
      'Il Guardiano delle Antiche Mura di Porta Palatina'
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

    this.updateBossBase(dt);
    this.walkCycle += dt * 8;
    this.spearTimer += dt;
    this.shieldTimer += dt;

    if (this.punchTimer > 0) {
      this.punchTimer -= dt;
      if (this.punchTimer <= 0) {
        this.isPunching = false;
      }
    }

    // Attacco Scudata / Affondo col Pilum (Pugno ravvicinato)
    if (!this.isPunching && playerX !== undefined && playerY !== undefined) {
      const dx = playerX - (this.x + this.width / 2);
      const dy = Math.abs(playerY - (this.y + this.height / 2));
      const isFacing = (this.movingRight && dx > 0 && dx < 110) || (!this.movingRight && dx < 0 && dx > -110);
      if (isFacing && dy < 55 && this.shieldTimer > 1.8) {
        this.shieldTimer = 0;
        this.isPunching = true;
        this.punchTimer = 0.45;
      }
    }

    // Lancio del Pilum (Giavellotto) ogni 2.7 secondi verso il giocatore
    if (this.spearTimer >= 2.7 && this.onShoot) {
      this.spearTimer = 0;
      const bCenterX = this.x + this.width / 2;
      const isPlayerRight = playerX !== undefined ? playerX > bCenterX : this.movingRight;
      this.movingRight = isPlayerRight;
      const vx = isPlayerRight ? 340 : -340;
      this.onShoot(
        new EnemyProjectile(
          isPlayerRight ? this.x + this.width + 4 : this.x - 32,
          this.y + 24,
          vx,
          -45,
          'lancia',
          3.0
        )
      );
    }

    // Pattuglia orizzontale
    const currentSpeed = this.isPunching ? this.moveSpeed * 0.3 : this.moveSpeed;
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

    const leg = Math.sin(this.walkCycle) * 6;

    // Gambe con calzari romani di cuoio
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-14, 18, 10, 20 + leg);
    ctx.fillRect(4, 18, 10, 20 - leg);

    // Busto: Lorica Segmentata in acciaio e bronzo sabaudo
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-18, -12, 36, 32);
    ctx.fillStyle = '#e2e8f0'; // Piastre d'acciaio
    ctx.fillRect(-16, -10, 32, 7);
    ctx.fillRect(-16, -1, 32, 7);
    ctx.fillRect(-16, 8, 32, 7);

    // Tunica rossa imperiale
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-20, 14, 40, 8);

    // Testa con Elmo Romano di Bronzo e Cresta Rossa Crestata
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-10, -26, 20, 16);

    // Paragnatidi ed elmo
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-12, -30, 24, 14);

    // Cresta rossa trasversale
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-16, -30);
    ctx.quadraticCurveTo(0, -42, 16, -30);
    ctx.lineTo(14, -28);
    ctx.quadraticCurveTo(0, -38, -14, -28);
    ctx.closePath();
    ctx.fill();

    // Occhi fieri
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, -22, 4, 3);

    // Scudo Scutum Romano Rettangolare Curvo (Rosso con Fulmini Dorati)
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(this.isPunching ? 14 : 6, -18, 16, 42);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.isPunching ? 14 : 6, -18, 16, 42);

    // Umbone centrale dorato
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.arc(this.isPunching ? 22 : 14, 3, 5, 0, Math.PI * 2);
    ctx.fill();

    // Pilum / Lancia nella mano posteriore
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-18, 22);
    ctx.lineTo(this.isPunching ? 32 : -6, -28);
    ctx.stroke();

    // Punta della lancia
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    const tipX = this.isPunching ? 36 : -4;
    const tipY = -34;
    ctx.moveTo(tipX - 4, tipY + 8);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(tipX + 4, tipY + 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
