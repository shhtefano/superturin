import { Collectible } from './Collectible';
import { Sprites } from '../../game/graphics/Sprites';

export class Gianduiotto extends Collectible {
  constructor(id: string, x: number, y: number) {
    super(id, x, y, 26, 20, 100);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.collected) return;
    const hoverOffset = Math.sin(this.hoverTimer) * 4;
    Sprites.drawGianduiotto(ctx, this.x, this.y, this.width, this.height, hoverOffset);
  }
}
