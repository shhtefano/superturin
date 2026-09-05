import { Hitbox } from '../../types/physics';

export class Bullet {
  public x: number;
  public y: number;
  public vx: number;
  public width: number = 14;
  public height: number = 6;
  public active: boolean = true;
  private lifetime: number = 1.2;

  constructor(x: number, y: number, facingRight: boolean) {
    this.x = x;
    this.y = y;
    this.vx = facingRight ? 650 : -650;
  }

  public update(dt: number): void {
    if (!this.active) return;
    this.x += this.vx * dt;
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.active = false;
    }
  }

  public getHitbox(): Hitbox {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;
    ctx.save();
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 10;
    // Pallottola dorata allungata con scia
    ctx.fillStyle = '#ffb703';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.vx > 0 ? this.x + this.width - 4 : this.x, this.y + 1, 4, this.height - 2);
    ctx.restore();
  }
}
