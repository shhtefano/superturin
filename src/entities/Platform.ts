import { Entity } from './Entity';
import { CollectibleType } from '../levels/types';

export type PlatformStyle =
  | 'ground_pave'
  | 'ground_grass'
  | 'stone_portico'
  | 'marble'
  | 'brick'
  | 'wood_dock'
  | 'steel_beam'
  | 'dentiera_rail'
  | 'lingotto_track';

export class Platform extends Entity {
  public isOneWay: boolean;
  public style: PlatformStyle;

  // Blocco Sorpresa "?" (Mystery Block stile Super Mario)
  public isQuestionBlock: boolean = false;
  public questionContent: CollectibleType = 'gianduiotto';
  public isHit: boolean = false;
  public bumpTimer: number = 0;
  public bumpOffset: number = 0;

  // Piattaforme Mobili
  public isMoving: boolean = false;
  public moveAxis: 'x' | 'y' = 'x';
  public moveRange: number = 0;
  public moveSpeed: number = 1.5;
  private startX: number;
  private startY: number;
  private moveTimer: number = Math.random() * Math.PI * 2;

  // Nuovi Ostacoli Interattivi
  public isBouncer: boolean = false;        // Molla Sabauda (lancia in alto con super salto)
  public isCrumbling: boolean = false;      // Piattaforma traballante che crolla dopo essere stata calpestata
  public isSpikeHazard: boolean = false;    // Dissuasori / spuntoni acuminati sabaudi dannosi
  public isBreakable: boolean = false;      // Cassa / barile distruggibile

  // Stati dinamici degli ostacoli
  public isBroken: boolean = false;
  public isFallen: boolean = false;
  public crumbleTimer: number = -1;         // -1: inerte, >0: tremolio prima del crollo
  public crumbleShake: number = 0;
  public respawnTimer: number = 0;          // tempo per rigenerarsi (per piattaforme cedevoli)
  public bounceAnim: number = 0;            // animazione compressione/rilascio della molla

  constructor(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    isOneWay: boolean = false,
    style: PlatformStyle = 'ground_pave',
    isQuestionBlock: boolean = false,
    questionContent: CollectibleType = 'gianduiotto',
    isMoving: boolean = false,
    moveAxis: 'x' | 'y' = 'x',
    moveRange: number = 0,
    moveSpeed: number = 1.5,
    isBouncer: boolean = false,
    isCrumbling: boolean = false,
    isSpikeHazard: boolean = false,
    isBreakable: boolean = false
  ) {
    super(id, x, y, width, height);
    this.isOneWay = isOneWay;
    this.style = style;
    this.isQuestionBlock = isQuestionBlock;
    this.questionContent = questionContent;
    this.isMoving = isMoving;
    this.moveAxis = moveAxis;
    this.moveRange = moveRange;
    this.moveSpeed = moveSpeed;
    this.isBouncer = isBouncer;
    this.isCrumbling = isCrumbling;
    this.isSpikeHazard = isSpikeHazard;
    this.isBreakable = isBreakable;

    this.startX = x;
    this.startY = y;
  }

  /**
   * Attiva l'effetto molla quando il giocatore vi atterra sopra
   */
  public triggerBounce(): void {
    this.bounceAnim = 0.35;
  }

  /**
   * Avvia il timer di crollo quando il giocatore atterra su una piattaforma traballante
   */
  public stepOn(): void {
    if (this.isCrumbling && this.crumbleTimer < 0 && !this.isFallen) {
      this.crumbleTimer = 0.9; // 900ms generosi di avviso prima del crollo
    }
  }

  /**
   * Distrugge una cassa/barile breakable
   */
  public shatter(): boolean {
    if (this.isBreakable && !this.isBroken) {
      this.isBroken = true;
      this.active = false;
      return true;
    }
    return false;
  }

  /**
   * Colpito da sotto dalla testa del giocatore (meccanica Mario classica)
   */
  public bump(): CollectibleType | null {
    if (!this.isQuestionBlock || this.isHit) return null;
    this.isHit = true;
    this.bumpTimer = 0.25; // Animazione rimbalzo
    return this.questionContent;
  }

