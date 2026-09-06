export const Physics = {
  // Gravità e caduta
  GRAVITY: 1750,           // px/s^2 (leggermente più ariosa per salti ampi)
  MAX_FALL_SPEED: 950,     // px/s (velocità terminale)

  // Movimento orizzontale reattivo e fluido
  WALK_SPEED: 290,         // px/s
  RUN_SPEED: 450,          // px/s con tasto Shift
  ACCELERATION_GROUND: 2250,
  DECELERATION_GROUND: 2600,
  ACCELERATION_AIR: 1650,  // Maggiore manovrabilità in aria
  DECELERATION_AIR: 700,

  // Salto potenziato molto più alto e reattivo (stile Super Mario)
  JUMP_FORCE: -830,        // Salto potenziato e arioso
  JUMP_CUT_LIMIT: -320,    // Taglio salto variabile per salti controllati
  COYOTE_TIME: 0.18,       // 180ms di tolleranza bordo generosa per giocabilità semplice
  BOUNCE_FORCE: -560,      // Rimbalzo dopo stomp nemici

  // Limiti generali
  MIN_MOVE_EPSILON: 5,
};
