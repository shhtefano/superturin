import { LevelData } from './types';

export const level5_sancarlo: LevelData = {
  id: 5,
  title: 'Livello 5 — Piazza San Carlo & I Salotti Reali',
  subtitle: 'Il Caval \'d Brôns, i Caffè Storici e i Portici Barocchi di Via Roma',
  theme: 'sancarlo',
  width: 5900,
  height: 720,
  timeLimit: 230,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Ingresso da Via Roma Nord
    { id: 'sc5_ground_1', x: 0, y: 580, width: 1050, height: 140, style: 'marble' },

    // Blocchi sorpresa stile porticato reale
    { id: 'sc5_brick_1', x: 380, y: 440, width: 36, height: 36, style: 'brick' },
    { id: 'sc5_q_1', x: 416, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'sc5_brick_2', x: 452, y: 440, width: 36, height: 36, style: 'brick' },

    // Porticato di marmo sopra i tavolini del caffè
    { id: 'sc5_portico_1', x: 620, y: 460, width: 130, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'sc5_portico_2', x: 800, y: 390, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },

    // Cassa di torrefazione caffè torinese rompibile
    { id: 'sc5_crate_1', x: 970, y: 544, width: 36, height: 36, isBreakable: true },

    // Fossa 1: Passaggio dei tram con piattaforma mobile orizzontale
    {
      id: 'sc5_moving_1',
      x: 1180,
      y: 460,
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 110,
      moveSpeed: 1.8,
    },

    // 2. Il Monumento Equestre di Emanuele Filiberto (Caval 'd Brôns)
    { id: 'sc5_ground_2', x: 1450, y: 580, width: 950, height: 140, style: 'marble' },
    { id: 'sc5_monument_base', x: 1680, y: 520, width: 160, height: 60, style: 'stone_portico' },
    { id: 'sc5_q_2', x: 1740, y: 380, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' },
    { id: 'sc5_monument_top', x: 1880, y: 440, width: 140, height: 22, isOneWay: true, style: 'marble' },

    // Molla elegante per balzare sui lampioni di Piazza San Carlo
    { id: 'sc5_bouncer_1', x: 2150, y: 550, width: 64, height: 30, isBouncer: true },
    { id: 'sc5_lamp_1', x: 2240, y: 360, width: 120, height: 20, isOneWay: true, style: 'stone_portico' },

    // Fossa 2: Piattaforma mobile verticale tra le arcate
    {
      id: 'sc5_moving_2',
      x: 2470,
      y: 470,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'stone_portico',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 100,
      moveSpeed: 1.6,
    },

    // 3. I Caffè Storici (Caffè Torino e San Carlo)
    { id: 'sc5_ground_3', x: 2680, y: 580, width: 950, height: 140, style: 'marble' },
    { id: 'sc5_cafe_terrace', x: 2880, y: 480, width: 160, height: 24, isOneWay: true, style: 'wood_dock' },
    { id: 'sc5_q_3', x: 2950, y: 350, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },
    { id: 'sc5_cafe_roof', x: 3120, y: 410, width: 150, height: 22, isOneWay: true, style: 'stone_portico' },

    // Fossa 3: Spuntoni dissuasori e piattaforma traballante
    { id: 'sc5_crumb_1', x: 3720, y: 450, width: 85, height: 20, isCrumbling: true },
    { id: 'sc5_crumb_2', x: 3880, y: 420, width: 85, height: 20, isCrumbling: true },

    // 4. Chiese Gemelle di Santa Cristina e San Carlo (Piazzale Sud)
    { id: 'sc5_ground_4', x: 4050, y: 580, width: 900, height: 140, style: 'marble' },
    { id: 'sc5_crate_2', x: 4220, y: 544, width: 36, height: 36, isBreakable: true },
    { id: 'sc5_q_4', x: 4350, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'sc5_facade_1', x: 4480, y: 460, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'sc5_facade_2', x: 4680, y: 380, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },

    // Passerella Traguardo verso Via Roma Sud
    { id: 'sc5_ground_goal', x: 5050, y: 580, width: 850, height: 140, style: 'marble' },
  ],

  checkpoints: [
    { id: 'cp_sancarlo_1', x: 1550, y: 495 },
    { id: 'cp_sancarlo_2', x: 4150, y: 495 },
  ],

  collectibles: [
    { id: 'sc5_c1', type: 'gianduiotto', x: 280, y: 530 },
    { id: 'sc5_c2', type: 'gianduiotto', x: 650, y: 420 },
    { id: 'sc5_c3', type: 'gianduiotto', x: 830, y: 350 },
    { id: 'sc5_c4', type: 'gianduiotto', x: 1720, y: 480 },
    { id: 'sc5_c5', type: 'gianduiotto', x: 1920, y: 400 },
    { id: 'sc5_c6', type: 'gianduiotto', x: 2270, y: 320 },
    { id: 'sc5_c7', type: 'gianduiotto', x: 2920, y: 440 },
    { id: 'sc5_c8', type: 'gianduiotto', x: 3160, y: 370 },
    { id: 'sc5_c9', type: 'gianduiotto', x: 4520, y: 420 },
    { id: 'sc5_c10', type: 'gianduiotto', x: 4720, y: 340 },
  ],

  enemies: [
    { id: 'sc5_pig_1', type: 'pigeon', x: 500, y: 546, patrolLeft: 400, patrolRight: 680 },
    { id: 'sc5_vigile_1', type: 'vigile', x: 750, y: 538, patrolLeft: 650, patrolRight: 950 },
    { id: 'sc5_rider_1', type: 'rider', x: 1580, y: 538, patrolLeft: 1480, patrolRight: 1880 },
    { id: 'sc5_angry_1', type: 'angryLocal', x: 2020, y: 538, patrolLeft: 1900, patrolRight: 2180 },
    { id: 'sc5_gabbiano_1', type: 'gabbiano', x: 2320, y: 260, patrolLeft: 2200, patrolRight: 2500 },
    { id: 'sc5_vigile_2', type: 'vigile', x: 2850, y: 538, patrolLeft: 2750, patrolRight: 3050 },
    { id: 'sc5_rider_2', type: 'rider', x: 3300, y: 538, patrolLeft: 3150, patrolRight: 3550 },
    { id: 'sc5_angry_2', type: 'angryLocal', x: 4300, y: 538, patrolLeft: 4150, patrolRight: 4500 },
    { id: 'sc5_vigile_3', type: 'vigile', x: 5200, y: 538, patrolLeft: 5080, patrolRight: 5450 },
  ],

  goal: {
    x: 5550,
    y: 500,
  },
};
