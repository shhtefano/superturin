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
    { x: 4500, y: 105, scale: 1.1 },
    { x: 5100, y: 70, scale: 1.2 },
    { x: 5700, y: 125, scale: 0.9 },
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
    switch (this.theme) {
      case 'mole':
        this.renderMoleTheme(ctx);
        break;
      case 'valentino':
        this.renderValentinoTheme(ctx);
        break;
      case 'murazzi':
      case 'notte':
        this.renderMurazziTheme(ctx);
        break;
      case 'superga':
        this.renderSupergaTheme(ctx);
        break;
      case 'lingotto':
        this.renderLingottoTheme(ctx);
        break;
      case 'centro':
      default:
        this.renderCentroTheme(ctx);
        break;
    }
  }

  // =========================================================================
  // LIVELLO 1: CENTRO DI TORINO
  // Dettagli: Palazzo Madama Juvarra, Portici di Via Po, Tram 7 Storico GTT,
  //           Toret verde torinese e Monumento Caval 'd Brôns
  // =========================================================================
  private renderCentroTheme(ctx: CanvasRenderingContext2D): void {
    // 1. Cielo azzurro torinese limpido
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, '#38bdf8');
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

    // 3. Nuvole Mario
    this.renderMarioClouds(ctx, 0.08, 'rgba(255, 255, 255, 0.95)');

    // 4. Catena Alpina con picchi innevati (parallasse 0.12)
    this.renderCleanMountains(ctx, 0.12, '#93c5fd', '#dbeafe');

    // 5. Colline di Torino con Superga in lontananza (parallasse 0.2)
    this.renderRollingHills(ctx, 0.2, '#22c55e', '#16a34a', true);

    // 6. Palazzo Madama monumentale (facciata juvarriana con stemma sabaudo e statue)
    this.drawPalazzoMadama(ctx, 0.26);

    // 7. Monumento equestre "Caval 'd Brôns" di Piazza San Carlo
    this.drawCavalDBrons(ctx, 0.3);

    // 8. Portici storici di Via Po con lanterne dorate e volte in pietra
    this.drawPorticiViaPo(ctx, 0.38);

    // 9. Tram 7 Storico GTT (verde bicolore anni '30) e fontana Toret
    this.drawTram7GTT(ctx, 0.44);
    this.drawToretTorinese(ctx, 0.48);
  }

  // =========================================================================
  // LIVELLO 2: LA MOLE ANTONELLIANA
  // Dettagli: Cupola in mattoni sabaudi, "Il Volo dei Numeri" di Mario Merz
  //           (neon rossi Fibonacci 1 1 2 3 5 8 13 21 34 55),
  //           Ascensore panoramico di cristallo sospeso su cavi, Guglia e Stella
  // =========================================================================
  private renderMoleTheme(ctx: CanvasRenderingContext2D): void {
    // 1. Cielo crepuscolo viola/arancio intenso
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, '#1e1b4b');
    sky.addColorStop(0.35, '#4c1d95');
    sky.addColorStop(0.65, '#9a3412');
    sky.addColorStop(0.88, '#ea580c');
    sky.addColorStop(1, '#fde047');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Stelle della sera e luna
    this.renderStars(ctx, 0.02);

    // 3. Tetti storici di Torino in controluce (parallasse 0.08)
    this.drawTorinoRooftops(ctx, 0.08);

    // 4. La Mole Antonelliana in primo piano con i mattoni rossi
    const moleCx = this.width / 2 - ((this.cameraX * 0.16) % (this.width + 600));
    const cx = moleCx < -300 ? moleCx + this.width + 700 : moleCx;

    this.drawMoleMonument(ctx, cx);
    // Neon rossi Fibonacci "Il Volo dei Numeri" (Mario Merz) sulla cupola
    this.drawFibonacciNumbers(ctx, cx);
    // Ascensore panoramico di cristallo che sale e scende con cavi d'acciaio
    this.drawCrystalElevator(ctx, cx);
  }

  // =========================================================================
  // LIVELLO 3: PARCO DEL VALENTINO & FIUME PO
  // Dettagli: Borgo Medievale & Rocca con merli e stendardi,
  //           "Panchina dei Lampioni Innamorati" di Marasciuolo,
  //           Canottieri del Po (Cerea 1863), Fontana dei 12 Mesi, Platani
  // =========================================================================
  private renderValentinoTheme(ctx: CanvasRenderingContext2D): void {
    // 1. Cielo limpido e fresco del Po
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, '#0284c7');
    sky.addColorStop(0.65, '#38bdf8');
    sky.addColorStop(1, '#a7f3d0');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    this.renderMarioClouds(ctx, 0.08, 'rgba(255, 255, 255, 0.92)');

    // 2. Collina del Po e sagoma di Villa della Regina (parallasse 0.14)
    this.renderRollingHills(ctx, 0.14, '#15803d', '#166534', false);

    // 3. Borgo Medievale & Rocca del Valentino con torri, merli e stendardi sabaudi
    this.drawBorgoMedievale(ctx, 0.22);

    // 4. Fontana dei Dodici Mesi con balaustra classica
    this.drawFontanaDodiciMesi(ctx, 0.3);

    // 5. Alberi platani storici e foliage del parco
    this.renderMarioTrees(ctx, 0.36);

    // 6. Fiume Po con onde azzurre e i leggendari Canottieri in barca (Cerea 1863)
    this.renderRiverPoWithRowers(ctx, 0.42);

    // 7. La celebre "Panchina dei Lampioni Innamorati" (due lampioni abbracciati)
    this.drawLampioniInnamorati(ctx, 0.46);
  }

  // =========================================================================
  // LIVELLO 4: MURAZZI DEL PO DI NOTTE
  // Dettagli: Arcate dei Murazzi in pietra con insegne neon dei club
  //           ("GIANCARLO", "MAGAZZINI SUL PO", "MURAZZI"),
  //           Chiesa della Gran Madre illuminata riflessa nel Po,
  //           Ponte Vittorio Emanuele I, Luci d'Artista scintillanti
  // =========================================================================
  private renderMurazziTheme(ctx: CanvasRenderingContext2D): void {
    // 1. Cielo notturno torinese profondo
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, '#020617');
    sky.addColorStop(0.55, '#0f172a');
    sky.addColorStop(0.9, '#1e1b4b');
    sky.addColorStop(1, '#090d16');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Stelle e Luna
    this.renderStars(ctx, 0.02);

    // 3. Installazioni "Luci d'Artista" sospese con cavi in cielo
    this.drawLuciArtistaMurazzi(ctx, 0.08);

    // 4. La maestosa Chiesa della Gran Madre di Dio illuminata oltre il Po
    this.drawGranMadreDiDio(ctx, 0.16);

    // 5. Ponte Vittorio Emanuele I a cinque arcate in pietra con lampioni dorati
    this.drawPonteVittorio(ctx, 0.28);

    // 6. Fiume Po notturno con riflessi al neon colorati (fucsia, ciano, oro)
    this.drawMurazziWaterReflections(ctx, 0.38);

    // 7. Arcate dei Murazzi con insegne dei club storici ("GIANCARLO", "MAGAZZINI")
    this.drawMurazziVaults(ctx, 0.48);
  }

  // =========================================================================
  // LIVELLO 5: SUPERGA E LA TRANVIA A DENTIERA
  // Dettagli: Basilica di Superga di Filippo Juvarra (cupola e campanili gemelli),
  //           Tranvia storica a cremagliera Sassi-Superga rossa e crema del 1934,
  //           Panorama alpino con la piramide del Monviso ("Il Re di Pietra"),
  //           Lapide e stendardo del Grande Torino (Invincibili 1949)
  // =========================================================================
  private renderSupergaTheme(ctx: CanvasRenderingContext2D): void {
    // 1. Cielo limpido d'alta quota con luce dorata mattutina/pomeridiana
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, '#1e3a8a');
    sky.addColorStop(0.4, '#3b82f6');
    sky.addColorStop(0.75, '#93c5fd');
    sky.addColorStop(1, '#fed7aa');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Sole delle Alpi
    ctx.save();
    ctx.fillStyle = '#ffedd5';
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(this.width * 0.2, 110, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    this.renderMarioClouds(ctx, 0.06, 'rgba(255, 255, 255, 0.95)');

    // 3. Catena delle Alpi Occidentali con il leggendario MONVISO (piramide aguzza)
    this.drawAlpsWithMonviso(ctx, 0.12);

    // 4. Colle di Superga con la Basilica monumentale di Juvarra
    this.drawSupergaMonumental(ctx, 0.22);

    // 5. Lapide commemorativa del Grande Torino con stendardo granata
    this.drawGrandeTorinoMemorial(ctx, 0.3);

    // 6. Rotaia a cremagliera e vettura storica della Tranvia Dentiera Sassi-Superga
    this.drawDentieraTramTrain(ctx, 0.42);
  }

  // =========================================================================
  // LIVELLO 6: LINGOTTO E LA PISTA SUL TETTO
  // Dettagli: La Curva Parabolica della Pista 500 con cordoli bianchi e rossi,
  //           La Bolla di vetro di Renzo Piano con eliporto,
  //           Lo Scrigno della Pinacoteca Giovanni e Marella Agnelli,
  //           Fiat 500 d'epoca in collaudo sulla pista, facciata industriale FIAT
  // =========================================================================
  private renderLingottoTheme(ctx: CanvasRenderingContext2D): void {
    // 1. Cielo industriale al tramonto (viola, magenta, oro)
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, '#1e1b4b');
    sky.addColorStop(0.35, '#3730a3');
    sky.addColorStop(0.7, '#c026d3');
    sky.addColorStop(1, '#f59e0b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Profilo montuoso innevato in lontananza
    this.renderCleanMountains(ctx, 0.1, '#64748b', '#cbd5e1');

    // 3. Facciata industriale iconica del Lingotto (griglia razionalista a finestre)
    this.drawLingottoIndustrialFacade(ctx, 0.2);

    // 4. "Lo Scrigno" della Pinacoteca Agnelli sospeso sopra il tetto
    this.drawAgnelliScrigno(ctx, 0.28);

    // 5. "La Bolla" di cristallo di Renzo Piano con la piazzola dell'Eliporto ("H")
    this.drawRenzoPianoBolla(ctx, 0.35);

    // 6. La Curva Parabolica inclinata della Pista 500 con cordoli e Fiat 500
    this.drawCurvaParabolicaFiat(ctx, 0.46);
  }

  // =========================================================================
  // DETTAGLI SPECIFICI TORINESI (PROCEDURAL CANVAS PIXEL-ART)
  // =========================================================================

  /**
   * Palazzo Madama (Piazza Castello): facciata barocca juvarriana,
   * balaustra sommitale con statue, grandi finestre arcuate e stemma sabaudo.
   */
  private drawPalazzoMadama(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 1600;
    const offset = (this.cameraX * speed) % spacing;
    const baseX = 380 - offset;
    const baseY = this.height - 150;

    ctx.save();
    // Corpo monumentale in pietra chiara dorata
    ctx.fillStyle = '#fdf4dc';
    ctx.fillRect(baseX, baseY - 160, 320, 160);

    // Cornicione marcapiano
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(baseX - 10, baseY - 165, 340, 8);
    ctx.fillRect(baseX - 6, baseY - 85, 332, 6);

    // Pilastri / Lesene composite di Juvarra
    ctx.fillStyle = '#e2e8f0';
    for (let c = 0; c < 7; c++) {
      ctx.fillRect(baseX + 15 + c * 44, baseY - 160, 12, 160);
    }

    // Grandi finestre monumentali ad arco
    ctx.fillStyle = '#0f172a';
    for (let w = 0; w < 6; w++) {
      const wx = baseX + 32 + w * 44;
      // Finestre piano nobile
      ctx.beginPath();
      ctx.arc(wx + 8, baseY - 130, 8, Math.PI, 0);
      ctx.fillRect(wx, baseY - 130, 16, 26);
      ctx.fill();
      // Riflesso vetro azzurrino
      ctx.fillStyle = '#93c5fd';
      ctx.fillRect(wx + 2, baseY - 128, 5, 22);
      ctx.fillStyle = '#0f172a';
    }

    // Balaustra sommitale con statue in marmo
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(baseX, baseY - 180, 320, 15);
    for (let s = 0; s < 8; s++) {
      const sx = baseX + 18 + s * 40;
      // Statua allegorica
      ctx.fillRect(sx, baseY - 198, 8, 18);
      ctx.beginPath();
      ctx.arc(sx + 4, baseY - 202, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Frontone centrale con Stemma Sabaudo (scudo rosso con croce d'argento)
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(baseX + 110, baseY - 180);
    ctx.lineTo(baseX + 160, baseY - 215);
    ctx.lineTo(baseX + 210, baseY - 180);
    ctx.closePath();
    ctx.fill();

    // Scudo sabaudo
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(baseX + 148, baseY - 198, 24, 20);
    // Croce sabauda bianca
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(baseX + 158, baseY - 198, 4, 20);
    ctx.fillRect(baseX + 148, baseY - 190, 24, 4);

    // Targa "PALAZZO MADAMA"
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PALAZZO MADAMA', baseX + 160, baseY - 95);

    ctx.restore();
  }

  /**
   * Portici di Via Po: arcate continue in pietra, volte illuminate,
   * lanterne in ferro battuto e insegne delle botteghe storiche torinesi.
   */
  private drawPorticiViaPo(ctx: CanvasRenderingContext2D, speed: number): void {
    const archWidth = 140;
    const offset = (this.cameraX * speed) % archWidth;
    const baseY = this.height - 80;

    ctx.save();
    for (let x = -offset - archWidth; x < this.width + archWidth * 2; x += archWidth) {
      // Parete portico in pietra grigia sabauda
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x, baseY - 120, archWidth, 120);

      // Arcata a tutto sesto scavata nel portico
      ctx.fillStyle = '#334155'; // Ombra interna della volta
      ctx.beginPath();
      ctx.arc(x + archWidth / 2, baseY - 70, 48, Math.PI, 0);
      ctx.fillRect(x + archWidth / 2 - 48, baseY - 70, 96, 70);
      ctx.fill();

      // Bordo in marmo bianco dell'arco
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x + archWidth / 2, baseY - 70, 48, Math.PI, 0);
      ctx.stroke();

      // Lanterna a sospensione dorata al centro dell'arco
      const lx = x + archWidth / 2;
      const ly = baseY - 65;
      // Catena
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lx, baseY - 110);
      ctx.lineTo(lx, ly);
      ctx.stroke();
      // Corpo lanterna in ottone
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(lx - 5, ly, 10, 14);
      // Luce calda splendente
      ctx.save();
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(lx, ly + 7, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Pilastri tra gli archi
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x, baseY - 120, 22, 120);
      ctx.fillRect(x + archWidth - 22, baseY - 120, 22, 120);
    }

    // Insegne storiche "PORTICI DI VIA PO"
    const signX = (1100 - (this.cameraX * speed)) % (this.width + 1200);
    if (signX > -200 && signX < this.width + 200) {
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(signX, baseY - 138, 180, 22);
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 2;
      ctx.strokeRect(signX, baseY - 138, 180, 22);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 8px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PORTICI DI VIA PO', signX + 90, baseY - 123);
    }

    ctx.restore();
  }

  /**
   * Tram Storico GTT Linea 7: bicolore verde sabaudo / crema anni '30,
   * fari rotondi d'epoca, trolley/pantografo e binari.
   */
  private drawTram7GTT(ctx: CanvasRenderingContext2D, speed: number): void {
    const loopDist = 2400;
    // Il tram si sposta lentamente anche per conto suo lungo i binari!
    const tramSelfMove = (Date.now() * 0.02) % loopDist;
    const tx = (1400 - (this.cameraX * speed) - tramSelfMove) % loopDist;
    const renderX = tx < -260 ? tx + loopDist : tx;
    const ty = this.height - 105;

    if (renderX < -300 || renderX > this.width + 300) return;

    ctx.save();
    // Cavi elettrici aerei della catenaria GTT
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, ty - 60);
    ctx.lineTo(this.width, ty - 60);
    ctx.stroke();

    // Pantografo metallico sul tetto
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(renderX + 80, ty - 2);
    ctx.lineTo(renderX + 95, ty - 50);
    ctx.lineTo(renderX + 115, ty - 60);
    ctx.lineTo(renderX + 80, ty - 60);
    ctx.stroke();

    // Corpo tram: Livrea storica bicolore
    // Parte inferiore verde scuro ministeriale
    ctx.fillStyle = '#166534';
    ctx.fillRect(renderX, ty + 18, 180, 24);
    // Parte superiore giallo crema d'epoca
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(renderX, ty - 2, 180, 20);
    // Tetto sagomato crema
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(renderX + 6, ty - 6, 168, 5);

    // Finestrini del tram con montanti
    ctx.fillStyle = '#0f172a';
    for (let w = 0; w < 6; w++) {
      ctx.fillRect(renderX + 14 + w * 26, ty + 2, 20, 14);
      // Riflesso
      ctx.fillStyle = '#93c5fd';
      ctx.fillRect(renderX + 16 + w * 26, ty + 4, 6, 10);
      ctx.fillStyle = '#0f172a';
    }

    // Display linea: "7 STORICO"
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(renderX + 130, ty - 12, 44, 10);
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 7px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('7 GTT', renderX + 152, ty - 4);

    // Faro anteriore tondo con fascio di luce
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(renderX + 6, ty + 28, 5, 0, Math.PI * 2);
    ctx.fill();

    // Fascio di luce del tram sulla strada
    const lightBeam = ctx.createLinearGradient(renderX + 6, ty + 28, renderX - 80, ty + 40);
    lightBeam.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
    lightBeam.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = lightBeam;
    ctx.beginPath();
    ctx.moveTo(renderX + 6, ty + 28);
    ctx.lineTo(renderX - 80, ty + 15);
    ctx.lineTo(renderX - 80, ty + 45);
    ctx.closePath();
    ctx.fill();

    // Carrelli ruote in ghisa
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(renderX + 22, ty + 40, 36, 8);
    ctx.fillRect(renderX + 122, ty + 40, 36, 8);

    ctx.restore();
  }

  /**
   * Fontana "Toret" (simbolo civico torinese): corpo verde bottiglia in ghisa,
   * testa di toro in ottone con zampillo d'acqua fresca alpina.
   */
  private drawToretTorinese(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 950;
    const offset = (this.cameraX * speed) % spacing;
    const tx = 620 - offset;
    const ty = this.height - 85;

    ctx.save();
    // Base a ciottoli della fontana
    ctx.fillStyle = '#475569';
    ctx.fillRect(tx - 12, ty + 20, 36, 6);

    // Corpo del Toret in ghisa verde scuro ("Verde Toret")
    ctx.fillStyle = '#1b4332';
    ctx.fillRect(tx, ty - 26, 16, 46);
    // Cappello piramidale verde
    ctx.beginPath();
    ctx.moveTo(tx - 2, ty - 26);
    ctx.lineTo(tx + 8, ty - 38);
    ctx.lineTo(tx + 18, ty - 26);
    ctx.closePath();
    ctx.fill();

    // Testa di toro in ottone dorato (beccuccio)
    ctx.fillStyle = '#d97706';
    ctx.fillRect(tx - 5, ty - 12, 7, 7);
    // Cornine del toro
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(tx - 6, ty - 14, 2, 3);
    ctx.fillRect(tx - 3, ty - 14, 2, 3);

    // Zampillo d'acqua limpida che cade
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx - 5, ty - 8);
    ctx.quadraticCurveTo(tx - 10, ty - 4, tx - 10, ty + 20);
    ctx.stroke();

    // Vaschetta di scolo
    ctx.fillStyle = '#334155';
    ctx.fillRect(tx - 14, ty + 16, 12, 6);

    // Targhetta "TORÈT"
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(tx + 2, ty - 2, 12, 4);

    ctx.restore();
  }

  /**
   * Monumento "Caval 'd Brôns" (Emanuele Filiberto) di Piazza San Carlo
   */
  private drawCavalDBrons(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 2200;
    const offset = (this.cameraX * speed) % spacing;
    const bx = 1180 - offset;
    const by = this.height - 120;

    if (bx < -120 || bx > this.width + 120) return;

    ctx.save();
    // Basamento monumentale in marmo
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(bx, by - 35, 60, 35);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(bx + 4, by - 30, 52, 25);

    // Statua in bronzo scuro del Duca a cavallo
    ctx.fillStyle = '#334155';
    // Corpo cavallo
    ctx.fillRect(bx + 12, by - 55, 34, 16);
    // Collo e testa cavallo
    ctx.beginPath();
    ctx.moveTo(bx + 40, by - 55);
    ctx.lineTo(bx + 52, by - 70);
    ctx.lineTo(bx + 44, by - 72);
    ctx.lineTo(bx + 35, by - 55);
    ctx.closePath();
    ctx.fill();
    // Gambe cavallo
    ctx.fillRect(bx + 14, by - 40, 4, 12);
    ctx.fillRect(bx + 24, by - 40, 4, 12);
    ctx.fillRect(bx + 38, by - 40, 4, 12);

    // Cavaliere con spada sguainata
    ctx.fillRect(bx + 26, by - 72, 10, 18);
    ctx.beginPath();
    ctx.arc(bx + 31, by - 76, 5, 0, Math.PI * 2);
    ctx.fill();
    // Spada
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx + 34, by - 70);
    ctx.lineTo(bx + 50, by - 85);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * La maestosa Mole Antonelliana in prospettiva dal basso verso la cima:
   * basamento monumentale, loggiato, cupola voltata e tempietto.
   */
  private drawMoleMonument(ctx: CanvasRenderingContext2D, cx: number): void {
    ctx.save();
    const baseY = this.height;

    // 1. Basamento quadrato monumentale in mattoni sabaudi
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(cx - 180, baseY - 280, 360, 280);

    // Pilastri angolari e cordoli in granito
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(cx - 180, baseY - 280, 30, 280);
    ctx.fillRect(cx + 150, baseY - 280, 30, 280);

    // Finestre alte a ogiva illuminate dal Museo del Cinema all'interno
    ctx.fillStyle = '#fef08a';
    for (let y = baseY - 250; y < baseY - 40; y += 70) {
      ctx.fillRect(cx - 120, y, 32, 45);
      ctx.fillRect(cx - 40, y, 32, 45);
      ctx.fillRect(cx + 40, y, 32, 45);
      ctx.fillRect(cx + 100, y, 32, 45);
    }

    // 2. Primo Loggiato classico con colonne doriche
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(cx - 160, baseY - 350, 320, 70);
    ctx.fillStyle = '#fef08a';
    for (let c = 0; c < 10; c++) {
      ctx.fillRect(cx - 145 + c * 31, baseY - 345, 14, 60);
    }

    // 3. Secondo Loggiato superiore
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(cx - 130, baseY - 410, 260, 60);

    // 4. Grande Cupola a padiglione sagomata
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.moveTo(cx - 130, baseY - 410);
    ctx.quadraticCurveTo(cx - 100, baseY - 560, cx - 40, baseY - 590);
    ctx.lineTo(cx + 40, baseY - 590);
    ctx.quadraticCurveTo(cx + 100, baseY - 560, cx + 130, baseY - 410);
    ctx.closePath();
    ctx.fill();

    // Costoloni architettonici della cupola
    ctx.strokeStyle = '#431407';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 130, baseY - 410);
    ctx.quadraticCurveTo(cx - 100, baseY - 560, cx - 40, baseY - 590);
    ctx.moveTo(cx + 130, baseY - 410);
    ctx.quadraticCurveTo(cx + 100, baseY - 560, cx + 40, baseY - 590);
    ctx.moveTo(cx, baseY - 410);
    ctx.lineTo(cx, baseY - 590);
    ctx.stroke();

    // 5. Tempietto sommitale classico ("Il Tempietto")
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(cx - 35, baseY - 635, 70, 45);
    ctx.fillStyle = '#334155';
    for (let t = 0; t < 5; t++) {
      ctx.fillRect(cx - 30 + t * 14, baseY - 630, 6, 40);
    }

    // 6. Lanterna e Guglia vertiginosa (fino a 167.5 metri)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx - 18, baseY - 665, 36, 30);
    // Punta della Guglia
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(cx - 6, baseY - 665);
    ctx.lineTo(cx, baseY - 715);
    ctx.lineTo(cx + 6, baseY - 665);
    ctx.closePath();
    ctx.fill();

    // 7. Il Genio Alato / Stella dorata a 12 punte in cima alla Guglia
    ctx.save();
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(cx, baseY - 718, 6, 0, Math.PI * 2);
    ctx.fill();
    // Raggi della stella
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 10, baseY - 718);
    ctx.lineTo(cx + 10, baseY - 718);
    ctx.moveTo(cx, baseY - 728);
    ctx.lineTo(cx, baseY - 708);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /**
   * "Il Volo dei Numeri" di Mario Merz (Luci d'Artista permanente):
   * sequenza di Fibonacci in neon rosso che sale lungo la cupola della Mole:
   * 1, 1, 2, 3, 5, 8, 13, 21, 34, 55.
   */
  private drawFibonacciNumbers(ctx: CanvasRenderingContext2D, cx: number): void {
    const baseY = this.height;
    // I numeri della sequenza di Fibonacci di Mario Merz e le loro quote sulla cupola
    const fibonacciList = [
      { num: '1', x: cx - 110, y: baseY - 425 },
      { num: '1', x: cx - 95, y: baseY - 445 },
      { num: '2', x: cx - 82, y: baseY - 468 },
      { num: '3', x: cx - 70, y: baseY - 492 },
      { num: '5', x: cx - 58, y: baseY - 518 },
      { num: '8', x: cx - 45, y: baseY - 542 },
      { num: '13', x: cx - 28, y: baseY - 564 },
      { num: '21', x: cx, y: baseY - 580 },
      { num: '34', x: cx + 32, y: baseY - 558 },
      { num: '55', x: cx + 62, y: baseY - 530 },
    ];

    ctx.save();
    // Bagliore neon rosso vivo caratteristico dell'opera di Merz
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const item of fibonacciList) {
      // Effetto accensione / pulsazione neon sottile
      const flicker = 0.85 + Math.sin(Date.now() * 0.005 + parseInt(item.num)) * 0.15;
      ctx.globalAlpha = flicker;
      ctx.fillText(item.num, item.x, item.y);
    }

    ctx.restore();
  }

  /**
   * Ascensore Panoramico di Cristallo della Mole: sale e scende verticalmente
   * al centro del Museo del Cinema su tiranti d'acciaio sospesi nel vuoto.
   */
  private drawCrystalElevator(ctx: CanvasRenderingContext2D, cx: number): void {
    const baseY = this.height;
    const topLimit = baseY - 580;
    const bottomLimit = baseY - 200;

    // Animazione fluida su e giù
    const cycle = (Date.now() * 0.001) % (Math.PI * 2);
    const liftY = bottomLimit - (Math.sin(cycle) * 0.5 + 0.5) * (bottomLimit - topLimit);

    ctx.save();
    // Cavi verticali d'acciaio
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - 16, topLimit - 30);
    ctx.lineTo(cx - 16, baseY);
    ctx.moveTo(cx + 16, topLimit - 30);
    ctx.lineTo(cx + 16, baseY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cabina trasparente di cristallo con telaio in metallo
    ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.fillRect(cx - 20, liftY - 26, 40, 36);

    // Bordo cabina
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 20, liftY - 26, 40, 36);

    // Luce interna calda della cabina
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(cx, liftY - 14, 6, 0, Math.PI * 2);
    ctx.fill();

    // Sagome passeggeri felici all'interno
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - 12, liftY - 4, 8, 12);
    ctx.fillRect(cx + 4, liftY - 4, 8, 12);

    ctx.restore();
  }

  /**
   * Tetti storici di Torino e mansarde in controluce
   */
  private drawTorinoRooftops(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 120;
    const offset = (this.cameraX * speed) % (spacing * 10);
    const baseY = this.height - 40;

    ctx.save();
    ctx.fillStyle = '#1e1b4b';

    for (let x = -offset; x < this.width + spacing * 2; x += spacing) {
      const h = 50 + ((x * 13) % 40);
      // Casa con tetto spiovente a tegole
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.lineTo(x, baseY - h);
      ctx.lineTo(x + spacing / 2, baseY - h - 22);
      ctx.lineTo(x + spacing, baseY - h);
      ctx.lineTo(x + spacing, baseY);
      ctx.closePath();
      ctx.fill();

      // Comignolo
      ctx.fillRect(x + spacing * 0.7, baseY - h - 30, 8, 14);
    }

    ctx.restore();
  }

  /**
   * Borgo Medievale del Valentino (1884): Rocca feudale piemontese,
   * torri coniche, merli ghibellini a coda di rondine e stendardi sabaudi.
   */
  private drawBorgoMedievale(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 1900;
    const offset = (this.cameraX * speed) % spacing;
    const bx = 450 - offset;
    const by = this.height - 120;

    if (bx < -250 || bx > this.width + 250) return;

    ctx.save();
    // Mura difensive in pietra medievale
    ctx.fillStyle = '#475569';
    ctx.fillRect(bx, by - 90, 240, 90);

    // Merli ghibellini a coda di rondine
    for (let m = 0; m < 7; m++) {
      const mx = bx + 10 + m * 32;
      ctx.fillRect(mx, by - 105, 18, 15);
      // Scavo a V coda di rondine
      ctx.fillStyle = '#0284c7'; // Colore cielo per l'intaglio
      ctx.beginPath();
      ctx.moveTo(mx + 4, by - 105);
      ctx.lineTo(mx + 9, by - 97);
      ctx.lineTo(mx + 14, by - 105);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#475569';
    }

    // Torre angolare cilindrica alta della Rocca
    ctx.fillStyle = '#334155';
    ctx.fillRect(bx - 25, by - 160, 45, 160);
    // Tetto conico in ardesia scura
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(bx - 32, by - 160);
    ctx.lineTo(bx - 2, by - 215);
    ctx.lineTo(bx + 28, by - 160);
    ctx.closePath();
    ctx.fill();

    // Maschio centrale (Torre maestra)
    ctx.fillStyle = '#334155';
    ctx.fillRect(bx + 180, by - 180, 55, 180);
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(bx + 172, by - 180);
    ctx.lineTo(bx + 207, by - 235);
    ctx.lineTo(bx + 242, by - 180);
    ctx.closePath();
    ctx.fill();

    // Stendardo sabaudo sventolante in cima alla torre maestra
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(bx + 207, by - 235);
    ctx.lineTo(bx + 235, by - 245);
    ctx.lineTo(bx + 207, by - 255);
    ctx.closePath();
    ctx.fill();
    // Asta
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx + 207, by - 235);
    ctx.lineTo(bx + 207, by - 260);
    ctx.stroke();

    // Portone ad arco d'ingresso con ponte levatoio
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(bx + 110, by - 40, 22, Math.PI, 0);
    ctx.fillRect(bx + 88, by - 40, 44, 40);
    ctx.fill();

    // Grata levatoia (saracinesca) in ferro
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    for (let gx = bx + 92; gx <= bx + 128; gx += 7) {
      ctx.beginPath();
      ctx.moveTo(gx, by - 55);
      ctx.lineTo(gx, by);
      ctx.stroke();
    }

    // Targa "BORGO MEDIEVALE"
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 8px "Press Start 2P", monospace';
    ctx.fillText('BORGO MEDIEVALE', bx + 60, by - 115);

    ctx.restore();
  }

  /**
   * "Panchina dei Lampioni Innamorati" di Rodolfo Marasciuolo (Parco del Valentino):
   * due lampioni seduti abbracciati teneramente su una panchina verde.
   */
  private drawLampioniInnamorati(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 1500;
    const offset = (this.cameraX * speed) % spacing;
    const lx = 920 - offset;
    const ly = this.height - 90;

    if (lx < -120 || lx > this.width + 120) return;

    ctx.save();
    // Panchina verde classica dei giardini torinesi
    ctx.fillStyle = '#15803d';
    // Schienale a doghe
    ctx.fillRect(lx - 25, ly - 28, 65, 6);
    ctx.fillRect(lx - 25, ly - 20, 65, 6);
    // Seduta
    ctx.fillRect(lx - 28, ly - 12, 70, 7);
    // Gambe panchina in ghisa nera
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(lx - 22, ly - 5, 5, 15);
    ctx.fillRect(lx + 32, ly - 5, 5, 15);

    // Lampione 1 (Lui): fusto in ferro nero che piega il capo verso destra
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(lx - 6, ly - 12);
    ctx.quadraticCurveTo(lx - 4, ly - 45, lx + 2, ly - 58);
    ctx.lineTo(lx + 6, ly - 58);
    ctx.quadraticCurveTo(lx, ly - 45, lx - 2, ly - 12);
    ctx.closePath();
    ctx.fill();
    // Lanterna 1 accesa
    ctx.fillStyle = '#fde047';
    ctx.fillRect(lx - 3, ly - 70, 12, 14);
    // Cappello a punta lanterna 1
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(lx - 6, ly - 70);
    ctx.lineTo(lx + 3, ly - 78);
    ctx.lineTo(lx + 12, ly - 70);
    ctx.closePath();
    ctx.fill();

    // Lampione 2 (Lei): fusto che poggia teneramente la testa sulla spalla del compagno
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(lx + 16, ly - 12);
    ctx.quadraticCurveTo(lx + 14, ly - 40, lx + 7, ly - 52);
    ctx.lineTo(lx + 11, ly - 52);
    ctx.quadraticCurveTo(lx + 18, ly - 40, lx + 20, ly - 12);
    ctx.closePath();
    ctx.fill();
    // Lanterna 2 accesa che poggia la testa
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(lx + 4, ly - 62, 11, 12);
    // Cappello lanterna 2
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(lx + 2, ly - 62);
    ctx.lineTo(lx + 9, ly - 69);
    ctx.lineTo(lx + 17, ly - 62);
    ctx.closePath();
    ctx.fill();

    // Cuoricino rosso brillante che fluttua tra i lampioni innamorati
    ctx.fillStyle = '#ef4444';
    ctx.font = '14px sans-serif';
    ctx.fillText('❤', lx + 12, ly - 75);

    ctx.restore();
  }

  /**
   * Fiume Po con Canottieri storici in barca (Canottieri Cerea 1863)
   */
  private renderRiverPoWithRowers(ctx: CanvasRenderingContext2D, speed: number): void {
    // 1. Acqua del Po
    const offset = (this.cameraX * speed + Date.now() * 0.03) % 80;
    const baseY = this.height - 45;

    ctx.save();
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, baseY, this.width, 45);

    // Onde morbide chiare
    ctx.fillStyle = '#38bdf8';
    for (let x = -offset; x < this.width + 80; x += 60) {
      ctx.beginPath();
      ctx.arc(x, baseY, 9, 0, Math.PI);
      ctx.fill();
    }

    // 2. Barca a remi da canottaggio olimpico (Canottieri Cerea 1863)
    const rowerLoop = 1800;
    const boatMove = (Date.now() * 0.04) % rowerLoop;
    const bx = (1200 - (this.cameraX * speed) - boatMove) % rowerLoop;
    const renderBx = bx < -200 ? bx + rowerLoop : bx;

    if (renderBx > -150 && renderBx < this.width + 150) {
      const by = baseY + 12;
      // Scafo affilato in legno lucido
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(renderBx, by);
      ctx.lineTo(renderBx + 110, by);
      ctx.lineTo(renderBx + 105, by + 8);
      ctx.lineTo(renderBx + 5, by + 8);
      ctx.closePath();
      ctx.fill();

      // Scritta "CEREA 1863"
      ctx.fillStyle = '#ffffff';
      ctx.font = '6px monospace';
      ctx.fillText('CEREA 1863', renderBx + 30, by + 6);

      // Due atleti canottieri che remano in sincronia
      const rowCycle = Math.sin(Date.now() * 0.006);
      for (let r = 0; r < 2; r++) {
        const rx = renderBx + 35 + r * 35;
        // Busto atleta vestito di bianco/blu
        ctx.fillStyle = '#1e40af';
        ctx.fillRect(rx, by - 12 + rowCycle * 2, 8, 12);
        // Testa
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(rx + 4, by - 16 + rowCycle * 2, 4, 0, Math.PI * 2);
        ctx.fill();
        // Remo in legno lungo nell'acqua
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rx + 4, by - 6);
        ctx.lineTo(rx + 4 + rowCycle * 14, by + 16);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /**
   * Fontana dei Dodici Mesi (Fontana monumentale del Valentino)
   */
  private drawFontanaDodiciMesi(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 2400;
    const offset = (this.cameraX * speed) % spacing;
    const fx = 1550 - offset;
    const fy = this.height - 110;

    if (fx < -180 || fx > this.width + 180) return;

    ctx.save();
    // Emiciclo marmoreo
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(fx + 60, fy, 60, Math.PI, 0);
    ctx.fill();

    // Cascata centrale
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(fx + 45, fy - 20, 30, 35);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(fx + 50, fy - 18, 8, 33);

    // Balaustra con statue delle 12 stagioni/mesi
    ctx.fillStyle = '#cbd5e1';
    for (let s = 0; s < 6; s++) {
      ctx.fillRect(fx + 10 + s * 20, fy - 35, 6, 15);
    }

    ctx.restore();
  }

  /**
   * Arcate dei Murazzi del Po con le insegne al neon storiche:
   * "GIANCARLO", "MAGAZZINI SUL PO", "MURAZZI".
   */
  private drawMurazziVaults(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 180;
    const offset = (this.cameraX * speed) % (spacing * 10);
    const baseY = this.height - 70;

    const clubNames = [
      { name: 'GIANCARLO', color: '#ec4899', glow: '#f43f5e' },
      { name: 'MAGAZZINI SUL PO', color: '#06b6d4', glow: '#0ea5e9' },
      { name: 'THE BEACH', color: '#a855f7', glow: '#8b5cf6' },
      { name: 'MURAZZI', color: '#facc15', glow: '#eab308' },
    ];

    ctx.save();
    let index = 0;
    for (let x = -offset; x < this.width + spacing * 2; x += spacing) {
      // Arcata in grossi blocchi di pietra porfirica scura
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, baseY - 80, spacing - 10, 80);

      // Cavità interna della rimessa battelli
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(x + (spacing - 10) / 2, baseY - 35, 34, Math.PI, 0);
      ctx.fillRect(x + (spacing - 10) / 2 - 34, baseY - 35, 68, 35);
      ctx.fill();

      // Bagliore al neon dell'interno del locale (musica elettronica / indie)
      const club = clubNames[index % clubNames.length];
      index++;

      ctx.save();
      ctx.fillStyle = club.color;
      ctx.globalAlpha = 0.35 + Math.sin(Date.now() * 0.006 + x) * 0.15;
      ctx.beginPath();
      ctx.ellipse(x + (spacing - 10) / 2, baseY - 15, 26, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Insegna Neon sopra l'arcata
      ctx.save();
      ctx.shadowColor = club.glow;
      ctx.shadowBlur = 10;
      ctx.fillStyle = club.color;
      ctx.font = 'bold 7px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(club.name, x + (spacing - 10) / 2, baseY - 62);
      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Chiesa della Gran Madre di Dio illuminata di notte oltre il Po
   */
  private drawGranMadreDiDio(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 2200;
    const offset = (this.cameraX * speed) % spacing;
    const gx = 650 - offset;
    const gy = this.height - 180;

    if (gx < -200 || gx > this.width + 200) return;

    ctx.save();
    // Scalinata monumentale in marmo
    ctx.fillStyle = '#334155';
    ctx.fillRect(gx - 80, gy + 30, 160, 20);
    ctx.fillStyle = '#475569';
    ctx.fillRect(gx - 70, gy + 15, 140, 15);

    // Pronao classico tipo Pantheon con colonne illuminate
    ctx.fillStyle = '#f8fafc';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 15;
    for (let c = 0; c < 6; c++) {
      ctx.fillRect(gx - 55 + c * 22, gy - 40, 8, 55);
    }

    // Timpano triangolare monumentale
    ctx.beginPath();
    ctx.moveTo(gx - 65, gy - 40);
    ctx.lineTo(gx, gy - 75);
    ctx.lineTo(gx + 65, gy - 40);
    ctx.closePath();
    ctx.fill();

    // Cupola emisferica illuminata nella notte
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(gx, gy - 40, 50, Math.PI, 0);
    ctx.fill();

    // Lanterna e croce sommitale
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(gx - 4, gy - 98, 8, 12);
    ctx.fillRect(gx - 8, gy - 94, 16, 3);

    ctx.restore();
  }

  /**
   * Ponte Vittorio Emanuele I a 5 arcate in pietra che collega i Murazzi
   */
  private drawPonteVittorio(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 1800;
    const offset = (this.cameraX * speed) % spacing;
    const px = 200 - offset;
    const py = this.height - 85;

    if (px < -350 || px > this.width + 350) return;

    ctx.save();
    // Struttura del ponte a 5 archi
    ctx.fillStyle = '#475569';
    ctx.fillRect(px, py - 30, 320, 25);

    // Arcate
    for (let a = 0; a < 5; a++) {
      const ax = px + 25 + a * 58;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(ax, py - 5, 20, Math.PI, 0);
      ctx.fill();
    }

    // Lampioni dorati lungo il ponte con riflessi
    ctx.fillStyle = '#ffd166';
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 8;
    for (let l = 0; l < 6; l++) {
      const lx = px + 10 + l * 58;
      ctx.fillRect(lx, py - 40, 3, 10);
      ctx.beginPath();
      ctx.arc(lx + 1.5, py - 42, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Acqua dei Murazzi con riflessi fluorescenti dei locali e dei ponti
   */
  private drawMurazziWaterReflections(ctx: CanvasRenderingContext2D, speed: number): void {
    const baseY = this.height - 40;
    ctx.save();
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, baseY, this.width, 40);

    // Strisce di riflesso al neon colorate mosse dalla corrente del Po
    const neonColors = ['#ec4899', '#06b6d4', '#ffd166', '#a855f7'];
    for (let i = 0; i < 16; i++) {
      const rx = ((i * 90) - this.cameraX * speed) % this.width;
      const x = rx < 0 ? rx + this.width : rx;
      const col = neonColors[i % neonColors.length];

      ctx.strokeStyle = col;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, baseY + 6 + (i % 4) * 7);
      ctx.lineTo(x + 40, baseY + 6 + (i % 4) * 7);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * "Luci d'Artista" notturne torinesi (costellazioni, forme geometriche)
   */
  private drawLuciArtistaMurazzi(ctx: CanvasRenderingContext2D, speed: number): void {
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;

    const offset = (this.cameraX * speed) % 700;
    for (let x = -offset + 80; x < this.width + 700; x += 350) {
      // Stella geometrica di Daniel Buren / Mario Airò
      ctx.beginPath();
      ctx.moveTo(x, 100);
      ctx.lineTo(x + 18, 125);
      ctx.lineTo(x + 45, 125);
      ctx.lineTo(x + 22, 142);
      ctx.lineTo(x + 30, 168);
      ctx.lineTo(x, 150);
      ctx.lineTo(x - 30, 168);
      ctx.lineTo(x - 22, 142);
      ctx.lineTo(x - 45, 125);
      ctx.lineTo(x - 18, 125);
      ctx.closePath();
      ctx.stroke();

      // Cavo aereo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 100);
      ctx.stroke();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
    }
    ctx.restore();
  }

  /**
   * Catena alpina occidentale dominata dall'iconica piramide del MONVISO ("Il Re di Pietra")
   */
  private drawAlpsWithMonviso(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 1400;
    const offset = (this.cameraX * speed) % spacing;
    const mx = 640 - offset;
    const my = this.height - 180;

    ctx.save();

    // 1. Catena alpina di fondo
    this.renderCleanMountains(ctx, speed, '#93c5fd', '#f8fafc');

    // 2. Il maestoso MONVISO (3841m): piramide appuntita inconfondibile che svetta
    if (mx > -200 && mx < this.width + 200) {
      // Corpo roccioso del Monviso
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.moveTo(mx - 150, my);
      ctx.lineTo(mx, my - 240); // Cima aguzza
      ctx.lineTo(mx + 150, my);
      ctx.closePath();
      ctx.fill();

      // Parete nord innevata
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(mx, my - 240);
      ctx.lineTo(mx - 70, my - 130);
      ctx.lineTo(mx - 20, my - 150);
      ctx.lineTo(mx, my - 120);
      ctx.lineTo(mx + 30, my - 140);
      ctx.lineTo(mx + 80, my - 130);
      ctx.closePath();
      ctx.fill();

      // Targa "MONVISO 3841m"
      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 8px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MONVISO (3841m)', mx, my - 250);
    }

    ctx.restore();
  }

  /**
   * Basilica di Superga monumentale (Filippo Juvarra): maestosa cupola
   * dorata, pronao con colonne corinzie e i due campanili gemelli barocchi.
   */
  private drawSupergaMonumental(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 1800;
    const offset = (this.cameraX * speed) % spacing;
    const sx = 950 - offset;
    const sy = this.height - 210;

    if (sx < -250 || sx > this.width + 250) return;

    ctx.save();
    // 1. Collina alberata verde su cui poggia la Basilica
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(sx, sy + 130, 260, 120, 0, Math.PI, 0);
    ctx.fill();

    // 2. Basamento e corpo centrale in marmo chiaro
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(sx - 110, sy - 50, 220, 75);

    // 3. Pronao circolare sporgente con colonne juvarriane
    ctx.fillStyle = '#e2e8f0';
    for (let c = 0; c < 6; c++) {
      ctx.fillRect(sx - 50 + c * 20, sy - 45, 8, 70);
    }
    // Timpano classico del pronao
    ctx.beginPath();
    ctx.moveTo(sx - 60, sy - 45);
    ctx.lineTo(sx, sy - 75);
    ctx.lineTo(sx + 60, sy - 45);
    ctx.closePath();
    ctx.fill();

    // 4. Tamburo e Cupola centrale monumentale di Juvarra
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(sx - 48, sy - 110, 96, 40);
    // Cupola dorata / rame sabaudo
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(sx, sy - 110, 48, Math.PI, 0);
    ctx.fill();
    // Lanterna sommitale
    ctx.fillStyle = '#fde047';
    ctx.fillRect(sx - 8, sy - 175, 16, 20);
    ctx.beginPath();
    ctx.arc(sx, sy - 180, 5, 0, Math.PI * 2);
    ctx.fill();

    // 5. I due Campanili gemelli barocchi laterali
    for (const side of [-85, 85]) {
      const cx = sx + side;
      // Corpo campanile
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(cx - 16, sy - 115, 32, 115);
      // Cella campanaria con campane
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - 8, sy - 105, 16, 24);
      // Campana in bronzo
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(cx, sy - 95, 5, 0, Math.PI);
      ctx.fill();
      // Guglia sagomata barocca
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(cx - 16, sy - 115);
      ctx.lineTo(cx, sy - 150);
      ctx.lineTo(cx + 16, sy - 115);
      ctx.closePath();
      ctx.fill();
    }

    // Targa "BASILICA DI SUPERGA"
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BASILICA DI SUPERGA', sx, sy + 45);

    ctx.restore();
  }

  /**
   * Lapide e stendardo commemorativo del Grande Torino (Invincibili 1949)
   */
  private drawGrandeTorinoMemorial(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 1800;
    const offset = (this.cameraX * speed) % spacing;
    const mx = 1200 - offset;
    const my = this.height - 110;

    if (mx < -150 || mx > this.width + 150) return;

    ctx.save();
    // Stele / Lapide in marmo scuro
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(mx - 30, my - 45, 60, 45);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2;
    ctx.strokeRect(mx - 30, my - 45, 60, 45);

    // Bandiera Granata del Torino F.C.
    ctx.fillStyle = '#7a131b'; // Colore Granata iconico
    ctx.fillRect(mx + 34, my - 60, 30, 20);
    // Toro rampante dorato stilizzato sulla bandiera
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(mx + 44, my - 53, 10, 8);
    // Asta bandiera
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mx + 34, my - 60);
    ctx.lineTo(mx + 34, my);
    ctx.stroke();

    // Scritta sulla lapide
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GRANDE', mx, my - 30);
    ctx.fillText('TORINO', mx, my - 20);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('1949', mx, my - 10);

    ctx.restore();
  }

  /**
   * Tranvia a Dentiera Sassi-Superga: la vettura storica del 1934
   * in salita con livrea rosso pompeiano e crema, carrello a cremagliera e binario dentato.
   */
  private drawDentieraTramTrain(ctx: CanvasRenderingContext2D, speed: number): void {
    const loop = 2200;
    const selfMove = (Date.now() * 0.025) % loop;
    const dx = (1500 - (this.cameraX * speed) - selfMove) % loop;
    const renderDx = dx < -260 ? dx + loop : dx;
    const dy = this.height - 120;

    if (renderDx < -300 || renderDx > this.width + 300) return;

    ctx.save();
    // Binario inclinato della dentiera
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(renderDx - 80, dy + 35);
    ctx.lineTo(renderDx + 240, dy - 20);
    ctx.stroke();

    // Rotaia centrale a dentiera Strub
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(renderDx - 80, dy + 32);
    ctx.lineTo(renderDx + 240, dy - 23);
    ctx.stroke();
    ctx.setLineDash([]);

    // Vettura storica della Dentiera (inclinata verso l'alto a destra)
    ctx.save();
    ctx.translate(renderDx + 60, dy);
    ctx.rotate(-0.16); // Inclinazione della salita di Superga

    // Corpo inferiore rosso granata / pompeiano
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-60, 0, 140, 22);

    // Fascia superiore avorio / crema
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-60, -20, 140, 20);

    // Tetto sagomato grigio
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-55, -25, 130, 6);

    // Finestre con montanti in legno
    ctx.fillStyle = '#0f172a';
    for (let w = 0; w < 5; w++) {
      ctx.fillRect(-50 + w * 24, -16, 18, 14);
      ctx.fillStyle = '#93c5fd';
      ctx.fillRect(-48 + w * 24, -14, 6, 10);
      ctx.fillStyle = '#0f172a';
    }

    // Scritta "SASSI - SUPERGA"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SASSI - SUPERGA', 10, 14);

    // Faro rotondo d'epoca
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(78, 8, 5, 0, Math.PI * 2);
    ctx.fill();

    // Ruote dentate a cremagliera
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-40, 22, 24, 8);
    ctx.fillRect(40, 22, 24, 8);

    ctx.restore();
    ctx.restore();
  }

  /**
   * Facciata industriale del Lingotto: la leggendaria griglia in cemento armato
   * e mattoni con migliaia di finestre disegnata da Giacomo Mattè-Trucco.
   */
  private drawLingottoIndustrialFacade(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 180;
    const offset = (this.cameraX * speed) % (spacing * 6);
    const baseY = this.height - 60;

    ctx.save();
    for (let x = -offset; x < this.width + spacing * 2; x += spacing) {
      // Corpo della fabbrica
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x, baseY - 120, spacing - 8, 120);

      // Pilastri e travi in calcestruzzo
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x, baseY - 120, 14, 120);
      ctx.fillRect(x + spacing - 22, baseY - 120, 14, 120);
      ctx.fillRect(x, baseY - 122, spacing - 8, 6);
      ctx.fillRect(x, baseY - 62, spacing - 8, 6);

      // Finestre industriali a quadretti illuminate
      ctx.fillStyle = '#0f172a';
      for (let f = 0; f < 3; f++) {
        const fx = x + 24 + f * 42;
        ctx.fillRect(fx, baseY - 110, 32, 40);
        ctx.fillRect(fx, baseY - 50, 32, 40);

        // Luce di collaudo industriale
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(fx + 4, baseY - 106, 10, 14);
        ctx.fillRect(fx + 18, baseY - 46, 10, 14);
        ctx.fillStyle = '#0f172a';
      }
    }

    ctx.restore();
  }

  /**
   * "Lo Scrigno" della Pinacoteca Giovanni e Marella Agnelli:
   * il padiglione metallico sospeso sopra il tetto del Lingotto.
   */
  private drawAgnelliScrigno(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 2200;
    const offset = (this.cameraX * speed) % spacing;
    const sx = 800 - offset;
    const sy = this.height - 230;

    if (sx < -200 || sx > this.width + 200) return;

    ctx.save();
    // Pilastri d'acciaio che sollevano lo Scrigno
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(sx - 70, sy + 60);
    ctx.lineTo(sx - 50, sy);
    ctx.moveTo(sx + 70, sy + 60);
    ctx.lineTo(sx + 50, sy);
    ctx.stroke();

    // Il Padiglione "Scrigno" in lamiera metallica aerodinamica
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(sx - 90, sy - 30, 180, 30);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(sx - 85, sy - 34, 170, 5);

    // Tettoia a lame frangisole
    ctx.fillStyle = '#94a3b8';
    for (let l = 0; l < 12; l++) {
      ctx.fillRect(sx - 80 + l * 13, sy - 40, 8, 6);
    }

    // Targa "PINACOTECA AGNELLI"
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 7px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PINACOTECA AGNELLI', sx, sy - 12);

    ctx.restore();
  }

  /**
   * "La Bolla" di Renzo Piano (sala riunioni trasparente in cristallo)
   * e l'Eliporto circolare sulla Pista del Lingotto.
   */
  private drawRenzoPianoBolla(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 2200;
    const offset = (this.cameraX * speed) % spacing;
    const bx = 1450 - offset;
    const by = this.height - 250;

    if (bx < -220 || bx > this.width + 220) return;

    ctx.save();
    // 1. Eliporto ("H")
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(bx - 110, by + 50, 60, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Cerchio interno e lettera "H"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', bx - 110, by + 50);

    // 2. Tralicci metallici aerospaziali che sostengono la Bolla
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx, by + 50);
    ctx.lineTo(bx - 20, by);
    ctx.moveTo(bx + 30, by + 50);
    ctx.lineTo(bx + 15, by);
    ctx.stroke();

    // 3. La Bolla di cristallo di Renzo Piano (sfera trasparente azzurro cielo)
    ctx.save();
    const sphereGrad = ctx.createRadialGradient(bx - 10, by - 15, 6, bx, by - 5, 42);
    sphereGrad.addColorStop(0, '#ffffff');
    sphereGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.75)');
    sphereGrad.addColorStop(1, 'rgba(14, 116, 144, 0.9)');
    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(bx, by - 5, 36, 0, Math.PI * 2);
    ctx.fill();

    // Rete metallica geometrica dei pannelli di vetro
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bx, by - 5, 36, 0, Math.PI * 2);
    ctx.stroke();
    // Meridiani e paralleli di vetro
    ctx.beginPath();
    ctx.ellipse(bx, by - 5, 18, 36, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(bx, by - 5, 36, 16, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Targa "LA BOLLA"
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 7px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LA BOLLA', bx, by + 75);

    ctx.restore();
  }

  /**
   * La Curva Parabolica della Pista del Lingotto (La Pista 500):
   * curva sopraelevata a 45 gradi in cemento armato, cordoli a scacchi
   * bianchi e rossi da gara, e le mitiche FIAT 500 d'epoca in collaudo!
   */
  private drawCurvaParabolicaFiat(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 1800;
    const offset = (this.cameraX * speed) % spacing;
    const px = 500 - offset;
    const py = this.height - 130;

    if (px < -350 || px > this.width + 350) return;

    ctx.save();
    // 1. La grande rampa parabolica inclinata
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(px, py + 40);
    ctx.quadraticCurveTo(px + 140, py - 40, px + 280, py - 70);
    ctx.lineTo(px + 280, py - 35);
    ctx.quadraticCurveTo(px + 140, py - 5, px, py + 75);
    ctx.closePath();
    ctx.fill();

    // 2. Cordolo da gara a scacchi bianchi e rossi
    for (let c = 0; c < 12; c++) {
      const t = c / 12;
      const cx = px + t * 280;
      const cy = py + 40 + t * (-110);
      ctx.fillStyle = c % 2 === 0 ? '#ef4444' : '#ffffff';
      ctx.fillRect(cx, cy - 6, 22, 6);
    }

    // 3. Guard-rail in acciaio sulla sommità della curva
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px, py + 34);
    ctx.quadraticCurveTo(px + 140, py - 46, px + 280, py - 76);
    ctx.stroke();

    // 4. Fiat 500 d'epoca in collaudo a tutta velocità! (Gialla e celeste)
    const carMove = (Date.now() * 0.05) % 400;
    const carX = px + 60 + carMove;
    const carY = py - 15 - (carMove * 0.15);

    if (carX > px && carX < px + 250) {
      // Fiat 500 vintage gialla
      ctx.save();
      ctx.translate(carX, carY);
      ctx.rotate(-0.25); // Inclinazione in curva parabolica

      // Carrozzeria arrotondata della mitica 500
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tetto apribile in tela nera
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-8, -10, 16, 4);
      // Fari tondi cromati
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(18, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      // Ruotine nere
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-14, 6, 8, 4);
      ctx.fillRect(8, 6, 8, 4);

      // Scia di velocità
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-22, -2);
      ctx.lineTo(-45, -2);
      ctx.stroke();

      ctx.restore();
    }

    // Insegna "PISTA 500 - LINGOTTO"
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PISTA 500 LINGOTTO', px + 140, py + 65);

    ctx.restore();
  }

  // =========================================================================
  // HELPER GRAFICI CONDIVISI (MONTAGNE, NUVOLE, STELLE, COLLINE)
  // =========================================================================

  /**
   * Nuvole soffici stile Super Mario
   */
  private renderMarioClouds(ctx: CanvasRenderingContext2D, speed: number, color: string): void {
    ctx.save();
    ctx.fillStyle = color;

    for (const c of this.clouds) {
      const screenX = (c.x - this.cameraX * speed) % (this.width + 400);
      const x = screenX < -150 ? screenX + this.width + 500 : screenX;
      const y = c.y;
      const s = c.scale;

      ctx.beginPath();
      ctx.arc(x + 40 * s, y, 22 * s, 0, Math.PI * 2);
      ctx.arc(x + 18 * s, y + 6 * s, 16 * s, 0, Math.PI * 2);
      ctx.arc(x + 62 * s, y + 6 * s, 16 * s, 0, Math.PI * 2);
      ctx.fillRect(x + 8 * s, y + 4 * s, 64 * s, 18 * s);
      ctx.fill();

      // Occhietti stile Mario
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
      ctx.fillStyle = baseCol;
      ctx.beginPath();
      ctx.moveTo(x, this.height - 180);
      ctx.lineTo(x + spacing / 2, this.height - 390);
      ctx.lineTo(x + spacing, this.height - 180);
      ctx.closePath();
      ctx.fill();

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
   * Colline verdi tondeggianti
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
      this.drawMarioHill(ctx, bx + 180, this.height - 120, 260, 160, hillColor, shadowColor);

      if (includeLandmarks) {
        this.drawSupergaMini(ctx, bx + 180, this.height - 280);
      }

      this.drawMarioHill(ctx, bx + 640, this.height - 100, 200, 130, hillColor, shadowColor);

      if (includeLandmarks) {
        this.drawCleanMoleMini(ctx, bx + 860, this.height - 130);
      }

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
    ctx.fillStyle = shadowColor;
    ctx.beginPath();
    ctx.ellipse(cx, baseY, w / 2 + 3, h + 3, 0, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.ellipse(cx, baseY, w / 2, h, 0, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = shadowColor;
    ctx.beginPath();
    ctx.arc(cx - w * 0.25, baseY - h * 0.6, 12, 0, Math.PI * 2);
    ctx.arc(cx + w * 0.25, baseY - h * 0.5, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawSupergaMini(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.save();
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x - 22, y + 10, 44, 18);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x - 18, y + 14, 4, 14);
    ctx.fillRect(x - 6, y + 14, 4, 14);
    ctx.fillRect(x + 6, y + 14, 4, 14);
    ctx.fillRect(x + 18, y + 14, 4, 14);

    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(x, y + 10, 15, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(x - 2, y - 10, 4, 6);
    ctx.restore();
  }

  private drawCleanMoleMini(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.save();
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 30, y - 100, 60, 100);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x - 25, y - 135, 50, 35);
    ctx.beginPath();
    ctx.moveTo(x - 25, y - 135);
    ctx.lineTo(x, y - 210);
    ctx.lineTo(x + 25, y - 135);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 10, y - 235, 20, 25);
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 235);
    ctx.lineTo(x, y - 290);
    ctx.lineTo(x + 4, y - 235);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(x, y - 293, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Alberi arrotondati del Parco del Valentino
   */
  private renderMarioTrees(ctx: CanvasRenderingContext2D, speed: number): void {
    const spacing = 320;
    const offset = (this.cameraX * speed) % spacing;

    ctx.save();
    for (let x = -offset - spacing; x < this.width + spacing; x += spacing) {
      const treeY = this.height - 140;

      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + 20, treeY - 50, 12, 50);

      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(x + 26, treeY - 80, 28, 42, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(x + 20, treeY - 95, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Stelle scintillanti notturne
   */
  private renderStars(ctx: CanvasRenderingContext2D, speed: number): void {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 45; i++) {
      const sx = ((i * 137 + 50) - this.cameraX * speed) % this.width;
      const sy = (i * 83) % (this.height * 0.6);
      const px = sx < 0 ? sx + this.width : sx;
      const size = (i % 3 === 0) ? 2.5 : 1.5;
      ctx.fillRect(px, sy, size, size);
    }
    ctx.restore();
  }
}
