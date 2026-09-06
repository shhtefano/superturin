import { BossEnemy } from './BossEnemy';

export class BossPiccione extends BossEnemy {
  private flapTimer: number = 0;
  private attackPhaseTimer: number = 0;
  private isDiving: boolean = false;
  private baseHeightY: number;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    super(
      id,
      x,
      y,
      72,
      56,
      patrolLeft,
      patrolRight,
      130, // moveSpeed
      3,   // maxHp (3 colpi per scontro rapido e divertente)
      'Concettina A Pilusa',
      'La Terribile Regina dei Tetti Sabaudi e della Mole'
    );
    this.baseHeightY = y;
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

    this.updateBossBase(dt);
    this.flapTimer += dt * 10;
    this.attackPhaseTimer += dt;

    // Ogni 3.2 secondi il Re Piccione inizia una picchiata rapida verso il terreno
    if (!this.isDiving && this.attackPhaseTimer >= 3.2) {
      this.isDiving = true;
      this.attackPhaseTimer = 0;
    }

    if (this.isDiving) {
      // Picchiata verso il basso
      this.y += 220 * dt;
      if (this.y >= this.baseHeightY + 110) {
        this.isDiving = false;
        this.attackPhaseTimer = 0;
      }
    } else {
      // Risalita morbida verso la quota di volo base con oscillazione sinusoidale
      if (this.y > this.baseHeightY) {
        this.y -= 120 * dt;
      } else {
        this.y = this.baseHeightY + Math.sin(this.flapTimer * 0.4) * 16;
      }
    }

    // Movimento orizzontale di pattuglia
    if (this.movingRight) {
      this.x += this.moveSpeed * (this.isDiving ? 1.4 : 1) * dt;
      if (this.x >= this.patrolRight) {
        this.movingRight = false;
      }
    } else {
      this.x -= this.moveSpeed * (this.isDiving ? 1.4 : 1) * dt;
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

    // Effetto lampeggio bianco/rosso durante l'invulnerabilità
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 60) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    ctx.translate(renderX + this.width / 2, renderY + this.height / 2);
    if (!this.movingRight) {
      ctx.scale(-1, 1);
    }

    const wingAngle = Math.sin(this.flapTimer) * 0.45;

    // Mantellina Reale Rossa
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-12, -6);
    ctx.lineTo(-32, 18);
    ctx.lineTo(-18, 22);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Corpo del piccione maestoso
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(0, 4, 26, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Petto cangiante verde/ametista sabaudo
    ctx.fillStyle = '#0d9488';
    ctx.beginPath();
    ctx.ellipse(10, 6, 14, 12, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Ala con piume grandi
    ctx.save();
    ctx.rotate(wingAngle);
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(-6, 2, 22, 10, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Testa
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(16, -10, 14, 0, Math.PI * 2);
    ctx.fill();

    // Occhio reale rosso rubino con pupilla nera
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, -12, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(21, -12, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Becco fiero
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(28, -10);
    ctx.lineTo(38, -6);
    ctx.lineTo(28, -2);
    ctx.closePath();
    ctx.fill();

    // Corona Reale Sabauda Dorata con gemme
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.moveTo(10, -22);
    ctx.lineTo(13, -31);
    ctx.lineTo(17, -24);
    ctx.lineTo(21, -33);
    ctx.lineTo(25, -24);
    ctx.lineTo(29, -31);
    ctx.lineTo(31, -22);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Rubini della corona
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(19, -27, 3, 3);

    // Zampe artigliate tese durante la picchiata
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-4, 20);
    ctx.lineTo(this.isDiving ? 4 : -2, 28);
    ctx.moveTo(8, 20);
    ctx.lineTo(this.isDiving ? 16 : 10, 28);
    ctx.stroke();

    ctx.restore();
  }
}
