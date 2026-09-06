import { Enemy } from './Enemy';

export class Nutria extends Enemy {
  private runTimer: number = 0;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    // Nutria gigante del Fiume Po e dei Murazzi (profilo basso, rapida e insidiosa)
    super(id, x, y, 40, 22, patrolLeft, patrolRight, 155, true);
  }

  public update(dt: number): void {
    if (this.isDead) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    this.runTimer += dt;

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
      ctx.scale(1.4, 0.25);
    }

    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // Coda lunga scagliosa che oscilla
    const tailWiggle = Math.sin(this.runTimer * 14) * 4;
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-halfW + 4, halfH - 8);
    ctx.quadraticCurveTo(-halfW - 8, halfH - 12 + tailWiggle, -halfW - 16, halfH - 6 + tailWiggle * 1.5);
    ctx.stroke();

    // Zampette veloci che sgambettano
    const footAnim = Math.sin(this.runTimer * 16) * 4;
    ctx.fillStyle = '#27272a';
    ctx.fillRect(-halfW + 8 + footAnim, halfH - 4, 6, 4);
    ctx.fillRect(halfW - 14 - footAnim, halfH - 4, 6, 4);

    // Corpo tozzo e bagnato (pelliccia scura del Po)
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.ellipse(0, 0, halfW - 4, halfH - 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sfumatura dorso scuro
    ctx.fillStyle = '#2e1065';
    ctx.beginPath();
    ctx.ellipse(-2, -2, halfW - 8, halfH - 5, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Muso affusolato
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(halfW - 6, 0, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Occhietto rosso vispo
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(halfW - 7, -3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Dentoni arancioni tipici da nutria
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(halfW - 2, 0, 3, 4);

    // Baffetti d'acqua
    ctx.strokeStyle = '#d6d3d1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(halfW - 3, -1);
    ctx.lineTo(halfW + 4, -4);
    ctx.moveTo(halfW - 3, 2);
    ctx.lineTo(halfW + 4, 4);
    ctx.stroke();

    ctx.restore();
  }
}
