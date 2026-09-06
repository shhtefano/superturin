import { Enemy } from './Enemy';

export abstract class BossEnemy extends Enemy {
  public isBoss: boolean = true;
  public hp: number;
  public maxHp: number;
  public bossName: string;
  public bossSubtitle: string;
  public invulnerableTimer: number = 0;
  public isDefeated: boolean = false;

  constructor(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    patrolLeft: number,
    patrolRight: number,
    moveSpeed: number,
    maxHp: number,
    bossName: string,
    bossSubtitle: string
  ) {
    super(id, x, y, width, height, patrolLeft, patrolRight, moveSpeed, true);
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.bossName = bossName;
    this.bossSubtitle = bossSubtitle;
  }

  /**
   * Subisce un colpo (stomp, proiettile, bomba, skill)
   * Restituisce true se il colpo ha abbattuto definitivamente il boss
   */
  public takeHit(damage: number = 1): boolean {
    if (this.isDead || this.invulnerableTimer > 0) return false;

    this.hp = Math.max(0, this.hp - damage);
    this.invulnerableTimer = 0.55; // Invulnerabilità temporanea post-hit

    if (this.hp <= 0) {
      this.isDefeated = true;
      this.die();
      return true;
    }

    return false;
  }

  public updateBossBase(dt: number): void {
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }
  }

  /**
   * Disegna la barra boss monumentale in alto sullo schermo (HUD Arcade Boss Bar)
   */
  public renderBossHealthBar(ctx: CanvasRenderingContext2D, screenWidth: number = 1280): void {
    if (this.isDead) return;

    ctx.save();
    const barWidth = 360;
    const barHeight = 18;
    const barX = (screenWidth - barWidth) / 2;
    const barY = 56;

    // Sfondo barra con ombra
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(barX - 4, barY - 20, barWidth + 8, barHeight + 28);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX - 4, barY - 20, barWidth + 8, barHeight + 28);

    // Titolo Boss
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`👑 ${this.bossName.toUpperCase()} 👑`, screenWidth / 2, barY - 6);

    // Sottotitolo / HP numerici
    ctx.fillStyle = '#38bdf8';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`HP: ${this.hp}/${this.maxHp}`, barX + barWidth, barY - 6);

    // Sfondo barra HP vuota
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Riempimento HP proporzionale
    const hpRatio = Math.max(0, this.hp / this.maxHp);
    const fillW = barWidth * hpRatio;
    const grad = ctx.createLinearGradient(barX, barY, barX + fillW, barY);
    grad.addColorStop(0, '#dc2626');
    grad.addColorStop(0.5, '#ef4444');
    grad.addColorStop(1, '#f87171');
    ctx.fillStyle = grad;
    ctx.fillRect(barX, barY, fillW, barHeight);

    // Tacche di separazione HP
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.lineWidth = 2;
    for (let i = 1; i < this.maxHp; i++) {
      const sx = barX + (barWidth / this.maxHp) * i;
      ctx.beginPath();
      ctx.moveTo(sx, barY);
      ctx.lineTo(sx, barY + barHeight);
      ctx.stroke();
    }

    ctx.restore();
  }
}
