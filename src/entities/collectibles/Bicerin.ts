import { Collectible } from './Collectible';
import { Sprites } from '../../game/graphics/Sprites';

export class Bicerin extends Collectible {
  public duration: number = 10; // 10 secondi di power-up attivo

  constructor(id: string, x: number, y: number) {
    super(id, x, y, 24, 28, 300);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.collected) return;
    Sprites.drawBicerin(ctx, this.x, this.y, this.width, this.height);
  }
}
