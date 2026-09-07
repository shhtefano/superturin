import { LevelData } from './types';

export const level12_cappuccini: LevelData = {
  id: 12,
  title: 'Livello 12 — Monte dei Cappuccini & Gran Madre',
  subtitle: 'Piazza Vittorio, Il Ponte sul Po e la Salita Notturna al Convento',
  theme: 'cappuccini',
  width: 6800,
  height: 720,
  timeLimit: 280,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Partenza da Piazza Vittorio Veneto e imbocco del Ponte Vittorio Emanuele I
    { id: 'c12_ground_1', x: 0, y: 580, width: 1050, height: 140, style: 'ground_pave' },

    // Blocchi sorpresa con power-up
    { id: 'c12_brick_1', x: 380, y: 440, width: 36, height: 36, style: 'stone_portico' },
    { id: 'c12_q1', x: 416, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' },
    { id: 'c12_brick_2', x: 452, y: 440, width: 36, height: 36, style: 'stone_portico' },

    // Arcate del Ponte sul Fiume Po
    { id: 'c12_bridge_arch_1', x: 680, y: 470, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'c12_bridge_arch_2', x: 880, y: 410, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },

    // Piattaforma-barcone ormeggiato sul Po mobile
    {
      id: 'c12_boat_move',
      x: 1080,
      y: 460,
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 90,
      moveSpeed: 2.1,
    },

    // 2. Scalinata monumentale della Chiesa della Gran Madre di Dio
    { id: 'c12_granmadre_base', x: 1280, y: 560, width: 750, height: 160, style: 'marble' },
    { id: 'c12_gm_step1', x: 1420, y: 480, width: 130, height: 20, isOneWay: true, style: 'marble' },
    { id: 'c12_gm_step2', x: 1580, y: 410, width: 140, height: 20, isOneWay: true, style: 'marble' },
    { id: 'c12_gm_q2', x: 1630, y: 310, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'c12_crate_1', x: 1800, y: 524, width: 36, height: 36, isBreakable: true },

    // Molla Sabauda per balzare sui sentieri della collina
    { id: 'c12_bounce_1', x: 1950, y: 540, width: 44, height: 20, isBouncer: true },

    // Sentiero franabile tra i pini della collina
    { id: 'c12_crumb_1', x: 2040, y: 430, width: 85, height: 20, isCrumbling: true },

    // 3. I Sentieri Boscosi del Monte dei Cappuccini
    { id: 'c12_ground_hill_1', x: 2180, y: 530, width: 1100, height: 190, style: 'ground_grass' },

    // Piattaforma mobile tra i tornanti alberati
    {
      id: 'c12_hill_move_1',
      x: 2420,
      y: 400,
      width: 115,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 85,
      moveSpeed: 2.2,
    },
    { id: 'c12_q3', x: 2600, y: 320, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },
    { id: 'c12_crate_2', x: 2780, y: 494, width: 36, height: 36, isBreakable: true },

    // Dirupo collinare con spuntoni di roccia
    { id: 'c12_spike_1', x: 3300, y: 570, width: 80, height: 20, isSpikeHazard: true },
    { id: 'c12_crumb_2', x: 3420, y: 460, width: 80, height: 20, isCrumbling: true },

    // Piattaforma funicolare panoramica mobile orizzontale
    {
      id: 'c12_funicular_move',
      x: 3550,
      y: 410,
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'dentiera_rail',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 130,
      moveSpeed: 2.6,
    },

    // 4. Parco di Villa Gualino e Salita alle Mura del Convento
    { id: 'c12_ground_hill_2', x: 3950, y: 510, width: 1150, height: 210, style: 'ground_grass' },
    { id: 'c12_q4', x: 4150, y: 390, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'c12_bounce_2', x: 4380, y: 490, width: 44, height: 20, isBouncer: true },
    { id: 'c12_crumb_3', x: 4520, y: 370, width: 85, height: 20, isCrumbling: true },

    // Salita ad altezze panoramiche
    { id: 'c12_terrace_step1', x: 4670, y: 430, width: 110, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'c12_terrace_step2', x: 4860, y: 360, width: 120, height: 22, isOneWay: true, style: 'stone_portico' },

    // 5. Terrazza Belvedere del Monte dei Cappuccini (Vista leggendaria su Torino e la Mole)
    { id: 'c12_ground_belvedere', x: 5080, y: 480, width: 1650, height: 240, style: 'marble' },

    // Balconata panoramica alta
    { id: 'c12_belvedere_roof_1', x: 5350, y: 340, width: 150, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'c12_belvedere_roof_2', x: 5650, y: 280, width: 180, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'c12_belvedere_roof_3', x: 6000, y: 340, width: 160, height: 22, isOneWay: true, style: 'stone_portico' },
  ],

  checkpoints: [
    { id: 'c12_cp1', x: 2200, y: 500 },
    { id: 'c12_cp2', x: 5120, y: 450 },
  ],

  collectibles: [
    { id: 'c12_c1', type: 'gianduiotto', x: 300, y: 530 },
    { id: 'c12_c2', type: 'gianduiotto', x: 740, y: 420 },
    { id: 'c12_c3', type: 'gianduiotto', x: 1470, y: 430 },
    { id: 'c12_c4', type: 'gianduiotto', x: 2260, y: 470 },
    { id: 'c12_c5', type: 'gianduiotto', x: 2610, y: 270 },
    { id: 'c12_c6', type: 'gianduiotto', x: 3600, y: 360 },
    { id: 'c12_c7', type: 'gianduiotto', x: 4200, y: 460 },
    { id: 'c12_c8', type: 'gianduiotto', x: 4900, y: 310 },
    { id: 'c12_c9', type: 'gianduiotto', x: 5720, y: 230 },
    { id: 'c12_c10', type: 'gianduiotto', x: 6300, y: 430 },
  ],

  enemies: [
    { id: 'c12_gabbiano_1', type: 'gabbiano', x: 600, y: 280, patrolLeft: 450, patrolRight: 850 },
    { id: 'c12_nutria_1', type: 'nutria', x: 920, y: 548, patrolLeft: 820, patrolRight: 1020 },
    { id: 'c12_cinghiale_1', type: 'cinghiale', x: 2350, y: 488, patrolLeft: 2240, patrolRight: 2520 },
    { id: 'c12_squirrel_1', type: 'squirrel', x: 2700, y: 488, patrolLeft: 2600, patrolRight: 2840 },
    { id: 'c12_gabbiano_2', type: 'gabbiano', x: 3500, y: 260, patrolLeft: 3350, patrolRight: 3750 },
    { id: 'c12_cinghiale_2', type: 'cinghiale', x: 4200, y: 468, patrolLeft: 4050, patrolRight: 4350 },
    { id: 'c12_squirrel_2', type: 'squirrel', x: 4750, y: 468, patrolLeft: 4650, patrolRight: 4880 },
    { id: 'c12_gabbiano_3', type: 'gabbiano', x: 5500, y: 220, patrolLeft: 5350, patrolRight: 5750 },
    { id: 'c12_cinghiale_3', type: 'cinghiale', x: 5800, y: 438, patrolLeft: 5650, patrolRight: 6150 },
  ],

  goal: {
    x: 6520,
    y: 400,
  },
};
