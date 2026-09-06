import { Enemy } from './Enemy';
import { Sprites } from '../../game/graphics/Sprites';

export class Pigeon extends Enemy {
  private walkTimer: number = 0;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    // Dimensioni piccione torinese (più vispo e dinamico)
    super(id, x, y, 32, 26, patrolLeft, patrolRight, 115, true);
  }

  public update(dt: number): void {
    if (this.isDead) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    this.walkTimer += dt;

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

    if (this.isDead) {
      // Schiacciato (squashed)
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height);
      ctx.scale(1.4, 0.25);
      Sprites.drawPigeon(ctx, -this.width / 2, -this.height, this.width, this.height, this.movingRight, this.walkTimer);
      ctx.restore();
      return;
    }

    Sprites.drawPigeon(ctx, this.x, this.y, this.width, this.height, this.movingRight, this.walkTimer);
  }
}
