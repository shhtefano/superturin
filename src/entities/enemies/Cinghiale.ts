import { Enemy } from './Enemy';

export class Cinghiale extends Enemy {
  private trotTimer: number = 0;
  private chargeTimer: number = 0;
  private isCharging: boolean = false;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    // Cinghiale selvaggio della collina di Superga
    // ATTENZIONE: isStompable = false! Non si può calpestare con un salto normale, bisogna sparargli o saltarlo!
    super(id, x, y, 48, 32, patrolLeft, patrolRight, 160, false);
  }

  public update(dt: number): void {
    if (this.isDead) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    this.chargeTimer += dt;
    this.trotTimer += dt * (this.isCharging ? 18 : 10);

    // Ciclo di carica a testa bassa
    if (this.chargeTimer > 2.6) {
      this.chargeTimer = 0;
      this.isCharging = true;
    } else if (this.chargeTimer > 1.2 && this.isCharging) {
      this.isCharging = false;
    }

    const currentSpeed = this.isCharging ? this.moveSpeed * 1.55 : this.moveSpeed * 0.85;

    if (this.movingRight) {
      this.x += currentSpeed * dt;
      if (this.x >= this.patrolRight) {
        this.x = this.patrolRight;
        this.movingRight = false;
      }
    } else {
      this.x -= currentSpeed * dt;
      if (this.x <= this.patrolLeft) {
        this.x = this.patrolLeft;
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

    if (this.isDead) {
      ctx.rotate(Math.PI);
      ctx.scale(1.2, 0.4);
    }

    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // Zampe robuste con unghioni che trottano
    const legOffset = Math.sin(this.trotTimer) * 6;
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-halfW + 8 + legOffset, halfH - 10, 7, 10);
    ctx.fillRect(-halfW + 16 - legOffset, halfH - 10, 7, 10);
    ctx.fillRect(halfW - 20 + legOffset, halfH - 10, 7, 10);
    ctx.fillRect(halfW - 12 - legOffset, halfH - 10, 7, 10);

    // Corpo tozzo e massiccio
    ctx.fillStyle = '#292524';
    ctx.beginPath();
    ctx.ellipse(-2, 0, halfW - 6, halfH - 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cresta di setole irsute sul dorso
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(-halfW + 4, -halfH + 6);
    ctx.lineTo(-halfW + 10, -halfH - 4);
    ctx.lineTo(-halfW + 18, -halfH + 4);
    ctx.lineTo(-halfW + 26, -halfH - 5);
    ctx.lineTo(-halfW + 34, -halfH + 5);
    ctx.lineTo(halfW - 6, -halfH + 8);
    ctx.lineTo(-halfW + 4, -halfH + 8);
    ctx.closePath();
    ctx.fill();

    // Codina arricciata posteriore
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-halfW + 4, -2);
    ctx.lineTo(-halfW - 4, -8);
    ctx.lineTo(-halfW - 1, -12);
    ctx.stroke();

    // Muso pesante e grugno
    const snoutY = this.isCharging ? 4 : 0; // Abbassa la testa se in carica
    ctx.fillStyle = '#44403c';
    ctx.beginPath();
    ctx.ellipse(halfW - 10, snoutY, 12, 10, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Grugno piatto anteriore
    ctx.fillStyle = '#78716c';
    ctx.beginPath();
    ctx.ellipse(halfW - 2, snoutY + 2, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Narici
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(halfW - 2, snoutY + 1, 2, 2);
    ctx.fillRect(halfW - 2, snoutY + 4, 2, 2);

    // Zanne bianche aguzze rivolte all'insù
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(halfW - 6, snoutY + 5);
    ctx.lineTo(halfW - 1, snoutY - 4);
    ctx.lineTo(halfW - 3, snoutY + 5);
    ctx.closePath();
    ctx.fill();

    // Orecchie a punta
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(halfW - 16, snoutY - 8);
    ctx.lineTo(halfW - 12, snoutY - 16);
    ctx.lineTo(halfW - 8, snoutY - 7);
    ctx.closePath();
    ctx.fill();

    // Occhiettino rosso aggressivo
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(halfW - 12, snoutY - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Polvere / sbuffo se in carica
    if (this.isCharging && !this.isDead) {
      ctx.fillStyle = 'rgba(214, 211, 209, 0.5)';
      ctx.beginPath();
      ctx.arc(-halfW - 6, halfH - 2, 4, 0, Math.PI * 2);
      ctx.arc(-halfW - 14, halfH - 5, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
