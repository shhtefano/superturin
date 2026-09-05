import { Enemy } from './Enemy';

export class Squirrel extends Enemy {
  private jumpTimer: number = 0;
  private isJumping: boolean = false;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    super(id, x, y, 28, 26, patrolLeft, patrolRight, 130, true);
  }

  public update(dt: number): void {
    if (this.isDead) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    // Comportamento di salto a balzi tipo scoiattolo del Valentino
    this.jumpTimer += dt;
    if (this.jumpTimer > 1.2) {
      this.jumpTimer = 0;
      this.isJumping = true;
    }

    const currentSpeed = this.isJumping ? this.moveSpeed * 1.5 : this.moveSpeed * 0.7;

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

    if (this.jumpTimer > 0.4) {
      this.isJumping = false;
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
      ctx.scale(1.4, 0.3);
    }

    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // Coda folta arricciata all'insù
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(-halfW + 4, -4, 10, 14, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Corpo rossiccio
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, 2, 9, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pancia bianca
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.ellipse(2, 4, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Testa
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(8, -4, 7, 0, Math.PI * 2);
    ctx.fill();

    // Orecchie con ciuffetto
    ctx.beginPath();
    ctx.moveTo(6, -10);
    ctx.lineTo(8, -16);
    ctx.lineTo(11, -9);
    ctx.closePath();
    ctx.fill();

    // Occhio nero vispo
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(10, -5, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
