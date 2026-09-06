import { BossEnemy } from './BossEnemy';

export class BossNutria extends BossEnemy {
  private jumpTimer: number = 0;
  private isJumping: boolean = false;
  private groundY: number;
  private runAnimTimer: number = 0;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    super(
      id,
      x,
      y,
      86,
      58,
      patrolLeft,
      patrolRight,
      140, // moveSpeed
      4,   // maxHp (4 colpi)
      'PinoFicaFica',
      'Signore Indiscusso dei Fondali del Po e dei Murazzi'
    );
    this.groundY = y;
  }

  public update(dt: number): void {
    if (this.isDead) {
      this.y += 200 * dt;
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    this.updateBossBase(dt);
    this.runAnimTimer += dt * 8;
    this.jumpTimer += dt;

    // Salto e Coda-Slam ogni 2.8 secondi
    if (!this.isJumping && this.jumpTimer >= 2.8) {
      this.isJumping = true;
      this.vy = -420;
      this.jumpTimer = 0;
    }

    if (this.isJumping) {
      this.vy += 980 * dt; // gravità
      this.y += this.vy * dt;

      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.isJumping = false;
        this.vy = 0;
      }
    }

    // Pattuglia orizzontale (più veloce a mezz'aria)
    const currentSpeed = this.isJumping ? this.moveSpeed * 1.25 : this.moveSpeed;
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

    const bob = Math.sin(this.runAnimTimer) * 3;

    // Coda lunga squamata corazzata con anelli punk d'acciaio
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(-25, 10 + bob);
    ctx.quadraticCurveTo(-45, 0 + bob, -55, 18);
    ctx.stroke();

    // Anelli metallici punk sulla coda
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-42, 6 + bob, 6, 0, Math.PI);
    ctx.arc(-50, 12 + bob, 5, 0, Math.PI);
    ctx.stroke();

    // Corpo massiccio della Nutria Regina
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.ellipse(0, 6 + bob, 34, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pancia con pelliccia più chiara bagnata
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(4, 12 + bob, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Testa robusta
    ctx.fillStyle = '#542307';
    ctx.beginPath();
    ctx.ellipse(28, -2 + bob, 18, 15, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Cresta Punk Murazzi (Fucsia fluo ribelle)
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(14, -14 + bob);
    ctx.lineTo(18, -26 + bob);
    ctx.lineTo(24, -15 + bob);
    ctx.lineTo(29, -28 + bob);
    ctx.lineTo(34, -13 + bob);
    ctx.closePath();
    ctx.fill();

    // Tiara d'argento dei Murazzi
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(20, -18 + bob, 14, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(25, -20 + bob, 4, 3); // zaffiro blu Po

    // Orecchio tondo
    ctx.fillStyle = '#292524';
    ctx.beginPath();
    ctx.arc(15, -8 + bob, 5, 0, Math.PI * 2);
    ctx.fill();

    // Occhio ambrato scintillante
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(33, -5 + bob, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(34, -5 + bob, 2, 0, Math.PI * 2);
    ctx.fill();

    // Muso e tartufo nero
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(44, 2 + bob, 4, 0, Math.PI * 2);
    ctx.fill();

    // Canini incisivi arancioni iconici della nutria
    ctx.fillStyle = '#f97316';
    ctx.fillRect(40, 6 + bob, 4, 8);
    ctx.fillRect(36, 6 + bob, 3, 7);

    // Baffi
    ctx.strokeStyle = '#d6d3d1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(38, 3 + bob);
    ctx.lineTo(52, 0 + bob);
    ctx.moveTo(38, 5 + bob);
    ctx.lineTo(50, 7 + bob);
    ctx.stroke();

    // Zampe palmate con unghie affilate
    ctx.fillStyle = '#292524';
    ctx.fillRect(-16, 22 + bob, 14, 7);
    ctx.fillRect(14, 22 + bob, 14, 7);

    ctx.restore();
  }
}
