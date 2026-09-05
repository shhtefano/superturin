import { Entity } from './Entity';
import { Sprites } from '../game/graphics/Sprites';

export class Checkpoint extends Entity {
  public isActivated: boolean = false;

  constructor(id: string, x: number, y: number) {
    // Dimensioni proporzionate al Toret
    super(id, x, y, 28, 48);
  }

  public activate(): void {
    this.isActivated = true;
  }

  public update(_dt: number): void {
    // Eventuale logica animazione continua
  }

  public render(ctx: CanvasRenderingContext2D): void {
    Sprites.drawToret(ctx, this.x, this.y, this.width, this.height, this.isActivated);
  }
}
