import { Hitbox } from '../../types/physics';
import { Platform } from '../Platform';
import { CollisionSystem } from '../../game/core/CollisionSystem';

export class GianduiottoBomb {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public width: number = 20;
  public height: number = 20;
  public active: boolean = true;
  public hasExploded: boolean = false;
  public isFinished: boolean = false;
  public explosionRadius: number = 120;
  public lifeTime: number = 0; // tempo trascorso dall'esplosione
  private fuseTimer: number = 1.4; // secondi prima della detonazione automatica
  private rotation: number = 0;
  private bounces: number = 0;

  constructor(x: number, y: number, facingRight: boolean) {
    this.x = x;
    this.y = y;
    this.vx = facingRight ? 380 : -380;
    this.vy = -320;
  }

  public update(dt: number, platforms?: Platform[]): void {
    if (this.isFinished) return;

    if (this.hasExploded) {
      this.lifeTime += dt;
      if (this.lifeTime >= 0.28) {
        this.active = false;
        this.isFinished = true;
      }
      return;
    }

    // Fisica di volo parabolico con gravità
    this.vy += 850 * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += (this.vx > 0 ? 9 : -9) * dt;

    // Controllo collisioni e rimbalzi con piattaforme
    if (platforms) {
      const box = this.getHitbox();
      for (const plat of platforms) {
        if (CollisionSystem.checkAABB(box, plat.getHitbox())) {
          // Rimbalza sul terreno o esplode se ha già rimbalzato 2 volte
          if (this.bounces < 2) {
            this.bounces++;
            this.vy = -Math.abs(this.vy) * 0.55;
            this.vx *= 0.7;
            this.y = plat.y - this.height - 1;
          } else {
            this.explode();
            return;
          }
        }
      }
    }

    this.fuseTimer -= dt;
    if (this.fuseTimer <= 0) {
      this.explode();
    }
  }

  public explode(): void {
    if (this.hasExploded) return;
    this.hasExploded = true;
    this.lifeTime = 0;
    this.vx = 0;
    this.vy = 0;
  }

  public getHitbox(): Hitbox {
    if (this.hasExploded) {
      return {
        x: this.x - this.explosionRadius,
        y: this.y - this.explosionRadius,
        width: this.explosionRadius * 2,
        height: this.explosionRadius * 2,
      };
    }
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.isFinished) return;

    if (this.hasExploded) {
      // Esplosione a onda d'urto dorata sabauda con bagliore
      const progress = Math.min(1, this.lifeTime / 0.28);
      const currentRadius = this.explosionRadius * progress;

      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 183, 3, ${Math.max(0, 0.65 - progress * 0.65)})`;
      ctx.fill();

      ctx.lineWidth = 4;
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - progress)})`;
      ctx.stroke();

      // Scintille concentriche
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, currentRadius * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(251, 191, 36, ${Math.max(0, 0.8 - progress)})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
      return;
    }

    // Bomba Gianduiotto in volo con miccia accesa
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);

    // Ombra dorata
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8;

    // Forma piramidale gianduiotto di cioccolato
    ctx.beginPath();
    ctx.moveTo(-9, 9);
    ctx.lineTo(0, -9);
    ctx.lineTo(9, 9);
    ctx.closePath();
    ctx.fillStyle = '#451a03';
    ctx.fill();

    // Incarto dorato a metà
    ctx.beginPath();
    ctx.moveTo(-7, 3);
    ctx.lineTo(0, -9);
    ctx.lineTo(7, 3);
    ctx.closePath();
    ctx.fillStyle = '#d4af37';
    ctx.fill();

    // Miccia con scintilla rossa e gialla
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(3, -15);
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.fillRect(2, -17, 4, 4);

    ctx.restore();
  }
}
