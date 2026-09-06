import { Entity } from './Entity';
import { Sprites } from '../game/graphics/Sprites';

export class Goal extends Entity {
  public isLocked: boolean = false;

  constructor(id: string, x: number, y: number) {
    super(id, x, y, 40, 80);
  }

  public update(_dt: number): void {
    // Animazione bandiera gestita internamente
  }

  public render(ctx: CanvasRenderingContext2D): void {
    Sprites.drawGoal(ctx, this.x, this.y, this.width, this.height);

    // Se il Goal è bloccato dalla presenza di un boss vivo
    if (this.isLocked) {
      ctx.save();
      const pulse = 0.55 + Math.sin(Date.now() * 0.007) * 0.25;

      // Barriera a scudo protettivo pulsante
      ctx.strokeStyle = `rgba(239, 68, 68, ${pulse})`;
      ctx.lineWidth = 3;
      ctx.fillStyle = `rgba(239, 68, 68, ${pulse * 0.22})`;

      ctx.beginPath();
      ctx.ellipse(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width * 0.9,
        this.height * 0.58,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();

      // Icona lucchetto e cartello di allerta boss
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText('🔒 BOSS!', this.x + this.width / 2, this.y - 12);

      ctx.restore();
    }
  }
}
