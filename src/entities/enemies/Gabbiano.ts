import { Enemy } from './Enemy';

export class Gabbiano extends Enemy {
  private flightTimer: number = 0;
  private baseY: number;
  private waveAmplitude: number = 34;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    // Gabbiano Reale del Po, dei Murazzi e della Mole (nemico volante con traiettoria a onda)
    super(id, x, y, 36, 24, patrolLeft, patrolRight, 130, true);
    this.baseY = y;
  }

  public update(dt: number): void {
    if (this.isDead) {
      this.deathTimer -= dt;
      this.y += 180 * dt; // Cade verso il basso quando sconfitto
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    this.flightTimer += dt;

    // Volo sinusoidale ondulatorio (minaccia aerea per i salti)
    this.y = this.baseY + Math.sin(this.flightTimer * 3.4) * this.waveAmplitude;

    if (this.movingRight) {
      this.x += this.moveSpeed * dt;
      if (this.x >= this.patrolRight) {
        this.x = this.patrolRight;
        this.movingRight = false;
      }
    } else {
      this.x -= this.moveSpeed * dt;
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
      ctx.rotate(Math.PI * 0.7);
      ctx.scale(1.2, 0.5);
    }

    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // Coda a ventaglio bianca
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-halfW + 4, 0);
    ctx.lineTo(-halfW - 6, -4);
    ctx.lineTo(-halfW - 8, 2);
    ctx.lineTo(-halfW + 4, 4);
    ctx.closePath();
    ctx.fill();

    // Corpo affusolato bianco
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, halfW - 4, halfH - 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Petto sfumato grigio chiaro
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(2, 2, halfW - 8, halfH - 6, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Battito d'ali dinamico
    const wingAngle = Math.sin(this.flightTimer * 12) * 0.7;
    ctx.save();
    ctx.translate(-2, -2);
    ctx.rotate(wingAngle);

    // Ala grigio perla con estremità nera
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-12, -18);
    ctx.lineTo(6, -12);
    ctx.closePath();
    ctx.fill();

    // Punta ala nera con macchia bianca
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-6, -15);
    ctx.lineTo(-12, -18);
    ctx.lineTo(-3, -17);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, -16, 3, 2);

    ctx.restore();

    // Testa con occhio vigile
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(halfW - 6, -3, 6, 0, Math.PI * 2);
    ctx.fill();

    // Occhio giallo con pupilla nera
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(halfW - 4, -4, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(halfW - 3.5, -4, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Becco giallo adunco con macchia rossa inferiore
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(halfW, -5);
    ctx.lineTo(halfW + 11, -2);
    ctx.lineTo(halfW + 10, 1);
    ctx.lineTo(halfW, 0);
    ctx.closePath();
    ctx.fill();

    // Macchiolina rossa sul becco inferiore (Gabbiano reale)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(halfW + 6, 0, 3, 2);

    ctx.restore();
  }
}
