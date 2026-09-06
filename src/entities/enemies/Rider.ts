import { Enemy } from './Enemy';

export class Rider extends Enemy {
  private wheelTimer: number = 0;
  private headlightPulse: number = 0;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    // Rider su monopattino elettrico selvaggio (molto veloce, sfreccia nei viali e sul lungopo)
    super(id, x, y, 34, 48, patrolLeft, patrolRight, 220, true);
  }

  public update(dt: number): void {
    if (this.isDead) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    this.wheelTimer += dt * 20;
    this.headlightPulse += dt * 8;

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
    if (!this.active) return;

    ctx.save();
    ctx.translate(Math.round(this.x + this.width / 2), Math.round(this.y + this.height / 2));
    if (!this.movingRight) {
      ctx.scale(-1, 1);
    }

    if (this.isDead) {
      ctx.scale(1.3, 0.25);
    }

    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // --- MONOPATTINO ELETTRICO ---
    // Pedana nera
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-halfW + 2, halfH - 8, this.width - 4, 4);

    // Ruota anteriore
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(halfW - 5, halfH - 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444'; // Cerchio interno rosso racing
    ctx.beginPath();
    ctx.arc(halfW - 5, halfH - 4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Ruota posteriore
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-halfW + 6, halfH - 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-halfW + 6, halfH - 4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Luce posteriore rossa a LED pulsante
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-halfW + 1, halfH - 10, 3, 3);

    // Piantone manubrio inclinato
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(halfW - 5, halfH - 8);
    ctx.lineTo(halfW - 8, -halfH + 18);
    ctx.stroke();

    // Manopole manubrio
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(halfW - 12, -halfH + 16, 7, 3);

    // Faro anteriore a LED con cono di luce
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(halfW - 7, -halfH + 18, 4, 4);

    // Cono di luce del faro
    if (!this.isDead) {
      const alpha = 0.12 + Math.sin(this.headlightPulse) * 0.05;
      ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(halfW - 3, -halfH + 20);
      ctx.lineTo(halfW + 65, -halfH + 5);
      ctx.lineTo(halfW + 65, halfH - 2);
      ctx.closePath();
      ctx.fill();
    }

    // --- PERSONAGGIO RIDER ---
    // Gambe leggermente piegate sulla pedana
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, halfH - 18, 5, 12);
    ctx.fillRect(2, halfH - 20, 5, 14);

    // Zainone termico cubico fluo (arancione/verde)
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-halfW - 1, -halfH + 10, 14, 18);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-halfW + 1, -halfH + 12, 10, 14);
    // Logo riflettente sullo zaino
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-halfW + 3, -halfH + 17, 6, 4);

    // Giacca a vento fluo
    ctx.fillStyle = '#10b981';
    ctx.fillRect(-2, -halfH + 12, 12, 16);

    // Striscia catarifrangente argento
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-2, -halfH + 19, 12, 3);

    // Braccia protese al manubrio
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(3, -halfH + 15);
    ctx.lineTo(halfW - 9, -halfH + 18);
    ctx.stroke();

    // Testa e collo
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(0, -halfH + 5, 8, 8);

    // Caschetto aerodinamico da ciclista
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(3, -halfH + 5, 7, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Visiera parasole nera
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(5, -halfH + 4, 6, 3);

    ctx.restore();
  }
}
