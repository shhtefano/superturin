import { Entity } from '../Entity';

export abstract class Collectible extends Entity {
  public value: number;
  public collected: boolean = false;
  protected hoverTimer: number = Math.random() * Math.PI * 2;

  constructor(id: string, x: number, y: number, width: number, height: number, value: number) {
    super(id, x, y, width, height);
    this.value = value;
  }

  public update(dt: number): void {
    this.hoverTimer += dt * 4;
  }
}
