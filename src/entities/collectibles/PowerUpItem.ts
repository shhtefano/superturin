import { Collectible } from './Collectible';
import { CollectibleType } from '../../levels/types';
import { Sprites } from '../../game/graphics/Sprites';

export class PowerUpItem extends Collectible {
  public itemType: CollectibleType;

  constructor(id: string, type: CollectibleType, x: number, y: number) {
    // Dimensioni proporzionate (28x28 circa)
    super(id, x, y, 28, 28, type === 'gianduiotto' ? 100 : 250);
    this.itemType = type;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.collected) return;
    const hover = Math.sin(this.hoverTimer) * 5;

    switch (this.itemType) {
      case 'gianduiotto':
        Sprites.drawGianduiotto(ctx, this.x, this.y, this.width, this.height, hover);
        break;
      case 'cocaina':
        Sprites.drawCocaina(ctx, this.x, this.y, this.width, this.height, hover);
        break;
      case 'marijuana':
        Sprites.drawMarijuana(ctx, this.x, this.y, this.width, this.height, hover);
        break;
      case 'md':
        Sprites.drawMD(ctx, this.x, this.y, this.width, this.height, hover);
        break;
      case 'lsd':
        Sprites.drawLSD(ctx, this.x, this.y, this.width, this.height, hover);
        break;
      case 'funghetti':
        Sprites.drawFunghetti(ctx, this.x, this.y, this.width, this.height, hover);
        break;
    }
  }
}
