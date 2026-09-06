export class Camera {
  public x: number = 0;
  public y: number = 0;
  public width: number;
  public height: number;

  // Limiti del livello corrente
  public levelWidth: number = 5000;
  public levelHeight: number = 720;

  // Offset verticale per calibrare l'inquadratura di terra:
  // Valore bilanciato (20px) per mantenere la porzione sotto i piedi del giocatore abbassata e naturale
  public readonly verticalGroundOffset: number = 20;

  // Smoothing e lookahead graduale
  private targetX: number = 0;
  private targetY: number = 0;
  private readonly lerpFactor: number = 0.08; // Transizione morbida
  private currentLookAhead: number = 0;
  private readonly maxLookAhead: number = 18; // Lookahead calibrato e non invasivo

  // Screen shake
  private shakeTimer: number = 0;
  private shakeIntensity: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(viewportWidth: number = 1280, viewportHeight: number = 720) {
    this.width = viewportWidth;
    this.height = viewportHeight;
  }

  public setLevelBounds(width: number, height: number): void {
    this.levelWidth = Math.max(width, this.width);
    this.levelHeight = Math.max(height, this.height);
  }

  public setPositionImmediate(targetX: number, targetY: number): void {
    this.currentLookAhead = 0;
    this.x = targetX - this.width * 0.35;
    this.y = targetY - this.height * 0.6;
    this.clampToBounds();
  }

  public triggerShake(intensity: number = 8, duration: number = 0.25): void {
    this.shakeIntensity = intensity;
    this.shakeTimer = duration;
  }

  public update(dt: number, focusX: number, focusY: number, facingRight: boolean, vx: number = 0): void {
    // Look ahead morbido attivo solo quando il giocatore si muove orizzontalmente con una certa velocità.
    // Quando si sale, si salta sul posto o ci si gira da fermi, il lookahead rimane fisso a 0
    // per eliminare qualsiasi movimento o tremolio fastidioso delle montagne e dello sfondo!
    const isMovingFast = Math.abs(vx) > 50;
    const targetLookAhead = isMovingFast ? (facingRight ? this.maxLookAhead : -this.maxLookAhead) : 0;
    this.currentLookAhead += (targetLookAhead - this.currentLookAhead) * 0.05;

    this.targetX = focusX - this.width * 0.35 + this.currentLookAhead;

    // Deadzone verticale: quando il giocatore salta o atterra, se la variazione è entro 65px
    // la telecamera NON sussulta su e giù, eliminando il mal di mare e rendendo lo sfondo immobile.
    // Focus a 0.60 per mantenere la porzione sotto i piedi del giocatore abbassata
    // e garantire massima visibilità verso l'alto (piattaforme, ostacoli e cielo).
    const desiredY = focusY - this.height * 0.60;
    const diffY = desiredY - this.targetY;
    const deadzoneY = 65;
    if (Math.abs(diffY) > deadzoneY) {
      this.targetY += Math.sign(diffY) * (Math.abs(diffY) - deadzoneY);
    }

    // Movimento morbido (lerp) verso il target
    this.x += (this.targetX - this.x) * this.lerpFactor;
    this.y += (this.targetY - this.y) * (this.lerpFactor * 0.7);

    this.clampToBounds();

    // Gestione screen shake
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
      const factor = this.shakeTimer > 0 ? this.shakeIntensity : 0;
      this.offsetX = (Math.random() * 2 - 1) * factor;
      this.offsetY = (Math.random() * 2 - 1) * factor;
    } else {
      this.offsetX = 0;
      this.offsetY = 0;
    }
  }

  private clampToBounds(): void {
    const maxX = Math.max(0, this.levelWidth - this.width);
    const maxY = Math.max(0, this.levelHeight - this.height);

    if (this.x < 0) this.x = 0;
    if (this.x > maxX) this.x = maxX;

    if (this.y < 0) this.y = 0;
    if (this.y > maxY) this.y = maxY;
  }

  public applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(
      -Math.round(this.x + this.offsetX),
      -Math.round(this.y + this.offsetY + this.verticalGroundOffset)
    );
  }

  public restoreTransform(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }
}
