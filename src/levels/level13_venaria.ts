import { LevelData } from './types';

export const level13_venaria: LevelData = {
  id: 13,
  title: 'Livello 13 — Reggia di Venaria Reale & I Giardini',
  subtitle: 'La Galleria Grande di Juvarra, La Fontana d\'Ercole e la Corte d\'Onore',
  theme: 'venaria',
  width: 6800,
  height: 720,
  timeLimit: 290,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Ingresso dalla Corte d'Onore della Reggia di Venaria
    { id: 'v13_ground_1', x: 0, y: 580, width: 1050, height: 140, style: 'marble' },

    // Blocchi sorpresa dorati sabaudi
    { id: 'v13_brick_1', x: 360, y: 440, width: 36, height: 36, style: 'marble' },
    { id: 'v13_q1', x: 396, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'gianduiotto' },
    { id: 'v13_brick_2', x: 432, y: 440, width: 36, height: 36, style: 'marble' },

    // Scaloni monumentali della Corte
    { id: 'v13_step_1', x: 650, y: 480, width: 130, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'v13_step_2', x: 840, y: 410, width: 130, height: 22, isOneWay: true, style: 'stone_portico' },

    // Piattaforma dorata mobile a dondolo reale
    {
      id: 'v13_reale_move_1',
      x: 1060,
      y: 430,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'stone_portico',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 100,
      moveSpeed: 2.1,
    },

    // 2. La Galleria Grande (Galleria di Diana) - Pavimenti a scacchiera bianchi e neri
    { id: 'v13_ground_gallery', x: 1240, y: 560, width: 1300, height: 160, style: 'marble' },
    { id: 'v13_q2', x: 1440, y: 420, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'v13_crate_1', x: 1620, y: 524, width: 36, height: 36, isBreakable: true },

    // Cornici e balconate marmoree juvarriane alte
    { id: 'v13_cornice_1', x: 1780, y: 440, width: 140, height: 22, isOneWay: true, style: 'marble' },
    { id: 'v13_cornice_2', x: 1980, y: 370, width: 140, height: 22, isOneWay: true, style: 'marble' },
    { id: 'v13_q3', x: 2030, y: 270, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },

    // Zampillo d'acqua fontana reale (Molla bouncer potente!)
    { id: 'v13_bounce_water_1', x: 2220, y: 540, width: 48, height: 20, isBouncer: true },
    { id: 'v13_crumb_1', x: 2360, y: 390, width: 85, height: 20, isCrumbling: true },

    // Piattaforma mobile verticale
    {
      id: 'v13_reale_move_2',
      x: 2500,
      y: 420,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'stone_portico',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 95,
      moveSpeed: 2.3,
    },

    // 3. I Giardini Reali Bassi & Il Labirinto di Siepi
    { id: 'v13_ground_gardens', x: 2680, y: 570, width: 1350, height: 150, style: 'ground_grass' },

    // Siepi geometriche come piattaforme sopraelevate
    { id: 'v13_hedge_1', x: 2880, y: 460, width: 140, height: 24, isOneWay: true, style: 'ground_grass' },
    { id: 'v13_q4', x: 2930, y: 360, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },
    { id: 'v13_hedge_2', x: 3160, y: 430, width: 150, height: 24, isOneWay: true, style: 'ground_grass' },
    { id: 'v13_crate_2', x: 3400, y: 534, width: 36, height: 36, isBreakable: true },

    // Vasca d'acqua con spuntoni / cigni difensivi
    { id: 'v13_spike_1', x: 3580, y: 550, width: 80, height: 20, isSpikeHazard: true },
    { id: 'v13_bounce_water_2', x: 3720, y: 550, width: 48, height: 20, isBouncer: true },
    { id: 'v13_crumb_2', x: 3840, y: 410, width: 85, height: 20, isCrumbling: true },

    // Piattaforma mobile che attraversa il Canale d'Ercole
    {
      id: 'v13_reale_move_3',
      x: 3980,
      y: 430,
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 120,
      moveSpeed: 2.5,
    },

    // 4. Parco Alto & Scuderie Juvarriane
    { id: 'v13_ground_stables', x: 4200, y: 560, width: 1100, height: 160, style: 'brick' },
    { id: 'v13_q5', x: 4380, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'v13_stable_loft_1', x: 4580, y: 440, width: 140, height: 22, isOneWay: true, style: 'wood_dock' },
    { id: 'v13_stable_loft_2', x: 4800, y: 380, width: 150, height: 22, isOneWay: true, style: 'wood_dock' },
    { id: 'v13_crumb_3', x: 5040, y: 440, width: 85, height: 20, isCrumbling: true },

    // 5. Fontana d'Ercole e Piazzale Reale d'Onore
    { id: 'v13_ground_fountain', x: 5200, y: 560, width: 1550, height: 160, style: 'marble' },

    // Terrazze d'acqua e marmo della Fontana d'Ercole
    { id: 'v13_fountain_tier_1', x: 5460, y: 450, width: 160, height: 24, isOneWay: true, style: 'marble' },
    { id: 'v13_fountain_tier_2', x: 5740, y: 390, width: 180, height: 24, isOneWay: true, style: 'marble' },
    { id: 'v13_fountain_tier_3', x: 6050, y: 450, width: 160, height: 24, isOneWay: true, style: 'marble' },
  ],

  checkpoints: [
    { id: 'v13_cp1', x: 2700, y: 530 },
    { id: 'v13_cp2', x: 5220, y: 520 },
  ],

  collectibles: [
    { id: 'v13_c1', type: 'gianduiotto', x: 280, y: 530 },
    { id: 'v13_c2', type: 'gianduiotto', x: 890, y: 360 },
    { id: 'v13_c3', type: 'gianduiotto', x: 1500, y: 510 },
    { id: 'v13_c4', type: 'gianduiotto', x: 2030, y: 220 },
    { id: 'v13_c5', type: 'gianduiotto', x: 2940, y: 310 },
    { id: 'v13_c6', type: 'gianduiotto', x: 3200, y: 380 },
    { id: 'v13_c7', type: 'gianduiotto', x: 4420, y: 510 },
    { id: 'v13_c8', type: 'gianduiotto', x: 4850, y: 330 },
    { id: 'v13_c9', type: 'gianduiotto', x: 5780, y: 330 },
    { id: 'v13_c10', type: 'gianduiotto', x: 6350, y: 510 },
  ],

  enemies: [
    { id: 'v13_e_vigile_1', type: 'vigile', x: 520, y: 536, patrolLeft: 420, patrolRight: 640 },
    { id: 'v13_e_angry_1', type: 'angryLocal', x: 1550, y: 516, patrolLeft: 1420, patrolRight: 1680 },
    { id: 'v13_e_rider_1', type: 'rider', x: 2850, y: 528, patrolLeft: 2720, patrolRight: 3050 },
    { id: 'v13_e_vigile_2', type: 'vigile', x: 3300, y: 526, patrolLeft: 3180, patrolRight: 3450 },
    { id: 'v13_e_cinghiale_1', type: 'cinghiale', x: 4400, y: 518, patrolLeft: 4250, patrolRight: 4580 },
    { id: 'v13_e_angry_2', type: 'angryLocal', x: 4720, y: 516, patrolLeft: 4620, patrolRight: 4880 },
    { id: 'v13_e_rider_2', type: 'rider', x: 5400, y: 518, patrolLeft: 5280, patrolRight: 5580 },
    { id: 'v13_e_vigile_3', type: 'vigile', x: 5900, y: 516, patrolLeft: 5780, patrolRight: 6100 },
  ],

  goal: {
    x: 6520,
    y: 480,
  },
};
