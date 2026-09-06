import { BossEnemy } from './BossEnemy';

export class BossToro extends BossEnemy {
  private chargeTimer: number = 0;
  private isCharging: boolean = false;
  private chargeDuration: number = 0;
  private jumpTimer: number = 0;
  private isJumping: boolean = false;
  private groundY: number;
  private walkCycle: number = 0;
  private steamTimer: number = 0;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    super(
      id,
      x,
      y,
      112,
      76,
      patrolLeft,
      patrolRight,
      135, // velocità base
      8,   // 8 HP: Boss Finale poderoso!
      'Taurus Invictus',
      'Il Colosso Alchemico di Piazza Statuto — Sovrano delle Grotte Oscure'
    );
    this.groundY = y;
  }

  public update(dt: number): void {
    if (this.isDead) {
      this.y += 240 * dt;
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    const isEnraged = this.hp <= 4;
    const currentSpeed = isEnraged ? (this.isCharging ? 270 : 180) : (this.isCharging ? 210 : 135);
    this.speed = currentSpeed;

    this.updateBossBase(dt);
    this.walkCycle += dt * (isEnraged ? 10 : 7);
    this.steamTimer += dt * 4;

    // Ciclo di Carica frontale a testa bassa
    this.chargeTimer += dt;
    if (!this.isCharging && this.chargeTimer >= (isEnraged ? 2.5 : 4.0)) {
      this.isCharging = true;
      this.chargeDuration = isEnraged ? 1.6 : 1.2;
      this.chargeTimer = 0;
    }

    if (this.isCharging) {
      this.chargeDuration -= dt;
      if (this.chargeDuration <= 0) {
        this.isCharging = false;
      }
    }

    // Salto Schiacciata Terremotante
    this.jumpTimer += dt;
    if (!this.isJumping && this.jumpTimer >= (isEnraged ? 3.2 : 5.0)) {
      this.isJumping = true;
      this.vy = -450;
      this.jumpTimer = 0;
    }

    if (this.isJumping) {
      this.vy += 980 * dt; // gravità
      this.y += this.vy * dt;
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.vy = 0;
        this.isJumping = false;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    if (this.direction < 0) {
      ctx.scale(-1, 1);
    }

    // Effetto lampeggio al danno
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 60) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    const isEnraged = this.hp <= 4;
    const legOffset = Math.sin(this.walkCycle) * (this.isCharging ? 12 : 7);

    // 1. Alone Alchemico se Enraged (viola/rosso fuoco)
    if (isEnraged) {
      const pulse = 0.35 + Math.sin(Date.now() * 0.012) * 0.2;
      ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 68, 48, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(168, 85, 247, ${pulse * 0.8})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 56, 38, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Coda possente con ciuffo di pelo
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-45, -5);
    const tailWag = Math.sin(this.walkCycle * 1.5) * 12;
    ctx.quadraticCurveTo(-58, -15 + tailWag, -62, 10 + tailWag);
    ctx.stroke();
    // Ciuffo della coda
    ctx.fillStyle = isEnraged ? '#dc2626' : '#f59e0b';
    ctx.beginPath();
    ctx.arc(-62, 12 + tailWag, 6, 0, Math.PI * 2);
    ctx.fill();

    // 3. Zampe posteriori possenti in ferro battuto sabaudo
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-38, 12, 16, 24 + legOffset);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-22, 12, 16, 24 - legOffset);

    // Zoccoli dorati rinforzati
    ctx.fillStyle = '#ffb703';
    ctx.fillRect(-40, 32 + legOffset, 19, 7);
    ctx.fillRect(-24, 32 - legOffset, 19, 7);

    // 4. Busto massiccio del Toro (armatura sabauda)
    ctx.fillStyle = isEnraged ? '#450a0a' : '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-46, -24, 76, 42, 12);
    ctx.fill();

    // Corazza laterale con fregi dorati sabaudi
    ctx.fillStyle = isEnraged ? '#b91c1c' : '#334155';
    ctx.fillRect(-32, -18, 48, 28);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(-32, -18, 48, 28);

    // Emblema Reale di Torino (Toro rampante dorato stilizzato)
    ctx.fillStyle = '#ffb703';
    ctx.font = 'bold 12px serif';
    ctx.textAlign = 'center';
    ctx.fillText('TORO', -8, 2);

    // 5. Zampe anteriori
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, 12, 16, 24 - legOffset);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(24, 12, 16, 24 + legOffset);

    // Zoccoli anteriori
    ctx.fillStyle = '#ffb703';
    ctx.fillRect(6, 32 - legOffset, 19, 7);
    ctx.fillRect(22, 32 + legOffset, 19, 7);

    // 6. Collo taurino tauriforme rinforzato
    ctx.fillStyle = isEnraged ? '#7f1d1d' : '#334155';
    ctx.beginPath();
    ctx.moveTo(18, -20);
    ctx.lineTo(44, -32);
    ctx.lineTo(48, 4);
    ctx.lineTo(18, 12);
    ctx.closePath();
    ctx.fill();

    // 7. Testa imponente del Toro
    const headAngle = this.isCharging ? 0.25 : 0; // Abbassa la testa se carica!
    ctx.save();
    ctx.translate(40, -12);
    ctx.rotate(headAngle);

    ctx.fillStyle = isEnraged ? '#991b1b' : '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-4, -18, 36, 32, 8);
    ctx.fill();

    // Muso bronzeo con narici
    ctx.fillStyle = '#b45309';
    ctx.fillRect(16, -6, 18, 18);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(28, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // Anello d'oro al naso (iconico toro sabaudo)
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(32, 6, 5, 0, Math.PI * 2);
    ctx.stroke();

    // Vapore alchemico dalle narici
    if (this.isCharging || isEnraged) {
      const steamAlpha = 0.6 + Math.sin(this.steamTimer) * 0.3;
      ctx.fillStyle = isEnraged ? `rgba(239, 68, 68, ${steamAlpha})` : `rgba(241, 245, 249, ${steamAlpha})`;
      ctx.beginPath();
      ctx.arc(36 + Math.sin(this.steamTimer) * 4, -4, 4, 0, Math.PI * 2);
      ctx.arc(44 + Math.cos(this.steamTimer) * 5, -8, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Occhi fiammeggianti
    ctx.fillStyle = isEnraged ? '#ef4444' : '#fbbf24';
    ctx.beginPath();
    ctx.arc(10, -8, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, -9, 2, 2);

    // 8. Corna monumentali dorate e affilate
    ctx.strokeStyle = isEnraged ? '#f97316' : '#f59e0b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    // Corno Sinistro
    ctx.moveTo(6, -18);
    ctx.quadraticCurveTo(14, -38, 28, -42);
    ctx.stroke();
    // Corno Destro
    ctx.moveTo(14, -18);
    ctx.quadraticCurveTo(22, -36, 36, -38);
    ctx.stroke();

    // Punte delle corna affilate
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(28, -42, 2.5, 0, Math.PI * 2);
    ctx.arc(36, -38, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // restore head transform

    ctx.restore();
  }
}
