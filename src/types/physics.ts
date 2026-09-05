export interface Vector2D {
  x: number;
  y: number;
}

export interface Hitbox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CollisionSide = 'top' | 'bottom' | 'left' | 'right' | 'none';

export interface CollisionResult {
  collided: boolean;
  side: CollisionSide;
  overlapX: number;
  overlapY: number;
}
