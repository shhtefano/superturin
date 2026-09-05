export const Physics = {
  // Gravità e caduta
  GRAVITY: 1750,           // px/s^2 (leggermente più ariosa per salti ampi)
  MAX_FALL_SPEED: 950,     // px/s (velocità terminale)

  // Movimento orizzontale
  WALK_SPEED: 290,         // px/s
  RUN_SPEED: 450,          // px/s con tasto Shift
  ACCELERATION_GROUND: 1950,
  DECELERATION_GROUND: 2300,
  ACCELERATION_AIR: 1350,
  DECELERATION_AIR: 600,

  // Salto potenziato molto più alto e reattivo (stile Super Mario)
  JUMP_FORCE: -830,        // Salto potenziato (da -680 a -830: salto molto più alto e arioso)
  JUMP_CUT_LIMIT: -320,    // Taglio salto variabile per salti controllati
  COYOTE_TIME: 0.14,       // 140ms di tolleranza
  BOUNCE_FORCE: -540,      // Rimbalzo dopo stomp nemici

  // Limiti generali
  MIN_MOVE_EPSILON: 5,
};
