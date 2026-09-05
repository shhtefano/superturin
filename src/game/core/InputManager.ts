export class InputManager {
  private keysDown: Set<string> = new Set();
  private jumpBuffered: boolean = false;
  private jumpBufferTimer: number = 0;
  private readonly JUMP_BUFFER_DURATION = 0.14; // 140ms di jump buffering

  // Flag per tracciare se il tasto salto è tenuto premuto (per variable jump height)
  public isJumpHeld: boolean = false;

  private onKeyDownHandler: (e: KeyboardEvent) => void;
  private onKeyUpHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.onKeyDownHandler = this.handleKeyDown.bind(this);
    this.onKeyUpHandler = this.handleKeyUp.bind(this);
    this.attach();
  }

  private attach(): void {
    window.addEventListener('keydown', this.onKeyDownHandler);
    window.addEventListener('keyup', this.onKeyUpHandler);
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.onKeyDownHandler);
    window.removeEventListener('keyup', this.onKeyUpHandler);
    this.keysDown.clear();
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Evita scrolling accidentale della pagina con frecce e spazio
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }

    if (!this.keysDown.has(e.code)) {
      this.keysDown.add(e.code);

      // Trigger del jump buffer su nuova pressione
      if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
        this.jumpBuffered = true;
        this.jumpBufferTimer = this.JUMP_BUFFER_DURATION;
        this.isJumpHeld = true;
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.keysDown.delete(e.code);

    if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
      this.isJumpHeld = false;
    }
  }

  public update(dt: number): void {
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= dt;
      if (this.jumpBufferTimer <= 0) {
        this.jumpBuffered = false;
      }
    }
  }

  public isLeft(): boolean {
    return this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft');
  }

  public isRight(): boolean {
    return this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight');
  }

  public isDown(): boolean {
    return this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown');
  }

  public isRun(): boolean {
    return this.keysDown.has('ShiftLeft') || this.keysDown.has('ShiftRight');
  }

  /**
   * Consuma il salto se memorizzato nel buffer (jump buffering).
   * Ritorna true se il salto deve essere eseguito.
   */
  public consumeJump(): boolean {
    if (this.jumpBuffered) {
      this.jumpBuffered = false;
      this.jumpBufferTimer = 0;
      return true;
    }
    return false;
  }

  public reset(): void {
    this.keysDown.clear();
    this.jumpBuffered = false;
    this.jumpBufferTimer = 0;
    this.isJumpHeld = false;
  }
}
