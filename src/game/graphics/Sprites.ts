import { PowerUpType } from '../../types/game';

export class Sprites {
  /**
   * Disegna il Giocatore (singolo power-up retrocompatibile).
   */
  public static drawPlayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    facingRight: boolean,
    isGrounded: boolean,
    vx: number,
    vy: number,
    invincibleTimer: number,
    activePowerUp?: PowerUpType | null
  ): void {
    const map = new Map<PowerUpType, number>();
    if (activePowerUp) {
      map.set(activePowerUp, 10);
    }
    Sprites.drawPlayerCombined(
      ctx,
      x,
      y,
      width,
      height,
      facingRight,
      isGrounded,
      vx,
      vy,
      invincibleTimer,
      map
    );
  }

  /**
   * Disegna il Giocatore con COMBINAZIONI MULTIPLE di sostanze ed effetti stratificati
   */
  public static drawPlayerCombined(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    facingRight: boolean,
    isGrounded: boolean,
    vx: number,
    vy: number,
    invincibleTimer: number,
    activePowerUps: Map<PowerUpType, number> = new Map()
  ): void {
    // Lampeggio se invincibile dopo un danno
    if (invincibleTimer > 0 && Math.floor(invincibleTimer * 20) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(Math.round(x + width / 2), Math.round(y + height / 2));
    if (!facingRight) {
      ctx.scale(-1, 1);
    }

    // Se ha il funghetto, il giocatore diventa GIGANTE (Mega Mario style 1.5x)
    const isGiant = activePowerUps.has('funghetti');
    if (isGiant) {
      ctx.scale(1.5, 1.5);
    }

    // Effetto Squash & Stretch
    let scaleX = 1;
    let scaleY = 1;
    if (!isGrounded) {
      if (vy < -50) {
        scaleX = 0.88;
        scaleY = 1.15;
      } else if (vy > 100) {
        scaleX = 0.92;
        scaleY = 1.08;
      }
    } else if (Math.abs(vx) > 20) {
      const runCycle = Math.sin(Date.now() * 0.015);
      scaleY = 1 + runCycle * 0.05;
    }
    ctx.scale(scaleX, scaleY);

    // =========================================================================
    // EFFETTI VISIVI COMBINATI MULTIPLI SUL PERSONAGGIO (STRATIFICATI INSIEME)
    // =========================================================================

    // 1. EFFETTO COCAINA: Aura elettrica ciano + scintille
    if (activePowerUps.has('cocaina')) {
      ctx.save();
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 14;
      ctx.strokeRect(-width / 2 - 3, -height / 2 - 3, width + 6, height + 6);
      ctx.fillStyle = '#ffffff';
      const sparkX = Math.sin(Date.now() * 0.04) * 20;
      ctx.fillRect(sparkX, -height / 2 - 8, 3, 3);
      ctx.restore();
    }

    // 2. EFFETTO MARIJUANA: Aura verde relax + sbuffi di fumo
    if (activePowerUps.has('marijuana')) {
      ctx.save();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 12;
      ctx.strokeRect(-width / 2 - 2, -height / 2 - 2, width + 4, height + 4);
      ctx.fillStyle = 'rgba(187, 247, 208, 0.45)';
      const smokeOffset = (Date.now() * 0.003) % 1;
      ctx.beginPath();
      ctx.arc(-4, -height / 2 - 10 - smokeOffset * 10, 6 + smokeOffset * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. EFFETTO MD: Pulsazione neon fucsia disco + cuoricini
    if (activePowerUps.has('md')) {
      ctx.save();
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 16;
      ctx.strokeRect(-width / 2 - 3, -height / 2 - 3, width + 6, height + 6);
      ctx.fillStyle = '#f472b6';
      ctx.font = '10px sans-serif';
      ctx.fillText('♥', -8, -height / 2 - 8);
      ctx.restore();
    }

    // 4. EFFETTO LSD: Scia caleidoscopica arcobaleno (cycling hue)
    if (activePowerUps.has('lsd')) {
      ctx.save();
      const hue = Math.floor((Date.now() * 0.2) % 360);
      ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
      ctx.lineWidth = 3;
      ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
      ctx.shadowBlur = 15;
      ctx.strokeRect(-width / 2 - 4, -height / 2 - 4, width + 8, height + 8);
      ctx.restore();
    }

    // 5. EFFETTO FUNGHETTI: Alone dorato gigante
    if (activePowerUps.has('funghetti')) {
      ctx.save();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 18;
      ctx.strokeRect(-width / 2 - 4, -height / 2 - 4, width + 8, height + 8);
      ctx.restore();
    }

    const halfW = width / 2;
    const halfH = height / 2;

    // 1. Gambe / Pantaloni scuri e stivali
    const legPhase = isGrounded && Math.abs(vx) > 10 ? Math.sin(Date.now() * 0.018) * 6 : 0;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-10 + legPhase, halfH - 16, 8, 12);
    ctx.fillRect(2 - legPhase, halfH - 16, 8, 12);

    ctx.fillStyle = '#451a03';
    ctx.fillRect(-12 + legPhase, halfH - 5, 11, 6);
    ctx.fillRect(1 - legPhase, halfH - 5, 11, 6);

    // 2. Cappotto / Giacca Blu Savoia
    ctx.fillStyle = '#0d47a1';
    ctx.fillRect(-halfW + 4, -6, width - 8, 22);

    // Fila di bottoni dorati
    ctx.fillStyle = '#ffb703';
    ctx.fillRect(-1, -2, 3, 3);
    ctx.fillRect(-1, 4, 3, 3);
    ctx.fillRect(-1, 10, 3, 3);

    // 3. Testa
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-9, -halfH + 8, 18, 16);

    // Occhi reattivi alle sostanze
    if (activePowerUps.has('cocaina')) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(1, -halfH + 12, 6, 6);
      ctx.fillStyle = '#000000';
      ctx.fillRect(4, -halfH + 14, 2, 2);
    } else if (activePowerUps.has('marijuana')) {
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(1, -halfH + 14, 5, 2);
    } else if (activePowerUps.has('md')) {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(4, -halfH + 14, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(2, -halfH + 13, 3, 4);
    }

    // Baffi tipici piemontesi all'insù
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(0, -halfH + 19, 9, 3);
    ctx.fillRect(7, -halfH + 18, 3, 2);

    // 4. Coppola Torinese
    ctx.fillStyle = '#334155';
    ctx.fillRect(-12, -halfH + 4, 24, 7);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, -halfH + 9, 14, 3);

    ctx.restore();
  }

  /**
   * Disegna il Toret (La storica fontanella verde di Torino).
   */
  public static drawToret(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    activated: boolean
  ): void {
    ctx.save();
    ctx.fillStyle = '#1b5e20';
    ctx.fillRect(x + 6, y + 10, width - 12, height - 10);
    ctx.fillStyle = '#0f3d14';
    ctx.fillRect(x + 2, y + height - 8, width - 4, 8);
    ctx.fillRect(x + 4, y + 6, width - 8, 5);
    ctx.fillStyle = '#388e3c';
    ctx.fillRect(x + width - 10, y + 16, 9, 10);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(x + width - 5, y + 13, 3, 4);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(x + width - 2, y + 21, 5, 3);

    if (activated) {
      const dropOffset = (Date.now() * 0.05) % 15;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + width + 2, y + 23);
      ctx.quadraticCurveTo(x + width + 8, y + 23, x + width + 8, y + height);
      ctx.stroke();

      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(x + width + 7, y + height - 4 - dropOffset, 2, 3);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x + width / 2 - 2, y - 20, 3, 20);
      ctx.fillStyle = '#ffb703';
      ctx.fillRect(x + width / 2 + 1, y - 20, 14, 10);
    }
    ctx.restore();
  }

  // =========================================================================
  // COLLEZIONABILI & SOSTANZE SABAUDE
  // =========================================================================

  /**
   * 1. Gianduiotto dorato
   */
  public static drawGianduiotto(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    hoverOffset: number = 0
  ): void {
    ctx.save();
    const cy = y + hoverOffset;
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.moveTo(x + 3, cy + height - 3);
    ctx.lineTo(x + width / 2, cy + 3);
    ctx.lineTo(x + width - 3, cy + height - 3);
    ctx.closePath();

    const grad = ctx.createLinearGradient(x, cy, x + width, cy + height);
    grad.addColorStop(0, '#ffe57f');
    grad.addColorStop(0.5, '#ffb703');
    grad.addColorStop(1, '#d48806');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = '#fffbeb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + width / 2 - 2, cy + 4);
    ctx.lineTo(x + 6, cy + height - 4);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * 1b. Bicerin storico torinese (bicchierino di vetro a strati: cioccolato, caffè e fior di latte)
   */
  public static drawBicerin(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    hoverOffset: number = 0
  ): void {
    ctx.save();
    const cy = y + hoverOffset;
    ctx.shadowColor = '#d97706';
    ctx.shadowBlur = 8;

    // Bicchiere di vetro trasparente
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x + 3, cy + 2, width - 6, height - 6);

    // Strato 1: Cioccolata calda densa al fondo
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + 4, cy + height - 12, width - 8, 8);

    // Strato 2: Caffè espresso caldo al centro
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 4, cy + height - 18, width - 8, 6);

    // Strato 3: Fior di latte cremoso in cima
    ctx.fillStyle = '#fefce8';
    ctx.fillRect(x + 4, cy + 4, width - 8, 6);

    // Bordo bicchiere lucido
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 3, cy + 2, width - 6, height - 6);

    // Piedino del bicchierino
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + width / 2 - 2, cy + height - 4, 4, 3);
    ctx.fillRect(x + width / 2 - 5, cy + height - 2, 10, 2);

    ctx.restore();
  }

  /**
   * 2. Cocaina (Bustina bianca brillante con fulmine di velocità)
   */
  public static drawCocaina(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    hoverOffset: number = 0
  ): void {
    ctx.save();
    const cy = y + hoverOffset;
    ctx.shadowColor = '#67e8f9';
    ctx.shadowBlur = 10;

    // Busta rettangolare bianca/traslucida
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + 4, cy + 4, width - 8, height - 8);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 4, cy + 4, width - 8, height - 8);

    // Fulmine azzurro brillante al centro (simbolo velocità)
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.moveTo(x + width / 2 + 1, cy + 7);
    ctx.lineTo(x + width / 2 - 4, cy + 14);
    ctx.lineTo(x + width / 2, cy + 14);
    ctx.lineTo(x + width / 2 - 2, cy + 21);
    ctx.lineTo(x + width / 2 + 5, cy + 12);
    ctx.lineTo(x + width / 2 + 1, cy + 12);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /**
   * 3. Marijuana (Foglia verde stilizzata 5 punte)
   */
  public static drawMarijuana(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    hoverOffset: number = 0
  ): void {
    ctx.save();
    const cx = x + width / 2;
    const cy = y + height / 2 + hoverOffset;
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 10;

    ctx.fillStyle = '#16a34a';

    // 5 foglioline simmetriche
    const angles = [-0.65, -0.3, 0, 0.3, 0.65];
    const lengths = [10, 13, 15, 13, 10];

    for (let i = 0; i < angles.length; i++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angles[i]);
      ctx.beginPath();
      ctx.ellipse(0, -lengths[i] / 2, 3, lengths[i] / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Picciolo
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy + 9);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * 4. MD (Pasticca disco neon con smiley)
   */
  public static drawMD(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    hoverOffset: number = 0
  ): void {
    ctx.save();
    const cx = x + width / 2;
    const cy = y + height / 2 + hoverOffset;
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 12;

    // Cerchio pasticca magenta acceso
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();

    // Bordo lucido
    ctx.strokeStyle = '#fbcfe8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Smiley o cuore impresso
    ctx.fillStyle = '#ffffff';
    // Occhietti
    ctx.fillRect(cx - 5, cy - 4, 2, 3);
    ctx.fillRect(cx + 3, cy - 4, 2, 3);
    // Sorriso
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy + 1, 5, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * 5. LSD (Francobollo blotter psichedelico colorato con sole/occhio)
   */
  public static drawLSD(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    hoverOffset: number = 0
  ): void {
    ctx.save();
    const cy = y + hoverOffset;
    const hue = Math.floor((Date.now() * 0.15) % 360);
    ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
    ctx.shadowBlur = 12;

    // Francobollo con bordi perforati
    ctx.fillStyle = `hsl(${hue}, 90%, 65%)`;
    ctx.fillRect(x + 3, cy + 3, width - 6, height - 6);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 3, cy + 3, width - 6, height - 6);

    // Disegno centrale psichedelico a spirale
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + width / 2, cy + height / 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `hsl(${(hue + 180) % 360}, 100%, 40%)`;
    ctx.beginPath();
    ctx.arc(x + width / 2, cy + height / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * 6. Funghetti Allucinogeni (Fungo magico viola/azzurro con puntini)
   */
  public static drawFunghetti(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    hoverOffset: number = 0
  ): void {
    ctx.save();
    const cx = x + width / 2;
    const cy = y + height / 2 + hoverOffset;
    ctx.shadowColor = '#8b5cf6';
    ctx.shadowBlur = 12;

    // Gambo fungo beige
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(cx - 5, cy + 1, 10, 11);

    // Cappella a cupola viola magico
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(cx, cy + 1, 13, Math.PI, 0);
    ctx.fill();

    // Puntini luminescenti gialli/bianchi sulla cappella
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(cx - 6, cy - 4, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 6, cy - 4, 2.5, 0, Math.PI * 2);
    ctx.arc(cx, cy - 8, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Disegna il Piccione di Piazza Castello
   */
  public static drawPigeon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    movingRight: boolean,
    walkFrame: number
  ): void {
    ctx.save();
    ctx.translate(Math.round(x + width / 2), Math.round(y + height / 2));
    if (!movingRight) {
      ctx.scale(-1, 1);
    }

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(0, 2, width * 0.4, height * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(8, -4, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(10, -7, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(12, -8, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(12.5, -8, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(14, -8);
    ctx.lineTo(19, -6);
    ctx.lineTo(14, -5);
    ctx.closePath();
    ctx.fill();

    const wingAngle = Math.sin(walkFrame * 8) * 0.25;
    ctx.save();
    ctx.rotate(wingAngle);
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(-4, 0, 10, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 2;
    const legOffset = Math.sin(walkFrame * 10) * 4;
    ctx.beginPath();
    ctx.moveTo(-2, height * 0.35);
    ctx.lineTo(-2 + legOffset, height * 0.5);
    ctx.moveTo(4, height * 0.35);
    ctx.lineTo(4 - legOffset, height * 0.5);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Disegna il Tram Storico GTT di Torino
   */
  public static drawTram(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    movingRight: boolean
  ): void {
    ctx.save();
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x, y + 10, width, height - 16);

    ctx.fillStyle = '#365314';
    ctx.fillRect(x, y + height - 12, width, 6);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x + 4, y + 4, width - 8, 8);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + width / 2 - 15, y + 4);
    ctx.lineTo(x + width / 2, y - 10);
    ctx.lineTo(x + width / 2 + 15, y + 4);
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    const numWindows = Math.floor(width / 24);
    for (let i = 0; i < numWindows; i++) {
      ctx.fillRect(x + 8 + i * 22, y + 14, 15, 14);
    }

    const frontX = movingRight ? x + width - 6 : x;
    ctx.fillStyle = '#fef9c3';
    ctx.fillRect(frontX, y + height - 20, 6, 6);

    ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
    ctx.beginPath();
    if (movingRight) {
      ctx.moveTo(frontX + 6, y + height - 17);
      ctx.lineTo(frontX + 60, y + height - 30);
      ctx.lineTo(frontX + 60, y + height + 5);
    } else {
      ctx.moveTo(frontX, y + height - 17);
      ctx.lineTo(frontX - 60, y + height - 30);
      ctx.lineTo(frontX - 60, y + height + 5);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(x + 20, y + height - 3, 5, 0, Math.PI * 2);
    ctx.arc(x + width - 20, y + height - 3, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Disegna il Traguardo Reale col Toro Dorato
   */
  public static drawGoal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    ctx.save();
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x + 4, y + 10, width - 8, height - 10);

    ctx.fillStyle = '#d4af37';
    ctx.fillRect(x + width / 2 - 2, y - 28, 4, 38);

    const wave = Math.sin(Date.now() * 0.008) * 4;
    ctx.fillStyle = '#0d47a1';
    ctx.beginPath();
    ctx.moveTo(x + width / 2 + 2, y - 28);
    ctx.lineTo(x + width / 2 + 40, y - 22 + wave);
    ctx.lineTo(x + width / 2 + 35, y - 8 + wave);
    ctx.lineTo(x + width / 2 + 2, y - 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffb703';
    ctx.fillRect(x + width / 2 + 14, y - 20 + wave, 10, 7);

    ctx.restore();
  }
}
