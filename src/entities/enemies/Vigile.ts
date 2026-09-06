import { Enemy } from './Enemy';

export class Vigile extends Enemy {
  private stepTimer: number = 0;
  private whistleTimer: number = 0;
  private isWhistling: boolean = false;
  private alertTimer: number = 0;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    // Vigile Urbano / "Civèt" di Torino con fischietto e paletta di stop
    super(id, x, y, 30, 44, patrolLeft, patrolRight, 125, true);
  }

  public update(dt: number): void {
    if (this.isDead) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    this.whistleTimer += dt;

    // Ciclo di fischio e allerta
    if (this.whistleTimer > 3.2) {
      this.whistleTimer = 0;
      this.isWhistling = true;
      this.alertTimer = 1.6;
    }

    if (this.isWhistling) {
      if (this.alertTimer < 1.0) {
        this.isWhistling = false; // Ha finito di fischiare, ora cammina allertato
      }
    }

    if (this.alertTimer > 0) {
      this.alertTimer -= dt;
    }

    // Se sta fischiando si ferma un istante, altrimenti cammina (più veloce se allertato)
    if (!this.isWhistling) {
      const currentSpeed = this.alertTimer > 0 ? this.moveSpeed * 1.45 : this.moveSpeed;
      this.stepTimer += dt * (this.alertTimer > 0 ? 1.6 : 1.0);

      if (this.movingRight) {
        this.x += currentSpeed * dt;
        if (this.x >= this.patrolRight) {
          this.x = this.patrolRight;
          this.movingRight = false;
        }
      } else {
        this.x -= currentSpeed * dt;
        if (this.x <= this.patrolLeft) {
          this.x = this.patrolLeft;
          this.movingRight = true;
        }
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
      ctx.scale(1.35, 0.25);
    }

    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // Gambe con pantaloni blu scuro e riga bianca laterale
    const leg = Math.sin(this.stepTimer * 12) * 5;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-6 + leg, halfH - 12, 5, 12);
    ctx.fillRect(1 - leg, halfH - 12, 5, 12);

    // Scarpe nere lucide
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-7 + leg, halfH - 3, 7, 3);
    ctx.fillRect(0 - leg, halfH - 3, 7, 3);

    // Giacca blu della Polizia Municipale di Torino ("Civèt")
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-halfW + 3, -halfH + 16, this.width - 6, 18);

    // Cinturone bianco a bandoliera (storico torinese)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-halfW + 4, -halfH + 16);
    ctx.lineTo(halfW - 4, -halfH + 32);
    ctx.lineTo(halfW - 7, -halfH + 34);
    ctx.lineTo(-halfW + 1, -halfH + 18);
    ctx.closePath();
    ctx.fill();

    // Cintura in vita con fibbia dorata
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-halfW + 3, -halfH + 30, this.width - 6, 3);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-2, -halfH + 29, 5, 5);

    // Testa
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -halfH + 7, 11, 10);

    // Baffo severo
    ctx.fillStyle = '#334155';
    ctx.fillRect(2, -halfH + 13, 5, 2);

    // Fischietto d'argento
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(4, -halfH + 12, 4, 3);

    // Berretto da vigile con visiera nera e stemma d'oro
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-7, -halfH + 1, 14, 7);
    ctx.fillStyle = '#0f172a'; // Visiera
    ctx.fillRect(0, -halfH + 6, 8, 2);
    ctx.fillStyle = '#fbbf24'; // Fregio Toro dorato
    ctx.fillRect(-1, -halfH + 2, 3, 3);

    // Paletta di stop in mano (alzata in alto se allertato o fischiando)
    const paddleY = this.isWhistling || this.alertTimer > 0 ? -halfH - 4 : -halfH + 14;
    const paddleX = 10;
    // Manico paletta
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(paddleX, paddleY + 8, 3, 14);
    // Disco paletta (cerchio bianco con centro rosso ALT)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(paddleX + 1.5, paddleY + 4, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(paddleX + 1.5, paddleY + 4, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Effetto onde sonore del fischietto quando fischia
    if (this.isWhistling) {
      const pulse = (Math.sin(Date.now() * 0.03) + 1) * 0.5;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(10, -halfH + 10, 8 + pulse * 5, -0.6, 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(10, -halfH + 10, 14 + pulse * 6, -0.6, 0.6);
      ctx.stroke();

      // Scritta esclamativa
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('♪!', 14, -halfH - 2);
    }

    ctx.restore();
  }
}
