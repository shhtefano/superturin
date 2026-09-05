import { Entity } from './Entity';
import { CollectibleType } from '../levels/types';

export type PlatformStyle =
  | 'ground_pave'
  | 'ground_grass'
  | 'stone_portico'
  | 'marble'
  | 'brick'
  | 'wood_dock'
  | 'steel_beam';

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
    moveSpeed: number = 1.5
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

    this.startX = x;
    this.startY = y;
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
    // Animazione rimbalzo verso l'alto quando colpito
    if (this.bumpTimer > 0) {
      this.bumpTimer -= dt;
      // Curva di rimbalzo su e giù
      this.bumpOffset = -Math.sin((1 - this.bumpTimer / 0.25) * Math.PI) * 10;
      if (this.bumpTimer <= 0) {
        this.bumpOffset = 0;
      }
    }

    // Movimento oscillante continuo se piattaforma mobile
    if (this.isMoving && this.moveRange > 0) {
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
    ctx.save();
    const renderY = Math.round(this.y + this.bumpOffset);
    const renderX = Math.round(this.x);

    // =========================================================================
    // BLOCCO INTERROGATIVO "?" STILE SUPER MARIO
    // =========================================================================
    if (this.isQuestionBlock) {
      if (!this.isHit) {
        // Blocco dorato lucido attivo con bordi a rilievo
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(renderX, renderY, this.width, this.height);

        // Bordo superiore/sinistro chiaro (3D bevel)
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(renderX, renderY, this.width, 3);
        ctx.fillRect(renderX, renderY, 3, this.height);

        // Bordo inferiore/destro scuro
        ctx.fillStyle = '#b45309';
        ctx.fillRect(renderX, renderY + this.height - 3, this.width, 3);
        ctx.fillRect(renderX + this.width - 3, renderY, 3, this.height);

        // Rivetti negli angoli
        ctx.fillStyle = '#78350f';
        ctx.fillRect(renderX + 4, renderY + 4, 3, 3);
        ctx.fillRect(renderX + this.width - 7, renderY + 4, 3, 3);
        ctx.fillRect(renderX + 4, renderY + this.height - 7, 3, 3);
        ctx.fillRect(renderX + this.width - 7, renderY + this.height - 7, 3, 3);

        // Punto interrogativo bianco brillante lampeggiante
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
        // Blocco ferroso esaurito (grigio scuro opaco, metallo inerte)
        ctx.fillStyle = '#64748b';
        ctx.fillRect(renderX, renderY, this.width, this.height);

        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(renderX, renderY, this.width, 2);
        ctx.fillRect(renderX, renderY, 2, this.height);

        ctx.fillStyle = '#334155';
        ctx.fillRect(renderX, renderY + this.height - 2, this.width, 2);
        ctx.fillRect(renderX + this.width - 2, renderY, 2, this.height);

        // Rivetti negli angoli
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
    // STILI DI PIATTAFORMA PULITI & MARIO-STYLE
    // =========================================================================
    if (this.style === 'ground_grass') {
      // Terreno prato stile Mario (Valentino): terra marrone calda + erba verde brillante sopra
      ctx.fillStyle = '#92400e'; // Terra
      ctx.fillRect(renderX, renderY, this.width, this.height);

      // Erba superiore verde con dentini arrotondati
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(renderX, renderY, this.width, 8);

      ctx.fillStyle = '#16a34a';
      for (let x = renderX; x < renderX + this.width; x += 12) {
        ctx.fillRect(x + 2, renderY + 8, 6, 4);
      }
    } else if (this.style === 'ground_pave') {
      // Pavé torinese pulito (Centro)
      ctx.fillStyle = '#334155';
      ctx.fillRect(renderX, renderY, this.width, this.height);

      // Bordo lastricato superiore
      ctx.fillStyle = '#64748b';
      ctx.fillRect(renderX, renderY, this.width, 6);

      // Pattern a ciottoli pulito
      ctx.fillStyle = '#1e293b';
      for (let px = renderX + 6; px < renderX + this.width - 6; px += 20) {
        ctx.fillRect(px, renderY + 8, 14, 6);
        ctx.fillRect(px + 10, renderY + 18, 14, 6);
      }
    } else if (this.style === 'stone_portico') {
      // Cornicione dei portici barocchi (piattaforme sospese)
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(renderX, renderY, this.width, this.height);

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(renderX, renderY, this.width, 4);

      ctx.fillStyle = '#475569';
      for (let mx = renderX + 4; mx < renderX + this.width - 4; mx += 16) {
        ctx.fillRect(mx, renderY + this.height - 4, 8, 4);
      }
    } else if (this.style === 'brick') {
      // Mattoni rossi sabaudi / Mole Antonelliana
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
      // Pontili di legno del Fiume Po
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(renderX, renderY, this.width, this.height);

      ctx.fillStyle = '#a16207';
      ctx.fillRect(renderX, renderY, this.width, 3);

      ctx.fillStyle = '#422006';
      for (let wx = renderX + 16; wx < renderX + this.width; wx += 20) {
        ctx.fillRect(wx, renderY, 2, this.height);
      }
    } else if (this.style === 'steel_beam') {
      // Travi d'acciaio industriali del Lingotto
      ctx.fillStyle = '#475569';
      ctx.fillRect(renderX, renderY, this.width, this.height);

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(renderX, renderY, this.width, 3);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(renderX, renderY + this.height - 3, this.width, 3);

      // Bulloni metallici industriali
      ctx.fillStyle = '#cbd5e1';
      for (let bx = renderX + 8; bx < renderX + this.width - 8; bx += 24) {
        ctx.fillRect(bx, renderY + 4, 3, 3);
      }
    } else {
      // Marmo chiaro
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(renderX, renderY, this.width, this.height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(renderX, renderY, this.width, 3);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(renderX, renderY + this.height - 3, this.width, 3);
    }

    // Se è one-way, bordo superiore con riflesso luminoso
    if (this.isOneWay) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(renderX, renderY, this.width, 2);
    }

    ctx.restore();
  }
}
