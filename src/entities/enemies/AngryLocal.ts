import { Enemy } from './Enemy';

export class AngryLocal extends Enemy {
  private stepTimer: number = 0;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    super(id, x, y, 28, 44, patrolLeft, patrolRight, 110, true);
  }

  public update(dt: number): void {
    if (this.isDead) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    this.stepTimer += dt;

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
      ctx.scale(1.3, 0.25);
    }

    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // Gambe
    const leg = Math.sin(this.stepTimer * 12) * 5;
    ctx.fillStyle = '#334155';
    ctx.fillRect(-6 + leg, halfH - 12, 5, 12);
    ctx.fillRect(1 - leg, halfH - 12, 5, 12);

    // Impermeabile beige / nocciola
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-halfW + 3, -halfH + 16, this.width - 6, 20);

    // Testa con cappello grigio
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -halfH + 8, 12, 10);

    // Occhiali e sopracciglia corrucciate
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, -halfH + 10, 4, 3);
    ctx.fillStyle = '#b91c1c'; // Sopracciglia arrabbiate
    ctx.fillRect(0, -halfH + 8, 6, 2);

    // Ombrello sottobraccio
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-halfW, -halfH + 20, 16, 4);

    ctx.restore();
  }
}
