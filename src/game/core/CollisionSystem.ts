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
   * Evita il bug delle "pareti invisibili" sui giunti dei pavimenti e tiene conto dell'inset.
   */
  public static resolveHorizontal(
    entityBox: Hitbox,
    vx: number,
    platformBox: Hitbox,
    insetX: number = 0
  ): { resolvedX: number; collided: boolean } {
    if (!this.checkAABB(entityBox, platformBox)) {
      return { resolvedX: entityBox.x - insetX, collided: false };
    }

    // Un pavimento NON deve bloccare orizzontalmente chi vi cammina sopra!
    // È una vera collisione con un muro SOLO se l'entità penetra verticalmente nel blocco
    // oltre una soglia di tolleranza di gradino (8px).
    const stepTolerance = 8;
    const isAbovePlatform = entityBox.y + entityBox.height <= platformBox.y + stepTolerance;
    const isBelowPlatform = entityBox.y >= platformBox.y + platformBox.height - stepTolerance;

    if (isAbovePlatform || isBelowPlatform) {
      return { resolvedX: entityBox.x - insetX, collided: false };
    }

    // Se si muoveva verso destra: posiziona l'entità esattamente a filo sinistro del muro
    if (vx > 0) {
      return {
        resolvedX: platformBox.x - entityBox.width - insetX,
        collided: true,
      };
    }
    // Se si muoveva verso sinistra: posiziona l'entità esattamente a filo destro del muro
    if (vx < 0) {
      return {
        resolvedX: platformBox.x + platformBox.width - insetX,
        collided: true,
      };
    }

    return { resolvedX: entityBox.x - insetX, collided: false };
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
      const tolerance = 14;
      if (vy >= 0 && prevBottom <= platformBox.y + tolerance) {
        return {
          resolvedY: platformBox.y - entityBox.height,
          grounded: true,
          hitCeiling: false,
        };
      }
      return { resolvedY: entityBox.y, grounded: false, hitCeiling: false };
    }

    // Caso 2: Piattaforma Solida Standard
    const penetrationFromTop = currentBottom - platformBox.y;
    const penetrationFromBottom = platformBox.y + platformBox.height - entityBox.y;

    if (vy >= 0 && prevBottom <= platformBox.y + 16) {
      // Atterraggio affidabile
      return {
        resolvedY: platformBox.y - entityBox.height,
        grounded: true,
        hitCeiling: false,
      };
    } else if (vy < 0 && penetrationFromBottom < penetrationFromTop) {
      // Urto contro soffitto
      return {
        resolvedY: platformBox.y + platformBox.height,
        grounded: false,
        hitCeiling: true,
      };
    } else if (vy >= 0 && penetrationFromTop < penetrationFromBottom) {
      // Atterraggio standard
      return {
        resolvedY: platformBox.y - entityBox.height,
        grounded: true,
        hitCeiling: false,
      };
    }

    return { resolvedY: entityBox.y, grounded: false, hitCeiling: false };
  }
}
