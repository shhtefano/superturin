import { BossEnemy } from './BossEnemy';

export class BossComau extends BossEnemy {
  private weldTimer: number = 0;
  public isWelding: boolean = false;
  private sparkTimer: number = 0;
  private walkCycle: number = 0;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    super(
      id,
      x,
      y,
      94,
      78,
      patrolLeft,
      patrolRight,
      130, // moveSpeed
      6,   // maxHp (6 colpi)
      'Comau Titan FIAT Robogate',
      'Braccio Robotico Saldatore della Catena di Montaggio Lingotto'
    );
  }

  public update(dt: number): void {
    if (this.isDead) {
      this.y += 220 * dt;
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    this.updateBossBase(dt);
    this.walkCycle += dt * 7;
    this.weldTimer += dt;

    // Ogni 2.7 secondi emette una scarica di saldatura industriale con scintille
    if (this.weldTimer >= 2.7) {
      this.isWelding = true;
      this.sparkTimer += dt;
      if (this.sparkTimer >= 0.8) {
        this.isWelding = false;
        this.sparkTimer = 0;
        this.weldTimer = 0;
      }
    }

    // Movimento di pattuglia orizzontale (rallenta leggermente durante la saldatura)
    const currentSpeed = this.isWelding ? this.moveSpeed * 0.4 : this.moveSpeed;
    if (this.movingRight) {
      this.x += currentSpeed * dt;
      if (this.x >= this.patrolRight) {
        this.movingRight = false;
      }
    } else {
      this.x -= currentSpeed * dt;
      if (this.x <= this.patrolLeft) {
        this.movingRight = true;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    ctx.save();
    const renderX = Math.round(this.x);
    const renderY = Math.round(this.y);

    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 60) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    ctx.translate(renderX + this.width / 2, renderY + this.height / 2);
    if (!this.movingRight) {
      ctx.scale(-1, 1);
    }

    const legOffset = Math.sin(this.walkCycle) * 8;

    // Telaio Industriale Giallo COMAU
    ctx.fillStyle = '#eab308'; // Giallo FIAT/COMAU
    ctx.fillRect(-34, -18, 68, 38);

    // Bordo protettivo con strisce nere diagonali di cantiere
    ctx.fillStyle = '#1e293b';
    for (let i = -30; i < 30; i += 14) {
      ctx.beginPath();
      ctx.moveTo(i, -18);
      ctx.lineTo(i + 7, -18);
      ctx.lineTo(i + 1, -10);
      ctx.lineTo(i - 6, -10);
      ctx.closePath();
      ctx.fill();
    }

    // Piastra metallica centrale con logo Comau Titan
    ctx.fillStyle = '#334155';
    ctx.fillRect(-22, -6, 44, 20);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('COMAU 500', 0, 7);

    // Testa con torretta a sensori e visore laser rosso
    ctx.fillStyle = '#475569';
    ctx.fillRect(-18, -32, 36, 15);

    // Visore ottico rosso pulsante
    const laserPulse = 0.75 + Math.sin(Date.now() * 0.015) * 0.25;
    ctx.fillStyle = `rgba(239, 68, 68, ${laserPulse})`;
    ctx.fillRect(-12, -27, 24, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -26, 4, 4);

    // Girofaro di sicurezza arancione sul tetto della torretta
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(0, -35, 5, Math.PI, 0);
    ctx.fill();

    // Braccio robotico saldatore frontale
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(26, -5);
    ctx.lineTo(44, this.isWelding ? 6 : -14);
    ctx.lineTo(58, this.isWelding ? 16 : -4);
    ctx.stroke();

    // Pinza saldatrice con beccuccio
    ctx.fillStyle = '#334155';
    ctx.fillRect(56, this.isWelding ? 12 : -8, 12, 8);

    // Effetto saldatura con scintille incandescenti e bagliore blu/bianco
    if (this.isWelding) {
      const sparkX = 70;
      const sparkY = 16;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Scintille radiali
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      for (let s = 0; s < 6; s++) {
        const ang = (Math.PI * 2 * s) / 6 + Math.random() * 0.5;
        const len = 10 + Math.random() * 12;
        ctx.beginPath();
        ctx.moveTo(sparkX, sparkY);
        ctx.lineTo(sparkX + Math.cos(ang) * len, sparkY + Math.sin(ang) * len);
        ctx.stroke();
      }
    }

    // Zampe meccaniche idrauliche con pistoni
    // Gamba Sinistra
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-24, 20, 14, 16 + legOffset);
    ctx.fillRect(-28, 34 + legOffset, 20, 6);

    // Gamba Destra
    ctx.fillStyle = '#334155';
    ctx.fillRect(10, 20, 14, 16 - legOffset);
    ctx.fillRect(8, 34 - legOffset, 20, 6);

    // Pistone idraulico cromato
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-20, 22, 6, 8);
    ctx.fillRect(14, 22, 6, 8);

    ctx.restore();
  }
}
