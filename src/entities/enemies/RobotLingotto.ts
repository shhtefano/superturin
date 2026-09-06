import { Enemy } from './Enemy';

export class RobotLingotto extends Enemy {
  private sparkTimer: number = 0;
  private isSparking: boolean = false;
  private trackTimer: number = 0;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    // Robot industriale saldatore FIAT/Comau delle linee di montaggio del Lingotto
    // ATTENZIONE: isStompable = false! Corazza d'acciaio elettrificata.
    super(id, x, y, 38, 44, patrolLeft, patrolRight, 130, false);
  }

  public update(dt: number): void {
    if (this.isDead) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    this.trackTimer += dt * 14;
    this.sparkTimer += dt;

    // Ciclo scintille saldatrice
    if (this.sparkTimer > 2.0) {
      this.sparkTimer = 0;
      this.isSparking = true;
    } else if (this.sparkTimer > 0.6 && this.isSparking) {
      this.isSparking = false;
    }

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
      ctx.scale(1.2, 0.3);
    }

    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // Cingoli / Ruote di scorrimento industriale
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-halfW, halfH - 10, this.width, 10);
    // Denti del cingolo che girano
    const trackOffset = (this.trackTimer % 8) - 4;
    ctx.fillStyle = '#475569';
    for (let i = -halfW + 4; i < halfW - 2; i += 8) {
      ctx.fillRect(i + trackOffset, halfH - 3, 4, 3);
    }

    // Basamento d'acciaio
    ctx.fillStyle = '#334155';
    ctx.fillRect(-halfW + 3, halfH - 16, this.width - 6, 8);

    // Corpo arancione industriale FIAT / Comau
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-halfW + 5, -halfH + 12, this.width - 10, 18);
    // Targa FIAT / Robogate
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-halfW + 9, -halfH + 16, 14, 6);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('FIAT', -halfW + 10, -halfH + 21);

    // Torretta rotante con occhio laser a scansione
    ctx.fillStyle = '#475569';
    ctx.fillRect(-7, -halfH + 4, 14, 9);
    // Visore ottico ciano / rosso
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(0, -halfH + 6, 7, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(3, -halfH + 7, 2, 2);

    // Braccio robotico articolato
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -halfH + 14);
    ctx.lineTo(halfW - 4, -halfH + 10);
    ctx.lineTo(halfW + 6, -halfH + 24);
    ctx.stroke();

    // Giunti sferici del braccio
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(halfW - 4, -halfH + 10, 3, 0, Math.PI * 2);
    ctx.arc(halfW + 6, -halfH + 24, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Cannello saldatore / pinza
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(halfW + 4, -halfH + 26, 4, 7);

    // Scintille ed arco voltaico di saldatura
    if (this.isSparking && !this.isDead) {
      // Lampo luce azzurra
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.beginPath();
      ctx.arc(halfW + 6, -halfH + 34, 12, 0, Math.PI * 2);
      ctx.fill();

      // Scintille giallo-bianche che schizzano
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      for (let s = 0; s < 5; s++) {
        const angle = (s * 0.7) + (Math.random() * 0.4);
        const dist = 6 + Math.random() * 10;
        ctx.beginPath();
        ctx.moveTo(halfW + 6, -halfH + 34);
        ctx.lineTo(halfW + 6 + Math.cos(angle) * dist, -halfH + 34 + Math.sin(angle) * dist);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}
