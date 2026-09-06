import { LevelData } from './types';

export const level10_statuto: LevelData = {
  id: 10,
  title: 'Livello 10 — Piazza Statuto & I Sotterranei Alchemici',
  subtitle: 'Il Vertice della Magia Nera, Fiamme Sotterranee e lo Scontro Finale col Toro Alchemico',
  theme: 'alchimia',
  width: 6800,
  height: 720,
  timeLimit: 260,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Ingresso all'Obelisco Geodetico di Piazza Statuto
    { id: 'st10_ground_1', x: 0, y: 580, width: 900, height: 140, style: 'brick' },

    // Blocchi alchemici esoterici
    { id: 'st10_brick_1', x: 380, y: 440, width: 36, height: 36, style: 'brick' },
    { id: 'st10_q_1', x: 416, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },
    { id: 'st10_brick_2', x: 452, y: 440, width: 36, height: 36, style: 'brick' },

    // Piastre di ferro battuto sopra la bocca della discesa sotterranea
    { id: 'st10_beam_1', x: 600, y: 460, width: 130, height: 22, isOneWay: true, style: 'steel_beam' },
    { id: 'st10_beam_2', x: 760, y: 390, width: 130, height: 22, isOneWay: true, style: 'steel_beam' },

    // Spuntoni acuminati di magia nera
    { id: 'st10_spikes_1', x: 800, y: 562, width: 90, height: 18, isSpikeHazard: true },

    // Fossa 1: Baratro alchemico con piattaforma mobile veloce
    {
      id: 'st10_moving_1',
      x: 1020,
      y: 460,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'steel_beam',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 120,
      moveSpeed: 2.1,
    },

    // 2. Discesa nelle Grotte Alchemiche
    { id: 'st10_ground_2', x: 1300, y: 580, width: 850, height: 140, style: 'brick' },
    { id: 'st10_crate_1', x: 1460, y: 544, width: 36, height: 36, isBreakable: true },
    { id: 'st10_q_2', x: 1560, y: 410, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'st10_rock_1', x: 1700, y: 460, width: 140, height: 24, isOneWay: true, style: 'stone_portico' },
    { id: 'st10_rock_2', x: 1900, y: 380, width: 140, height: 24, isOneWay: true, style: 'stone_portico' },

    // Bouncer alchemico per balzare su pilastri elevati
    { id: 'st10_bouncer_1', x: 2050, y: 550, width: 64, height: 30, isBouncer: true },

    // Fossa 2: Serie di piattaforme cedevoli traballanti
    { id: 'st10_crumb_1', x: 2280, y: 450, width: 80, height: 20, isCrumbling: true },
    {
      id: 'st10_moving_2',
      x: 2440,
      y: 430,
      width: 105,
      height: 22,
      isOneWay: true,
      style: 'steel_beam',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 110,
      moveSpeed: 1.8,
    },
    { id: 'st10_crumb_2', x: 2620, y: 440, width: 80, height: 20, isCrumbling: true },

    // 3. Fucina delle Transmutazioni
    { id: 'st10_ground_3', x: 2800, y: 580, width: 950, height: 140, style: 'brick' },
    { id: 'st10_spikes_2', x: 2980, y: 562, width: 100, height: 18, isSpikeHazard: true },
    { id: 'st10_crate_2', x: 3180, y: 544, width: 36, height: 36, isBreakable: true },
    { id: 'st10_q_3', x: 3260, y: 420, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'st10_forge_1', x: 3380, y: 460, width: 140, height: 24, isOneWay: true, style: 'steel_beam' },
    { id: 'st10_forge_2', x: 3580, y: 380, width: 140, height: 24, isOneWay: true, style: 'steel_beam' },

    // Fossa 3: Spuntoni e piattaforme mobili incrociate
    { id: 'st10_spikes_3', x: 3820, y: 562, width: 110, height: 18, isSpikeHazard: true },
    { id: 'st10_crumb_3', x: 4020, y: 450, width: 80, height: 20, isCrumbling: true },
    {
      id: 'st10_moving_3',
      x: 4180,
      y: 430,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'steel_beam',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 110,
      moveSpeed: 2.0,
    },
    { id: 'st10_crumb_4', x: 4360, y: 450, width: 80, height: 20, isCrumbling: true },

    // 4. L'Atrio della Cupola Alchemica
    { id: 'st10_ground_4', x: 4550, y: 580, width: 800, height: 140, style: 'brick' },
    { id: 'st10_crate_3', x: 4720, y: 544, width: 36, height: 36, isBreakable: true },
    { id: 'st10_q_4', x: 4820, y: 420, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },
    { id: 'st10_pillar_1', x: 4960, y: 470, width: 150, height: 24, isOneWay: true, style: 'stone_portico' },
    { id: 'st10_pillar_2', x: 5180, y: 390, width: 150, height: 24, isOneWay: true, style: 'stone_portico' },

    // =========================================================================
    // 5. GRANDE ARENA DEL BOSS FINALE: IL TORO ALCHEMICO (TAURUS INVICTUS)
    // Ampia piattaforma continua e pedane sopraelevate per manovre aeree
    // =========================================================================
    { id: 'st10_boss_arena', x: 5480, y: 580, width: 1320, height: 140, style: 'brick' },
    // Pedane sopraelevate per schivare le cariche violente del Toro
    { id: 'st10_arena_plat_1', x: 5660, y: 450, width: 160, height: 24, isOneWay: true, style: 'stone_portico' },
    { id: 'st10_arena_q_boss', x: 5720, y: 340, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' },
    { id: 'st10_arena_plat_2', x: 6020, y: 400, width: 180, height: 24, isOneWay: true, style: 'stone_portico' },
    { id: 'st10_arena_plat_3', x: 6360, y: 450, width: 160, height: 24, isOneWay: true, style: 'stone_portico' },
  ],

  checkpoints: [
    { id: 'cp_statuto_1', x: 1380, y: 495 },
    { id: 'cp_statuto_2', x: 4650, y: 495 },
  ],

  collectibles: [
    { id: 'st10_c1', type: 'gianduiotto', x: 280, y: 530 },
    { id: 'st10_c2', type: 'gianduiotto', x: 630, y: 420 },
    { id: 'st10_c3', type: 'gianduiotto', x: 790, y: 350 },
    { id: 'st10_c4', type: 'gianduiotto', x: 1730, y: 420 },
    { id: 'st10_c5', type: 'gianduiotto', x: 1930, y: 340 },
    { id: 'st10_c6', type: 'gianduiotto', x: 3410, y: 420 },
    { id: 'st10_c7', type: 'gianduiotto', x: 3610, y: 340 },
    { id: 'st10_c8', type: 'gianduiotto', x: 5000, y: 430 },
    { id: 'st10_c9', type: 'gianduiotto', x: 5220, y: 350 },
    { id: 'st10_c10', type: 'gianduiotto', x: 6100, y: 360 },
  ],

  enemies: [
    { id: 'st10_pig_1', type: 'pigeon', x: 480, y: 546, patrolLeft: 380, patrolRight: 620 },
    { id: 'st10_angry_1', type: 'angryLocal', x: 720, y: 538, patrolLeft: 620, patrolRight: 880 },
    { id: 'st10_rider_1', type: 'rider', x: 1550, y: 538, patrolLeft: 1420, patrolRight: 1750 },
    { id: 'st10_robot_1', type: 'robotLingotto', x: 1820, y: 538, patrolLeft: 1720, patrolRight: 2020 },
    { id: 'st10_gabbiano_1', type: 'gabbiano', x: 2500, y: 260, patrolLeft: 2350, patrolRight: 2750 },
    { id: 'st10_cinghiale_1', type: 'cinghiale', x: 3250, y: 538, patrolLeft: 3100, patrolRight: 3500 },
    { id: 'st10_robot_2', type: 'robotLingotto', x: 4780, y: 538, patrolLeft: 4650, patrolRight: 4950 },
    { id: 'st10_rider_2', type: 'rider', x: 5120, y: 538, patrolLeft: 4980, patrolRight: 5320 },

    // =========================================================================
    // BOSS FINALE DEL GIOCO: IL TORO ALCHEMICO SABAUDO (8 HP)
    // =========================================================================
    {
      id: 'statuto_final_boss',
      type: 'bossToro',
      x: 6100,
      y: 504,
      patrolLeft: 5650,
      patrolRight: 6600,
    },
  ],

  goal: {
    x: 6650,
    y: 500,
  },
};
