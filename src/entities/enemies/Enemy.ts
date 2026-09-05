import { Entity } from '../Entity';

export abstract class Enemy extends Entity {
  public isStompable: boolean;
  public patrolLeft: number;
  public patrolRight: number;
  public moveSpeed: number;
  public movingRight: boolean = true;
  public isDead: boolean = false;
  protected deathTimer: number = 0;

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

  public abstract update(dt: number): void;
}
