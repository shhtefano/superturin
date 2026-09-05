export class Camera {
  public x: number = 0;
  public y: number = 0;
  public width: number;
  public height: number;

  // Limiti del livello corrente
  public levelWidth: number = 5000;
  public levelHeight: number = 720;

  // Smoothing e lookahead
  private targetX: number = 0;
  private targetY: number = 0;
  private readonly lerpFactor: number = 0.08; // Transizione morbida
  private lookAheadDistance: number = 80;

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
    this.x = targetX - this.width * 0.35;
    this.y = targetY - this.height * 0.6;
    this.clampToBounds();
  }

  public triggerShake(intensity: number = 8, duration: number = 0.25): void {
    this.shakeIntensity = intensity;
    this.shakeTimer = duration;
  }

  public update(dt: number, focusX: number, focusY: number, facingRight: boolean): void {
    // Look ahead in base alla direzione in cui guarda il giocatore
    const lookAhead = facingRight ? this.lookAheadDistance : -this.lookAheadDistance;
    this.targetX = focusX - this.width * 0.35 + lookAhead;
    this.targetY = focusY - this.height * 0.6;

    // Movimento morbido (lerp) verso il target
    this.x += (this.targetX - this.x) * this.lerpFactor;
    this.y += (this.targetY - this.y) * this.lerpFactor;

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
      -Math.round(this.y + this.offsetY)
    );
  }

  public restoreTransform(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }
}
