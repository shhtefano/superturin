import { LevelTheme } from '../../levels/types';

export class ParallaxBackground {
  private cameraX: number = 0;
  private width: number = 1280;
  private height: number = 720;
  private theme: LevelTheme = 'centro';

  // Nuvole stile Super Mario con posizioni fisse nel mondo
  private clouds = [
    { x: 120, y: 80, scale: 1.2 },
    { x: 480, y: 140, scale: 0.8 },
    { x: 890, y: 95, scale: 1.0 },
    { x: 1350, y: 120, scale: 1.3 },
    { x: 1800, y: 75, scale: 0.9 },
    { x: 2300, y: 130, scale: 1.1 },
    { x: 2850, y: 90, scale: 1.2 },
    { x: 3400, y: 110, scale: 1.0 },
    { x: 3950, y: 85, scale: 1.3 },
  ];

  constructor(viewportWidth: number = 1280, viewportHeight: number = 720) {
    this.width = viewportWidth;
    this.height = viewportHeight;
  }

  public setTheme(theme: LevelTheme): void {
    this.theme = theme;
  }

  public update(cameraX: number): void {
    this.cameraX = cameraX;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.theme === 'mole') {
      this.renderMoleTheme(ctx);
    } else if (this.theme === 'valentino') {
      this.renderValentinoTheme(ctx);
    } else if (this.theme === 'notte') {
      this.renderNotteTheme(ctx);
    } else {
      this.renderCentroTheme(ctx);
    }
  }

  // =========================================================================
  // TEMA 1: CENTRO DI TORINO (Stile Super Mario luminoso & pulito)
  // =========================================================================
  private renderCentroTheme(ctx: CanvasRenderingContext2D): void {
    // 1. Cielo azzurro Mario vivace
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, '#38bdf8');   // Azzurro limpido
    sky.addColorStop(0.7, '#7dd3fc');
    sky.addColorStop(1, '#bae6fd');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Sole caldo arcade
    ctx.save();
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(this.width * 0.85, 90, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Nuvole stile Super Mario (parallasse lentissimo 0.08)
    this.renderMarioClouds(ctx, 0.08, 'rgba(255, 255, 255, 0.95)');

    // 4. Montagne alpine lontane pulite (parallasse 0.12)
    this.renderCleanMountains(ctx, 0.12, '#93c5fd', '#dbeafe');

    // 5. Colline verdi torinesi morbide con Basilica di Superga e Mole Antonelliana (parallasse 0.22)
    this.renderRollingHills(ctx, 0.22, '#22c55e', '#16a34a', true);
  }

  // =========================================================================
  // TEMA 2: MOLE ANTONELLIANA (Tramonto dorato & salita verticale)
  // =========================================================================
  private renderMoleTheme(ctx: CanvasRenderingContext2D): void {
    // Gradiente tramonto violetto/arancio
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, '#311042');   // Viola crepuscolo
    sky.addColorStop(0.5, '#7c2d12'); // Mattone caldo
    sky.addColorStop(0.85, '#ea580c'); // Arancio dorato
    sky.addColorStop(1, '#fde047');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    // Stelle e luna crescente
    this.renderStars(ctx, 0.02);

    // Silhouette maestosa ravvicinata della Mole Antonelliana che sale verso il cielo
    this.renderMoleStructureBackdrop(ctx, 0.15);
  }

  // =========================================================================
  // TEMA 3: PARCO DEL VALENTINO (Natura, Fiume Po e alberi stile Mario)
  // =========================================================================
  private renderValentinoTheme(ctx: CanvasRenderingContext2D): void {
    // Cielo sereno e fresco
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, '#0284c7');
    sky.addColorStop(0.65, '#38bdf8');
    sky.addColorStop(1, '#a7f3d0');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    this.renderMarioClouds(ctx, 0.08, 'rgba(255, 255, 255, 0.92)');

    // Colline del Po
    this.renderRollingHills(ctx, 0.18, '#15803d', '#166534', false);

    // Alberi arrotondati stile Super Mario lungo il parco
    this.renderMarioTrees(ctx, 0.35);

    // Onde morbide del Fiume Po sullo sfondo
    this.renderRiverPo(ctx, 0.4);
  }

  // =========================================================================
  // TEMA 4: TORINO NOTTURNA (Luci d'Artista & stelle)
  // =========================================================================
  private renderNotteTheme(ctx: CanvasRenderingContext2D): void {
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, '#020617');
    sky.addColorStop(0.7, '#0f172a');
    sky.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    this.renderStars(ctx, 0.03);

    // Installazioni luminose "Luci d'Artista" sospese in cielo
    this.renderLuciArtista(ctx, 0.1);

    // Skyline notturno con finestre accese
    this.renderNightSkyline(ctx, 0.2);
  }

  // =========================================================================
  // HELPER GRAFICI CONDIVISI (PULITI, ICONICI, STILE SUPER MARIO)
  // =========================================================================

  /**
   * Disegna nuvole soffici e arrotondate tipo Super Mario
   */
  private renderMarioClouds(ctx: CanvasRenderingContext2D, speed: number, color: string): void {
    ctx.save();
    ctx.fillStyle = color;

    for (const c of this.clouds) {
      const screenX = (c.x - this.cameraX * speed) % (this.width + 400);
      const x = screenX < -150 ? screenX + this.width + 500 : screenX;
      const y = c.y;
      const s = c.scale;

      // Forma nuvola a 3 lobi con base piatta arrotondata
      ctx.beginPath();
      // Lobo centrale alto
      ctx.arc(x + 40 * s, y, 22 * s, 0, Math.PI * 2);
      // Lobo sinistro
      ctx.arc(x + 18 * s, y + 6 * s, 16 * s, 0, Math.PI * 2);
      // Lobo destro
      ctx.arc(x + 62 * s, y + 6 * s, 16 * s, 0, Math.PI * 2);
      // Base piatta
      ctx.fillRect(x + 8 * s, y + 4 * s, 64 * s, 18 * s);
      ctx.fill();

      // Occhietti stile Mario (dettaglio simpatico!)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 32 * s, y - 2 * s, 3 * s, 8 * s);
      ctx.fillRect(x + 46 * s, y - 2 * s, 3 * s, 8 * s);
      ctx.fillStyle = color;
    }

    ctx.restore();
  }

  /**
   * Montagne alpine a punta morbida con picchi innevati puliti
   */
  private renderCleanMountains(ctx: CanvasRenderingContext2D, speed: number, baseCol: string, snowCol: string): void {
    const spacing = 380;
    const offset = (this.cameraX * speed) % spacing;

    ctx.save();
    for (let x = -offset - spacing; x < this.width + spacing; x += spacing) {
      // Montagna base
      ctx.fillStyle = baseCol;
      ctx.beginPath();
      ctx.moveTo(x, this.height - 180);
      ctx.lineTo(x + spacing / 2, this.height - 390);
      ctx.lineTo(x + spacing, this.height - 180);
      ctx.closePath();
      ctx.fill();

      // Cappuccio innevato geometrico pulito
      ctx.fillStyle = snowCol;
      ctx.beginPath();
      ctx.moveTo(x + spacing / 2, this.height - 390);
      ctx.lineTo(x + spacing / 2 - 40, this.height - 330);
      ctx.lineTo(x + spacing / 2, this.height - 340);
      ctx.lineTo(x + spacing / 2 + 40, this.height - 330);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Colline verdi tondeggianti (stile colline di Mario) con Superga e la Mole
   */
  private renderRollingHills(
    ctx: CanvasRenderingContext2D,
    speed: number,
    hillColor: string,
    shadowColor: string,
    includeLandmarks: boolean
  ): void {
    const patternWidth = 1200;
    const offset = (this.cameraX * speed) % patternWidth;

    ctx.save();

    for (let bx = -offset - patternWidth; bx < this.width + patternWidth; bx += patternWidth) {
      // Collina grande 1
      this.drawMarioHill(ctx, bx + 180, this.height - 120, 260, 160, hillColor, shadowColor);

      // Basilica di Superga sopra la prima collina
      if (includeLandmarks) {
        this.drawSuperga(ctx, bx + 180, this.height - 280);
      }

      // Collina media 2
      this.drawMarioHill(ctx, bx + 640, this.height - 100, 200, 130, hillColor, shadowColor);

      // Mole Antonelliana in lontananza pulita ed elegante tra le colline
      if (includeLandmarks) {
        this.drawCleanMole(ctx, bx + 860, this.height - 130);
      }

      // Collina 3
      this.drawMarioHill(ctx, bx + 1040, this.height - 110, 240, 150, hillColor, shadowColor);
    }

    ctx.restore();
  }

  private drawMarioHill(
    ctx: CanvasRenderingContext2D,
    cx: number,
    baseY: number,
    w: number,
    h: number,
    fillColor: string,
    shadowColor: string
  ): void {
    ctx.save();
    // Bordo / ombra della collina
    ctx.fillStyle = shadowColor;
    ctx.beginPath();
    ctx.ellipse(cx, baseY, w / 2 + 3, h + 3, 0, Math.PI, 0);
    ctx.fill();

    // Corpo collina verde chiaro
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.ellipse(cx, baseY, w / 2, h, 0, Math.PI, 0);
    ctx.fill();

    // Cespugli tondi stile Mario sulla collina
    ctx.fillStyle = shadowColor;
    ctx.beginPath();
    ctx.arc(cx - w * 0.25, baseY - h * 0.6, 12, 0, Math.PI * 2);
    ctx.arc(cx + w * 0.25, baseY - h * 0.5, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Silhouette iconica e stilizzata della Basilica di Superga
   */
  private drawSuperga(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.save();
    ctx.fillStyle = '#f8fafc';
    // Porticato quadrato
    ctx.fillRect(x - 22, y + 10, 44, 18);
    // Colonne frontali
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x - 18, y + 14, 4, 14);
    ctx.fillRect(x - 6, y + 14, 4, 14);
    ctx.fillRect(x + 6, y + 14, 4, 14);
    ctx.fillRect(x + 18, y + 14, 4, 14);

    // Cupola di Juvarra
    ctx.fillStyle = '#d97706'; // Rame / dorato
    ctx.beginPath();
    ctx.arc(x, y + 10, 15, Math.PI, 0);
    ctx.fill();
    // Lanterna sommitale
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(x - 2, y - 10, 4, 6);
    ctx.restore();
  }

  /**
   * Silhouette della Mole Antonelliana in stile Mario pulito
   */
  private drawCleanMole(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.save();
    ctx.fillStyle = '#475569';
    // Corpo inferiore quadrato
    ctx.fillRect(x - 30, y - 100, 60, 100);
    // Loggiato superiore
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x - 25, y - 135, 50, 35);
    // Cupola sagomata
    ctx.beginPath();
    ctx.moveTo(x - 25, y - 135);
    ctx.lineTo(x, y - 210);
    ctx.lineTo(x + 25, y - 135);
    ctx.closePath();
    ctx.fill();
    // Tempietto e guglia
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 10, y - 235, 20, 25);
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 235);
    ctx.lineTo(x, y - 290);
    ctx.lineTo(x + 4, y - 235);
    ctx.closePath();
    ctx.fill();
    // Stella d'oro in cima
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(x, y - 293, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Alberi arrotondati stile Super Mario (Livello Valentino)
   */
  private renderMarioTrees(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 320;
    const offset = (this.cameraX * speed) % spacing;

    ctx.save();
    for (let x = -offset - spacing; x < this.width + spacing; x += spacing) {
      const treeY = this.height - 140;

      // Tronco dritto marrone
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + 20, treeY - 50, 12, 50);

      // Chioma ad ovali verdi sovrapposti
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(x + 26, treeY - 80, 28, 42, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dettaglio luce chioma
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(x + 20, treeY - 95, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Onde del fiume Po stile platformer
   */
  private renderRiverPo(ctx: CanvasRenderingContext2D, speed: number): void {
    const offset = (this.cameraX * speed + Date.now() * 0.04) % 60;
    ctx.save();
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, this.height - 45, this.width, 45);

    ctx.fillStyle = '#38bdf8';
    for (let x = -offset; x < this.width + 60; x += 50) {
      ctx.beginPath();
      ctx.arc(x, this.height - 45, 8, 0, Math.PI);
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Struttura monumentale verticale per il livello della Mole
   */
  private renderMoleStructureBackdrop(ctx: CanvasRenderingContext2D, speed: number): void {
    const cx = this.width / 2 - (this.cameraX * speed);
    ctx.save();
    ctx.fillStyle = '#78350f'; // Mattoni sabaudi
    ctx.fillRect(cx - 180, 0, 360, this.height);

    // Finestre alte a ogiva illuminate dall'interno
    ctx.fillStyle = '#fef08a';
    for (let y = 60; y < this.height - 60; y += 120) {
      ctx.fillRect(cx - 130, y, 40, 70);
      ctx.fillRect(cx + 90, y, 40, 70);
    }

    // Tiranti in ferro e travi ottocentesche
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 180, 100);
    ctx.lineTo(cx + 180, 350);
    ctx.moveTo(cx + 180, 100);
    ctx.lineTo(cx - 180, 350);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Stelle scintillanti
   */
  private renderStars(ctx: CanvasRenderingContext2D, speed: number): void {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 137 + 50) - this.cameraX * speed) % this.width;
      const sy = (i * 83) % (this.height * 0.6);
      const px = sx < 0 ? sx + this.width : sx;
      const size = (i % 3 === 0) ? 2.5 : 1.5;
      ctx.fillRect(px, sy, size, size);
    }
    ctx.restore();
  }

  /**
   * "Luci d'Artista" torinesi (costellazioni e forme geometriche al neon sospese)
   */
  private renderLuciArtista(ctx: CanvasRenderingContext2D, speed: number): void {
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 12;

    const offset = (this.cameraX * speed) % 800;
    for (let x = -offset + 100; x < this.width + 800; x += 400) {
      // Stella geometrica al neon
      ctx.beginPath();
      ctx.moveTo(x, 110);
      ctx.lineTo(x + 20, 140);
      ctx.lineTo(x + 50, 140);
      ctx.lineTo(x + 25, 160);
      ctx.lineTo(x + 35, 190);
      ctx.lineTo(x, 170);
      ctx.lineTo(x - 35, 190);
      ctx.lineTo(x - 25, 160);
      ctx.lineTo(x - 50, 140);
      ctx.lineTo(x - 20, 140);
      ctx.closePath();
      ctx.stroke();

      // Cavo di sospensione sottile
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 110);
      ctx.stroke();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
    }
    ctx.restore();
  }

  /**
   * Skyline notturno con luci
   */
  private renderNightSkyline(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 180;
    const offset = (this.cameraX * speed) % (spacing * 6);
    ctx.save();
    ctx.fillStyle = '#0f172a';

    for (let x = -offset; x < this.width + spacing * 2; x += spacing) {
      const h = 180 + ((x * 17) % 100);
      ctx.fillRect(x, this.height - h, spacing - 10, h);

      // Finestrelle accese al neon
      ctx.fillStyle = '#fde047';
      for (let fy = this.height - h + 20; fy < this.height - 30; fy += 28) {
        ctx.fillRect(x + 15, fy, 10, 14);
        ctx.fillRect(x + 45, fy, 10, 14);
      }
      ctx.fillStyle = '#0f172a';
    }
    ctx.restore();
  }
}