  public update(dt: number): void {
    // Animazione rimbalzo verso l'alto quando blocco ? colpito
    if (this.bumpTimer > 0) {
      this.bumpTimer -= dt;
      this.bumpOffset = -Math.sin((1 - this.bumpTimer / 0.25) * Math.PI) * 10;
      if (this.bumpTimer <= 0) {
        this.bumpOffset = 0;
      }
    }

    // Animazione compressione/decompressione molla Bouncer
    if (this.bounceAnim > 0) {
      this.bounceAnim = Math.max(0, this.bounceAnim - dt * 2.5);
    }

    // Gestione crollo e rigenerazione piattaforma traballante (Crumbling)
    if (this.isCrumbling) {
      if (this.crumbleTimer > 0) {
        this.crumbleTimer -= dt;
        this.crumbleShake = (Math.random() - 0.5) * 5;
        if (this.crumbleTimer <= 0) {
          this.isFallen = true;
          this.active = false;
          this.respawnTimer = 3.5; // Si rigenera dopo 3.5 secondi
          this.crumbleShake = 0;
        }
      } else if (this.isFallen && this.respawnTimer > 0) {
        this.respawnTimer -= dt;
        if (this.respawnTimer <= 0) {
          this.isFallen = false;
          this.active = true;
          this.crumbleTimer = -1;
        }
      }
    }

    // Movimento oscillante continuo se piattaforma mobile
    if (this.isMoving && this.moveRange > 0 && this.active) {
      this.moveTimer += dt * this.moveSpeed;
      const offset = Math.sin(this.moveTimer) * this.moveRange;
      if (this.moveAxis === 'x') {
        const nextX = this.startX + offset;
        this.vx = (nextX - this.x) / dt;
        this.x = nextX;
      } else {
        const nextY = this.startY + offset;
        this.vy = (nextY - this.y) / dt;
        this.y = nextY;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.active || this.isBroken || this.isFallen) return;

    ctx.save();
    const renderY = Math.round(this.y + this.bumpOffset);
    const renderX = Math.round(this.x + this.crumbleShake);

    // =========================================================================
    // 1. MOLLA SABAUDA (BOUNCER) — Proietta in alto con super salto
    // =========================================================================
    if (this.isBouncer) {
      const compress = this.bounceAnim > 0 ? Math.sin(this.bounceAnim * Math.PI) * 6 : 0;
      
      // Base metallica in ghisa sabauda
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(renderX, renderY + this.height - 6, this.width, 6);

      // Spirale elastica in acciaio blu sabaudo
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const springTop = renderY + 4 + compress;
      const springBottom = renderY + this.height - 6;
      const segments = 4;
      for (let i = 0; i <= segments; i++) {
        const sy = springBottom - ((springBottom - springTop) / segments) * i;
        const sx = renderX + (this.width / 2) + (i % 2 === 0 ? -12 : 12);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Piastra superiore a rimbalzo dorata con freccia luminosa
      const plateY = renderY + compress;
      ctx.fillStyle = '#ffb703';
      ctx.fillRect(renderX + 2, plateY, this.width - 4, 8);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(renderX + 4, plateY, this.width - 8, 2);

      // Frecce verso l'alto (▲ ▲)
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('▲ ▲', renderX + this.width / 2, plateY + 7);

      ctx.restore();
      return;
    }

    // =========================================================================
    // 2. DISSUASORI STRADALI / SPUNTONI ACUMINATI (SPIKE HAZARD)
    // =========================================================================
    if (this.isSpikeHazard) {
      // Base in granito scuro
      ctx.fillStyle = '#334155';
      ctx.fillRect(renderX, renderY + this.height - 4, this.width, 4);

      // Triangoli acuminati in ferro sabaudo aguzzo
      const spikeWidth = 14;
      const spikeCount = Math.max(1, Math.floor(this.width / spikeWidth));
      const actualSpikeW = this.width / spikeCount;

      for (let i = 0; i < spikeCount; i++) {
        const sx = renderX + i * actualSpikeW;
        ctx.beginPath();
        ctx.moveTo(sx, renderY + this.height - 4);
        ctx.lineTo(sx + actualSpikeW / 2, renderY + 2);
        ctx.lineTo(sx + actualSpikeW, renderY + this.height - 4);
        ctx.closePath();

        // Sfumatura metallica di pericolo con riflesso rosso/argento
        const grad = ctx.createLinearGradient(sx, renderY, sx + actualSpikeW, renderY);
        grad.addColorStop(0, '#64748b');
        grad.addColorStop(0.5, '#f87171');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
      return;
    }

    // =========================================================================
    // 3. CASSA / BARILE DISTRUTTIBILE (BREAKABLE)
    // =========================================================================
    if (this.isBreakable) {
      // Legno di rovere piemontese caldo
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(renderX, renderY, this.width, this.height);

      // Asse orizzontale superiore e inferiore
      ctx.fillStyle = '#a16207';
      ctx.fillRect(renderX + 2, renderY + 2, this.width - 4, 3);
      ctx.fillRect(renderX + 2, renderY + this.height - 5, this.width - 4, 3);

      // Bordo rinforzato con diagonale a X in ferro battuto
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.strokeRect(renderX + 2, renderY + 2, this.width - 4, this.height - 4);

      ctx.beginPath();
      ctx.moveTo(renderX + 3, renderY + 3);
      ctx.lineTo(renderX + this.width - 3, renderY + this.height - 3);
      ctx.moveTo(renderX + this.width - 3, renderY + 3);
      ctx.lineTo(renderX + 3, renderY + this.height - 3);
      ctx.stroke();

      // Rivetti metallici agli angoli
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(renderX + 3, renderY + 3, 3, 3);
      ctx.fillRect(renderX + this.width - 6, renderY + 3, 3, 3);
      ctx.fillRect(renderX + 3, renderY + this.height - 6, 3, 3);
      ctx.fillRect(renderX + this.width - 6, renderY + this.height - 6, 3, 3);

      ctx.restore();
      return;
    }

    // =========================================================================
    // 4. PIATTAFORMA TRABALLANTE CEDEVOLE (CRUMBLING)
    // =========================================================================
    if (this.isCrumbling) {
      // Pietra friabile con crepe visibili
      const warningRatio = this.crumbleTimer > 0 ? this.crumbleTimer / 0.65 : 1;
      ctx.fillStyle = this.crumbleTimer > 0 ? '#b91c1c' : '#78716c';
      ctx.fillRect(renderX, renderY, this.width, this.height);

      ctx.fillStyle = this.crumbleTimer > 0 ? '#fca5a5' : '#a8a29e';
      ctx.fillRect(renderX, renderY, this.width, 3);

      // Disegno crepe nella roccia
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let cx = renderX + 10; cx < renderX + this.width - 8; cx += 22) {
        ctx.moveTo(cx, renderY + 2);
        ctx.lineTo(cx + 6, renderY + this.height / 2);
        ctx.lineTo(cx + 2, renderY + this.height - 2);
      }
      ctx.stroke();

      // Se sta per crollare, lampeggia con indicatore di pericolo
      if (this.crumbleTimer > 0) {
        ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
        ctx.fillRect(renderX, renderY, this.width * (1 - warningRatio), this.height);
      }

      ctx.restore();
      return;
    }

    // =========================================================================
    // 5. BLOCCO INTERROGATIVO "?" STILE SUPER MARIO
    // =========================================================================
    if (this.isQuestionBlock) {
      if (!this.isHit) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(renderX, renderY, this.width, this.height);

        ctx.fillStyle = '#fde68a';
        ctx.fillRect(renderX, renderY, this.width, 3);
        ctx.fillRect(renderX, renderY, 3, this.height);

        ctx.fillStyle = '#b45309';
        ctx.fillRect(renderX, renderY + this.height - 3, this.width, 3);
        ctx.fillRect(renderX + this.width - 3, renderY, 3, this.height);

        ctx.fillStyle = '#78350f';
        ctx.fillRect(renderX + 4, renderY + 4, 3, 3);
        ctx.fillRect(renderX + this.width - 7, renderY + 4, 3, 3);
        ctx.fillRect(renderX + 4, renderY + this.height - 7, 3, 3);
        ctx.fillRect(renderX + this.width - 7, renderY + this.height - 7, 3, 3);

        const questionAlpha = 0.85 + Math.sin(Date.now() * 0.008) * 0.15;
        ctx.save();
        ctx.globalAlpha = questionAlpha;
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(this.height * 0.65)}px "Press Start 2P", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', renderX + this.width / 2, renderY + this.height / 2 + 1);
        ctx.restore();
      } else {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(renderX, renderY, this.width, this.height);

        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(renderX, renderY, this.width, 2);
        ctx.fillRect(renderX, renderY, 2, this.height);

        ctx.fillStyle = '#334155';
        ctx.fillRect(renderX, renderY + this.height - 2, this.width, 2);
        ctx.fillRect(renderX + this.width - 2, renderY, 2, this.height);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(renderX + 4, renderY + 4, 2, 2);
        ctx.fillRect(renderX + this.width - 6, renderY + 4, 2, 2);
        ctx.fillRect(renderX + 4, renderY + this.height - 6, 2, 2);
        ctx.fillRect(renderX + this.width - 6, renderY + this.height - 6, 2, 2);
      }

      ctx.restore();
      return;
    }

    // =========================================================================
    // 6. STILI DI PIATTAFORMA AMBIENTALI STANDARD
    // =========================================================================
    if (this.style === 'ground_grass') {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(renderX, renderY, this.width, this.height);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(renderX, renderY, this.width, 8);
      ctx.fillStyle = '#16a34a';
      for (let x = renderX; x < renderX + this.width; x += 12) {
        ctx.fillRect(x + 2, renderY + 8, 6, 4);
      }
    } else if (this.style === 'ground_pave') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(renderX, renderY, this.width, this.height);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(renderX, renderY, this.width, 6);
      ctx.fillStyle = '#1e293b';
      for (let px = renderX + 6; px < renderX + this.width - 6; px += 20) {
        ctx.fillRect(px, renderY + 8, 14, 6);
        ctx.fillRect(px + 10, renderY + 18, 14, 6);
      }
    } else if (this.style === 'stone_portico') {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(renderX, renderY, this.width, this.height);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(renderX, renderY, this.width, 4);
      ctx.fillStyle = '#475569';
      for (let mx = renderX + 4; mx < renderX + this.width - 4; mx += 16) {
        ctx.fillRect(mx, renderY + this.height - 4, 8, 4);
      }
    } else if (this.style === 'brick') {
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(renderX, renderY, this.width, this.height);
      ctx.fillStyle = '#f87171';
      ctx.fillRect(renderX, renderY, this.width, 3);
      ctx.fillStyle = '#450a0a';
      for (let bx = renderX; bx < renderX + this.width; bx += 18) {
        ctx.fillRect(bx + 2, renderY + 4, 14, 6);
        ctx.fillRect(bx + 11, renderY + 12, 14, 6);
      }
    } else if (this.style === 'wood_dock') {
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(renderX, renderY, this.width, this.height);
      ctx.fillStyle = '#a16207';
      ctx.fillRect(renderX, renderY, this.width, 3);
      ctx.fillStyle = '#422006';
      for (let wx = renderX + 16; wx < renderX + this.width; wx += 20) {
        ctx.fillRect(wx, renderY + 2, 4, this.height);
      }
    } else if (this.style === 'steel_beam') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(renderX, renderY, this.width, this.height);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(renderX, renderY, this.width, 3);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(renderX, renderY + this.height - 3, this.width, 3);
      ctx.fillStyle = '#cbd5e1';
      for (let bx = renderX + 8; bx < renderX + this.width - 8; bx += 24) {
        ctx.fillRect(bx, renderY + 4, 3, 3);
      }
    } else if (this.style === 'dentiera_rail') {
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(renderX, renderY, this.width, this.height);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(renderX, renderY, this.width, 2);
      ctx.fillRect(renderX, renderY + this.height - 2, this.width, 2);
      ctx.fillStyle = '#e2e8f0';
      for (let rx = renderX + 2; rx < renderX + this.width - 4; rx += 8) {
        ctx.fillRect(rx, renderY + Math.floor(this.height / 2) - 2, 4, 4);
      }
    } else if (this.style === 'lingotto_track') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(renderX, renderY, this.width, this.height);
      for (let cx = renderX; cx < renderX + this.width; cx += 16) {
        const isRed = Math.floor((cx - renderX) / 16) % 2 === 0;
        ctx.fillStyle = isRed ? '#ef4444' : '#ffffff';
        ctx.fillRect(cx, renderY, Math.min(16, renderX + this.width - cx), 4);
      }
      ctx.fillStyle = '#fde047';
      for (let lx = renderX + 6; lx < renderX + this.width - 6; lx += 26) {
        ctx.fillRect(lx, renderY + Math.floor(this.height / 2), 12, 2);
      }
    } else {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(renderX, renderY, this.width, this.height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(renderX, renderY, this.width, 3);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(renderX, renderY + this.height - 3, this.width, 3);
    }

    if (this.isOneWay) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(renderX, renderY, this.width, 2);
    }

    ctx.restore();
  }
}
