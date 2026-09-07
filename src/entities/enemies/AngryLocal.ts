import { Enemy } from './Enemy';

export class AngryLocal extends Enemy {
  private stepTimer: number = 0;

  constructor(id: string, x: number, y: number, patrolLeft: number, patrolRight: number) {
    super(id, x, y, 28, 44, patrolLeft, patrolRight, 140, true);
  }

  public update(dt: number, playerX?: number, playerY?: number): void {
    if (this.isDead) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.active = false;
      }
      return;
    }

    this.stepTimer += dt;
    if (this.punchCooldown > 0) {
      this.punchCooldown -= dt;
    }

    // Gestione attacco pugno/ombrellata
    if (this.isPunching) {
      this.punchTimer -= dt;
      if (this.punchTimer <= 0) {
        this.isPunching = false;
      }
    } else if (this.punchCooldown <= 0 && playerX !== undefined && playerY !== undefined) {
      // Controlla se il giocatore è di fronte e vicino (entro 105px in X e 40px in Y)
      const dx = playerX - (this.x + this.width / 2);
      const dy = Math.abs(playerY - (this.y + this.height / 2));
      const isFacing = (this.movingRight && dx > 0 && dx < 105) || (!this.movingRight && dx < 0 && dx > -105);

      if (isFacing && dy < 45) {
        this.isPunching = true;
        this.punchTimer = 0.42; // Dura 420ms
        this.punchCooldown = 1.4; // Cooldown di 1.4s
      }
    }

    // Se sta sferrando il pugno si ferma per piantare i piedi, altrimenti cammina
    if (!this.isPunching) {
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

    // Gambe (piegate a terra se sta tirando il pugno)
    const leg = this.isPunching ? 2 : Math.sin(this.stepTimer * 12) * 5;
    ctx.fillStyle = '#334155';
    ctx.fillRect(-6 + leg, halfH - 12, 5, 12);
    ctx.fillRect(1 - leg, halfH - 12, 5, 12);

    // Impermeabile beige / nocciola
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-halfW + 3, -halfH + 16, this.width - 6, 20);

    // Testa con cappello grigio
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -halfH + 8, 12, 10);

    // Occhiali e sopracciglia corrucciate
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, -halfH + 10, 4, 3);
    ctx.fillStyle = '#b91c1c'; // Sopracciglia arrabbiate
    ctx.fillRect(0, -halfH + 8, 6, 2);

    // Ombrello: se sta sferrando il pugno/stoccata, l'ombrello si distende in avanti con scia!
    if (this.isPunching) {
      // Braccio proteso in avanti
      ctx.fillStyle = '#b45309';
      ctx.fillRect(4, -halfH + 18, 16, 5);

      // Ombrello lungo affilato esteso verso destra
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(16, -halfH + 19, 28, 4);

      // Punta metallica affilata
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(44, -halfH + 17);
      ctx.lineTo(50, -halfH + 21);
      ctx.lineTo(44, -halfH + 25);
      ctx.closePath();
      ctx.fill();

      // Scia di fendente / pugno d'aria
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(36, -halfH + 21, 14, -0.6, 0.6);
      ctx.stroke();
    } else {
      // Ombrello sottobraccio a riposo
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-halfW, -halfH + 20, 16, 4);
    }

    ctx.restore();
  }
}
