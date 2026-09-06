import { Enemy } from './Enemy';

export abstract class BossEnemy extends Enemy {
  public isBoss: boolean = true;
  public hp: number;
  public maxHp: number;
  public bossName: string;
  public bossSubtitle: string;
  public invulnerableTimer: number = 0;
  public isDefeated: boolean = false;

  // Diventa true quando il boss entra per la prima volta nel viewport della camera.
  // La barra HP rimane nascosta finché il giocatore non raggiunge l'arena.
  public hasBeenEncountered: boolean = false;
  // Timer per il fade-in della barra (0 = nascosta, 1 = completamente visibile)
  public encounterAlpha: number = 0;

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

    this.hasBeenEncountered = true;
    this.encounterAlpha = 1;
    this.hp = Math.max(0, this.hp - damage);
    this.invulnerableTimer = 0.55; // Invulnerabilità temporanea post-hit

    if (this.hp <= 0) {
      this.isDefeated = true;
      this.die();
      return true;
    }

    return false;
  }

  /**
   * Verifica se il giocatore o la telecamera si stanno avvicinando all'arena del boss
   */
  public checkEncounter(playerX: number, cameraX: number, viewportWidth: number = 1280): void {
    if (this.hasBeenEncountered) return;
    // Il boss è incontrato se è visibile nella telecamera o se il giocatore è entro 1100px
    if (this.x < cameraX + viewportWidth + 300 && this.x > cameraX - 350) {
      this.hasBeenEncountered = true;
      this.encounterAlpha = 1;
    } else if (Math.abs(playerX - this.x) < 1100) {
      this.hasBeenEncountered = true;
      this.encounterAlpha = 1;
    }
  }

  public updateBossBase(dt: number): void {
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }
    // Avanza l'alpha del fade-in fino a 1 se il boss è già stato incontrato
    if (this.hasBeenEncountered && this.encounterAlpha < 1) {
      this.encounterAlpha = Math.min(1, this.encounterAlpha + dt * 4); // fade-in rapido
    }
  }

  /**
   * Disegna la barra boss monumentale in alto sullo schermo (HUD Arcade Boss Bar)
   */
  public renderBossHealthBar(ctx: CanvasRenderingContext2D, screenWidth: number = 1280): void {
    if (this.isDead || this.isDefeated) return;
    // Mostra la barra non appena il boss è attivo ed è stato incontrato
    if (!this.hasBeenEncountered && this.encounterAlpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0.2, this.encounterAlpha);
    const barWidth = 440;
    const barHeight = 20;
    const barX = (screenWidth - barWidth) / 2;
    const barY = 52;

    // Sfondo barra con ombra arcade e bordo dorato
    ctx.fillStyle = 'rgba(10, 16, 32, 0.94)';
    ctx.fillRect(barX - 6, barY - 22, barWidth + 12, barHeight + 30);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(barX - 6, barY - 22, barWidth + 12, barHeight + 30);

    // Titolo Boss
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 12px "Outfit", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`👑 ${this.bossName.toUpperCase()} 👑`, screenWidth / 2, barY - 6);

    // Sottotitolo / HP numerici
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`HP: ${this.hp}/${this.maxHp}`, barX + barWidth - 2, barY - 6);

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
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.lineWidth = 2.5;
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
