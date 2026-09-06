import { LevelData } from './types';

export const level7_egizio: LevelData = {
  id: 7,
  title: 'Livello 7 — Museo Egizio & La Cripta dei Faraoni',
  subtitle: 'Sarcofagi Millenari, Trappole di Granito Nero e Misteri Sabaudi',
  theme: 'egizio',
  width: 6000,
  height: 720,
  timeLimit: 230,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Galleria dei Re e Ingresso Monumentale
    { id: 'eg7_ground_1', x: 0, y: 580, width: 950, height: 140, style: 'brick' },

    // Blocchi geroglifici sorpresa
    { id: 'eg7_brick_1', x: 380, y: 440, width: 36, height: 36, style: 'brick' },
    { id: 'eg7_q_1', x: 416, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },
    { id: 'eg7_brick_2', x: 452, y: 440, width: 36, height: 36, style: 'brick' },

    // Piattaforme in pietra arenaria sopra i sarcofagi
    { id: 'eg7_sarc_1', x: 620, y: 470, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'eg7_sarc_2', x: 820, y: 390, width: 130, height: 22, isOneWay: true, style: 'stone_portico' },

    // Cassa sarcofago rompibile
    { id: 'eg7_crate_1', x: 920, y: 544, width: 36, height: 36, isBreakable: true },

    // Fossa 1: Spuntoni acuminati nella fossa e piattaforma mobile
    {
      id: 'eg7_moving_1',
      x: 1120,
      y: 460,
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'stone_portico',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 100,
      moveSpeed: 1.8,
    },

    // 2. Tempio di Ellesija (Saletta delle Divinità)
    { id: 'eg7_ground_2', x: 1380, y: 580, width: 900, height: 140, style: 'brick' },
    // Spuntoni sul pavimento del tempio
    { id: 'eg7_spikes_1', x: 1560, y: 562, width: 80, height: 18, isSpikeHazard: true },
    { id: 'eg7_q_2', x: 1720, y: 410, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'eg7_statue_1', x: 1850, y: 460, width: 140, height: 22, isOneWay: true, style: 'marble' },
    { id: 'eg7_statue_2', x: 2050, y: 380, width: 130, height: 22, isOneWay: true, style: 'marble' },

    // Molla per saltare sopra gli spuntoni
    { id: 'eg7_bouncer_1', x: 2180, y: 550, width: 64, height: 30, isBouncer: true },

    // Fossa 2: Piattaforme traballanti sopra il baratro della tomba
    { id: 'eg7_crumb_1', x: 2380, y: 450, width: 85, height: 22, isCrumbling: true },
    {
      id: 'eg7_moving_2',
      x: 2540,
      y: 430,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'stone_portico',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 90,
      moveSpeed: 1.7,
    },
    { id: 'eg7_crumb_2', x: 2730, y: 440, width: 85, height: 22, isCrumbling: true },

    // 3. Sala delle Mummie e dei Papiri
    { id: 'eg7_ground_3', x: 2900, y: 580, width: 950, height: 140, style: 'brick' },
    { id: 'eg7_crate_2', x: 3080, y: 544, width: 36, height: 36, isBreakable: true },
    { id: 'eg7_q_3', x: 3200, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'eg7_papyrus_1', x: 3340, y: 470, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'eg7_papyrus_2', x: 3540, y: 390, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },

    // Fossa 3: Spuntoni e doppia piattaforma cedevole
    { id: 'eg7_spikes_2', x: 3880, y: 562, width: 90, height: 18, isSpikeHazard: true },
    { id: 'eg7_crumb_3', x: 4050, y: 460, width: 90, height: 22, isCrumbling: true },
    {
      id: 'eg7_moving_3',
      x: 4220,
      y: 430,
      width: 115,
      height: 22,
      isOneWay: true,
      style: 'stone_portico',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 100,
      moveSpeed: 1.9,
    },

    // 4. Salone di Sekhmet e Traguardo della Piramide
    { id: 'eg7_ground_4', x: 4480, y: 580, width: 1520, height: 140, style: 'brick' },
    { id: 'eg7_crate_3', x: 4680, y: 544, width: 36, height: 36, isBreakable: true },
    { id: 'eg7_q_4', x: 4800, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },
    { id: 'eg7_pyramid_step_1', x: 4950, y: 480, width: 150, height: 24, isOneWay: true, style: 'marble' },
    { id: 'eg7_pyramid_step_2', x: 5180, y: 400, width: 160, height: 24, isOneWay: true, style: 'marble' },
    { id: 'eg7_pyramid_step_3', x: 5400, y: 320, width: 150, height: 24, isOneWay: true, style: 'marble' },
  ],

  checkpoints: [
    { id: 'cp_egizio_1', x: 1480, y: 495 },
    { id: 'cp_egizio_2', x: 4550, y: 495 },
  ],

  collectibles: [
    { id: 'eg7_c1', type: 'gianduiotto', x: 260, y: 530 },
    { id: 'eg7_c2', type: 'gianduiotto', x: 650, y: 430 },
    { id: 'eg7_c3', type: 'gianduiotto', x: 850, y: 350 },
    { id: 'eg7_c4', type: 'gianduiotto', x: 1880, y: 420 },
    { id: 'eg7_c5', type: 'gianduiotto', x: 2080, y: 340 },
    { id: 'eg7_c6', type: 'gianduiotto', x: 3380, y: 430 },
    { id: 'eg7_c7', type: 'gianduiotto', x: 3580, y: 350 },
    { id: 'eg7_c8', type: 'gianduiotto', x: 4980, y: 440 },
    { id: 'eg7_c9', type: 'gianduiotto', x: 5220, y: 360 },
    { id: 'eg7_c10', type: 'gianduiotto', x: 5440, y: 280 },
  ],

  enemies: [
    { id: 'eg7_pig_1', type: 'pigeon', x: 480, y: 546, patrolLeft: 380, patrolRight: 620 },
    { id: 'eg7_vigile_1', type: 'vigile', x: 780, y: 538, patrolLeft: 680, patrolRight: 920 },
    { id: 'eg7_rider_1', type: 'rider', x: 1650, y: 538, patrolLeft: 1520, patrolRight: 1820 },
    { id: 'eg7_angry_1', type: 'angryLocal', x: 1980, y: 538, patrolLeft: 1850, patrolRight: 2150 },
    { id: 'eg7_gabbiano_1', type: 'gabbiano', x: 2580, y: 260, patrolLeft: 2450, patrolRight: 2750 },
    { id: 'eg7_vigile_2', type: 'vigile', x: 3150, y: 538, patrolLeft: 3020, patrolRight: 3320 },
    { id: 'eg7_rider_2', type: 'rider', x: 3600, y: 538, patrolLeft: 3450, patrolRight: 3750 },
    { id: 'eg7_angry_2', type: 'angryLocal', x: 4750, y: 538, patrolLeft: 4600, patrolRight: 4900 },
    { id: 'eg7_gabbiano_2', type: 'gabbiano', x: 5100, y: 250, patrolLeft: 4950, patrolRight: 5300 },
  ],

  goal: {
    x: 5750,
    y: 500,
  },
};
