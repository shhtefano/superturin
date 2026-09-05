import { Entity } from './Entity';
import { Sprites } from '../game/graphics/Sprites';

export class Goal extends Entity {
  constructor(id: string, x: number, y: number) {
    super(id, x, y, 40, 80);
  }

  public update(_dt: number): void {
    // Animazione bandiera gestita internamente con timer
  }

  public render(ctx: CanvasRenderingContext2D): void {
    Sprites.drawGoal(ctx, this.x, this.y, this.width, this.height);
  }
}
