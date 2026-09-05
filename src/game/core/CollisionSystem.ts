import { Hitbox } from '../../types/physics';

export class CollisionSystem {
  /**
   * Verifica semplice se due bounding box si sovrappongono.
   */
  public static checkAABB(a: Hitbox, b: Hitbox): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  /**
   * Verifica se un punto si trova all'interno di una hitbox.
   */
  public static pointInAABB(px: number, py: number, box: Hitbox): boolean {
    return px >= box.x && px <= box.x + box.width && py >= box.y && py <= box.y + box.height;
  }

  /**
   * Risolve la collisione orizzontale di un'entità con una piattaforma solida.
   */
  public static resolveHorizontal(
    entityBox: Hitbox,
    vx: number,
    platformBox: Hitbox
  ): { resolvedX: number; collided: boolean } {
    if (!this.checkAABB(entityBox, platformBox)) {
      return { resolvedX: entityBox.x, collided: false };
    }

    // Se si muoveva verso destra
    if (vx > 0) {
      return {
        resolvedX: platformBox.x - entityBox.width,
        collided: true,
      };
    }
    // Se si muoveva verso sinistra
    if (vx < 0) {
      return {
        resolvedX: platformBox.x + platformBox.width,
        collided: true,
      };
    }

    return { resolvedX: entityBox.x, collided: false };
  }

  /**
   * Risolve la collisione verticale con una piattaforma solida o semisolida (one-way).
   * @param isOneWay se true, la piattaforma è attraversabile dal basso e dai lati
   * @param prevBottom la coordinata Y del fondo dell'entità prima dell'aggiornamento
   */
  public static resolveVertical(
    entityBox: Hitbox,
    vy: number,
    platformBox: Hitbox,
    isOneWay: boolean,
    prevBottom: number
  ): { resolvedY: number; grounded: boolean; hitCeiling: boolean } {
    if (!this.checkAABB(entityBox, platformBox)) {
      return { resolvedY: entityBox.y, grounded: false, hitCeiling: false };
    }

    const currentBottom = entityBox.y + entityBox.height;

    // Caso 1: Piattaforma One-Way (semisolida)
    if (isOneWay) {
      // Si collide con la piattaforma one-way SOLO se il player stava cadendo (vy >= 0)
      // e nel frame precedente i suoi piedi erano sopra o a livello della superficie superiore
      const tolerance = 8;
      if (vy >= 0 && prevBottom <= platformBox.y + tolerance) {
        return {
          resolvedY: platformBox.y - entityBox.height,
          grounded: true,
          hitCeiling: false,
        };
      }
      // Altrimenti la ignora (ci passa attraverso dal basso o dai lati)
      return { resolvedY: entityBox.y, grounded: false, hitCeiling: false };
    }

    // Caso 2: Piattaforma Solida Standard
    if (vy > 0) {
      // Caduta su una piattaforma (atterraggio)
      return {
        resolvedY: platformBox.y - entityBox.height,
        grounded: true,
        hitCeiling: false,
      };
    } else if (vy < 0) {
      // Salto contro il soffitto
      return {
        resolvedY: platformBox.y + platformBox.height,
        grounded: false,
        hitCeiling: true,
      };
    }

    return { resolvedY: entityBox.y, grounded: false, hitCeiling: false };
  }
}
