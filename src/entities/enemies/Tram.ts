import { Enemy } from './Enemy';
import { Sprites } from '../../game/graphics/Sprites';

export class Tram extends Enemy {
  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    // Dimensioni tram storico GTT (più rapido nei viali)
    super(id, x, y, 140, 50, patrolLeft, patrolRight, 170, false); // isStompable = false!
  }

  public update(dt: number): void {
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
    Sprites.drawTram(ctx, this.x, this.y, this.width, this.height, this.movingRight);
  }
}
