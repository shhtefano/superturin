export type UpdateCallback = (dt: number) => void;
export type RenderCallback = (interpolation: number) => void;

export class GameLoop {
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedTimestep: number = 1 / 60; // 60 updates al secondo (16.66ms)
  private readonly maxFrameTime: number = 0.25; // 250ms limite anti-spirale della morte
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;

  private onUpdate: UpdateCallback;
  private onRender: RenderCallback;

  constructor(onUpdate: UpdateCallback, onRender: RenderCallback) {
    this.onUpdate = onUpdate;
    this.onRender = onRender;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.loop = this.loop.bind(this);
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;

    // Calcolo delta time in secondi
    let frameTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Evita salti temporali esagerati se l'utente cambia scheda
    if (frameTime > this.maxFrameTime) {
      frameTime = this.maxFrameTime;
    }

    this.accumulator += frameTime;

    // Esegui la fisica a timestep fisso deterministico
    while (this.accumulator >= this.fixedTimestep) {
      this.onUpdate(this.fixedTimestep);
      this.accumulator -= this.fixedTimestep;
    }

    // Render con interpolazione alpha tra frame fisici
    const alpha = this.accumulator / this.fixedTimestep;
    this.onRender(alpha);

    this.animationFrameId = requestAnimationFrame(this.loop);
  }
}
