export class InputManager {
  private keysDown: Set<string> = new Set();
  private jumpBuffered: boolean = false;
  private jumpBufferTimer: number = 0;
  private readonly JUMP_BUFFER_DURATION = 0.14; // 140ms di jump buffering

  // Buffer per le Skill da tastierino numerico / tasti 1, 2, 3
  private skill1Buffered: boolean = false;
  private skill2Buffered: boolean = false;
  private skill3Buffered: boolean = false;

  // Buffer per la Super-Abilità speciale del personaggio (Barra Spaziatrice / Mobile ⭐)
  private specialSkillBuffered: boolean = false;

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

      // Trigger del jump buffer su nuova pressione (W, Freccia Su)
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        this.jumpBuffered = true;
        this.jumpBufferTimer = this.JUMP_BUFFER_DURATION;
        this.isJumpHeld = true;
      }

      // SUPER-ABILITÀ DEL PERSONAGGIO: Tasto SPACE
      if (e.code === 'Space') {
        this.specialSkillBuffered = true;
      }

      // SKILL 1: Scivolata (Numpad 1, Digit 1, J, Z)
      if (['Digit1', 'Numpad1', 'KeyJ', 'KeyZ'].includes(e.code)) {
        this.skill1Buffered = true;
      }

      // SKILL 2: Sparo Pistola (Numpad 2, Digit 2, K, X)
      if (['Digit2', 'Numpad2', 'KeyK', 'KeyX'].includes(e.code)) {
        this.skill2Buffered = true;
      }

      // SKILL 3: Bomba Gianduiotto (Numpad 3, Digit 3, L, C)
      if (['Digit3', 'Numpad3', 'KeyL', 'KeyC'].includes(e.code)) {
        this.skill3Buffered = true;
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.keysDown.delete(e.code);

    if (e.code === 'KeyW' || e.code === 'ArrowUp') {
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

  // Touch / Mobile Virtual Controls
  public touchLeft: boolean = false;
  public touchRight: boolean = false;
  public touchDown: boolean = false;
  public touchRun: boolean = false;

  public isLeft(): boolean {
    return this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft') || this.touchLeft;
  }

  public isRight(): boolean {
    return this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight') || this.touchRight;
  }

  public isDown(): boolean {
    return this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown') || this.touchDown;
  }

  public isRun(): boolean {
    return this.keysDown.has('ShiftLeft') || this.keysDown.has('ShiftRight') || this.touchRun;
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

  // --- SKILL CONSUMERS (Tastierino Numerico 1, 2, 3) ---

  public consumeSkill1(): boolean {
    if (this.skill1Buffered) {
      this.skill1Buffered = false;
      return true;
    }
    return false;
  }

  public consumeSkill2(): boolean {
    if (this.skill2Buffered) {
      this.skill2Buffered = false;
      return true;
    }
    return false;
  }

  public consumeSkill3(): boolean {
    if (this.skill3Buffered) {
      this.skill3Buffered = false;
      return true;
    }
    return false;
  }

  public consumeSpecialSkill(): boolean {
    if (this.specialSkillBuffered) {
      this.specialSkillBuffered = false;
      return true;
    }
    return false;
  }

  // --- VIRTUAL JOYPAD TOUCH API ---

  public setTouchDirection(dir: 'left' | 'right' | 'down' | 'none', active: boolean): void {
    if (dir === 'left') this.touchLeft = active;
    if (dir === 'right') this.touchRight = active;
    if (dir === 'down') this.touchDown = active;
    if (dir === 'none') {
      this.touchLeft = false;
      this.touchRight = false;
      this.touchDown = false;
    }
  }

  public setTouchRun(active: boolean): void {
    this.touchRun = active;
  }

  public pressTouchJump(): void {
    this.jumpBuffered = true;
    this.jumpBufferTimer = this.JUMP_BUFFER_DURATION;
    this.isJumpHeld = true;
  }

  public releaseTouchJump(): void {
    this.isJumpHeld = false;
  }

  public triggerTouchSkill(skillNum: 1 | 2 | 3): void {
    if (skillNum === 1) this.skill1Buffered = true;
    if (skillNum === 2) this.skill2Buffered = true;
    if (skillNum === 3) this.skill3Buffered = true;
  }

  public triggerTouchSpecialSkill(): void {
    this.specialSkillBuffered = true;
  }

  public reset(): void {
    this.keysDown.clear();
    this.jumpBuffered = false;
    this.jumpBufferTimer = 0;
    this.isJumpHeld = false;
    this.skill1Buffered = false;
    this.skill2Buffered = false;
    this.skill3Buffered = false;
    this.specialSkillBuffered = false;
    this.touchLeft = false;
    this.touchRight = false;
    this.touchDown = false;
    this.touchRun = false;
  }
}
