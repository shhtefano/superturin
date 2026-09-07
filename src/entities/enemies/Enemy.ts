import { Entity } from '../Entity';
import { Hitbox } from '../../types/physics';
import { EnemyProjectile } from '../projectiles/EnemyProjectile';

export abstract class Enemy extends Entity {
  public isStompable: boolean;
  public patrolLeft: number;
  public patrolRight: number;
  public moveSpeed: number;
  public movingRight: boolean = true;
  public isDead: boolean = false;
  protected deathTimer: number = 0;

  // Meccaniche di attacco nemico (spari e pugni)
  public onShoot?: (projectile: EnemyProjectile) => void;
  public isPunching: boolean = false;
  public punchTimer: number = 0;
  public punchCooldown: number = 0;

  public override getHitbox(): Hitbox {
    // Inset perimetrale generoso: evita che sfiorare un nemico di 1px tolga vita ingiustamente
    const insetX = 4;
    return {
      x: this.x + insetX,
      y: this.y + 2,
      width: Math.max(12, this.width - insetX * 2),
      height: Math.max(12, this.height - 2),
    };
  }

  /**
   * Hitbox per attacco corpo a corpo (pugno, ombrellata, zampata)
   */
  public getPunchHitbox(): Hitbox | null {
    if (!this.isPunching) return null;
    const reach = 26;
    return {
      x: this.movingRight ? this.x + this.width : this.x - reach,
      y: this.y + 6,
      width: reach,
      height: Math.max(16, this.height - 12),
    };
  }

  constructor(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    patrolLeft: number,
    patrolRight: number,
    moveSpeed: number,
    isStompable: boolean = true
  ) {
    super(id, x, y, width, height);
    this.patrolLeft = patrolLeft;
    this.patrolRight = patrolRight;
    this.moveSpeed = moveSpeed;
    this.isStompable = isStompable;
  }

  public die(): void {
    this.isDead = true;
    this.deathTimer = 0.3; // Rimane visibile per 300ms prima di sparire
  }

  public abstract update(dt: number, playerX?: number, playerY?: number): void;
}
