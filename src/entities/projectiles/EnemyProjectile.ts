import { Hitbox } from '../../types/physics';

export type EnemyProjectileType = 'multa' | 'laser' | 'guano' | 'fireball' | 'lancia';

export class EnemyProjectile {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public width: number;
  public height: number;
  public type: EnemyProjectileType;
  public active: boolean = true;
  public lifetime: number = 3.5;
  private animTimer: number = 0;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    type: EnemyProjectileType,
    lifetime: number = 3.5
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
    this.lifetime = lifetime;

    switch (type) {
      case 'multa':
        this.width = 18;
        this.height = 14;
        break;
      case 'laser':
        this.width = 22;
        this.height = 8;
        break;
      case 'guano':
        this.width = 12;
        this.height = 14;
        break;
      case 'fireball':
        this.width = 22;
        this.height = 22;
        break;
      case 'lancia':
        this.width = 30;
        this.height = 8;
        break;
      default:
        this.width = 14;
        this.height = 14;
    }
  }

  public update(dt: number): void {
    if (!this.active) return;
    this.animTimer += dt;
    this.lifetime -= dt;

    if (this.lifetime <= 0) {
      this.active = false;
      return;
    }

    // Guano e lancia hanno gravità
    if (this.type === 'guano') {
      this.vy += 320 * dt;
    } else if (this.type === 'lancia') {
      this.vy += 120 * dt;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
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
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    switch (this.type) {
      case 'multa': {
        // Foglio di verbale / multa svolazzante che ruota
        const rot = Math.sin(this.animTimer * 10) * 0.45;
        ctx.rotate(rot);

        // Foglio bianco/giallino con timbro
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(-8, -6, 16, 12);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1;
        ctx.strokeRect(-8, -6, 16, 12);

        // Righe di testo
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-6, -4, 12, 1.5);
        ctx.fillRect(-6, -1, 9, 1.5);
        ctx.fillRect(-6, 2, 11, 1.5);

        // Timbro rosso "MULTA"
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(4, 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'laser': {
        // Dardo laser al plasma rosso/neon con scia
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 4);
        ctx.fill();

        // Nucleo bianco abbagliante
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-this.width / 2 + 3, -this.height / 2 + 2, this.width - 6, this.height - 4);
        break;
      }

      case 'guano': {
        // Goccia bianca/grigia cadente
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.ellipse(0, 0, 5, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.stroke();
        break;
      }

      case 'fireball': {
        // Sfera di fuoco alchemica pulsante
        const pulse = 1 + Math.sin(this.animTimer * 16) * 0.15;
        ctx.scale(pulse, pulse);

        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 14;

        // Alone viola alchemico
        ctx.fillStyle = 'rgba(168, 85, 247, 0.7)';
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();

        // Nucleo rosso fuoco
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();

        // Centro dorato incandescente
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'lancia': {
        // Lancia / Giavellotto romano con punta di bronzo
        const angle = Math.atan2(this.vy, this.vx);
        ctx.rotate(angle);

        // Asta di legno
        ctx.fillStyle = '#92400e';
        ctx.fillRect(-14, -2, 22, 4);

        // Punta in ferro/bronzo acuminata
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(8, -4);
        ctx.lineTo(15, 0);
        ctx.lineTo(8, 4);
        ctx.closePath();
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }
}
