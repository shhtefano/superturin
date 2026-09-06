import { LevelData } from './types';

export const level1_centro: LevelData = {
  id: 1,
  title: 'Livello 1 — Centro di Torino',
  subtitle: 'Piazza Castello, Via Po e la Sfida dei Tram GTT',
  theme: 'centro',
  width: 5800,
  height: 720,
  timeLimit: 250,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Piazza Castello - Terreno iniziale
    { id: 'c1_ground_1', x: 0, y: 580, width: 1100, height: 140, style: 'ground_pave' },

    // Primi blocchi sorpresa rialzati (richiedono salto preciso)
    { id: 'c1_brick_1', x: 420, y: 440, width: 36, height: 36, style: 'brick' },
    { id: 'c1_q_1', x: 456, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'c1_brick_2', x: 492, y: 440, width: 36, height: 36, style: 'brick' },
    { id: 'c1_q_2', x: 528, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },

    // Portici di Palazzo Madama (scalata verticale)
    { id: 'c1_portico_1', x: 680, y: 450, width: 130, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'c1_portico_2', x: 880, y: 380, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'c1_portico_3', x: 1080, y: 300, width: 130, height: 22, isOneWay: true, style: 'stone_portico' },

    // Fossa 1: Baratro stradale con piattaforma mobile
    {
      id: 'c1_moving_1',
      x: 1280,
      y: 460,
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 100,
      moveSpeed: 1.6,
    },

    // 2. Zona Piazzetta Reale (Terreno 2)
    { id: 'c1_ground_2', x: 1540, y: 580, width: 750, height: 140, style: 'ground_pave' },
    { id: 'c1_step_1', x: 1720, y: 480, width: 120, height: 22, isOneWay: true, style: 'marble' },
    { id: 'c1_q_3', x: 1860, y: 360, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' },
    { id: 'c1_step_2', x: 1980, y: 440, width: 130, height: 22, isOneWay: true, style: 'marble' },

    // Fossa 2: Salto lungo con piattaforma oscillante verticale
    {
      id: 'c1_moving_2',
      x: 2360,
      y: 470,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'stone_portico',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 70,
      moveSpeed: 1.8,
    },

    // 3. Settore Binari di Via Po - TRAM MULTIPLI & PORTICI ALTI
    { id: 'c1_ground_tram_1', x: 2540, y: 580, width: 950, height: 140, style: 'ground_pave' },
    { id: 'c1_roof_tram_1', x: 2650, y: 430, width: 150, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'c1_roof_tram_2', x: 2880, y: 350, width: 160, height: 22, isOneWay: true, style: 'marble' },
    { id: 'c1_q_4', x: 2950, y: 230, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },
    { id: 'c1_roof_tram_3', x: 3120, y: 420, width: 150, height: 22, isOneWay: true, style: 'stone_portico' },

    // Fossa 3: Doppio baratro con gradini stretti
    { id: 'c1_pillar_1', x: 3560, y: 480, width: 80, height: 240, style: 'stone_portico' },
    { id: 'c1_pillar_2', x: 3720, y: 410, width: 80, height: 310, style: 'stone_portico' },
    { id: 'c1_pillar_3', x: 3880, y: 460, width: 80, height: 260, style: 'stone_portico' },

    // 4. Sezione Piazza San Carlo - Portici Monumentali
    { id: 'c1_ground_sancarlo', x: 4030, y: 580, width: 800, height: 140, style: 'ground_pave' },
    { id: 'c1_sc_step_1', x: 4180, y: 470, width: 140, height: 22, isOneWay: true, style: 'marble' },
    { id: 'c1_sc_q_5', x: 4340, y: 340, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'c1_sc_step_2', x: 4420, y: 410, width: 150, height: 22, isOneWay: true, style: 'marble' },
    { id: 'c1_sc_step_3', x: 4640, y: 350, width: 130, height: 22, isOneWay: true, style: 'stone_portico' },

    // Fossa Finale verso Palazzo Reale
    {
      id: 'c1_moving_3',
      x: 4900,
      y: 430,
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 90,
      moveSpeed: 2.0,
    },

    // Traguardo Finale Palazzo Reale
    { id: 'c1_ground_final', x: 5090, y: 580, width: 710, height: 140, style: 'ground_pave' },
    { id: 'c1_final_step', x: 5260, y: 480, width: 140, height: 22, isOneWay: true, style: 'marble' },
  ],

  checkpoints: [
    { id: 'toret_1', x: 1600, y: 532 },
    { id: 'toret_2', x: 4080, y: 532 },
  ],

  // Rari collezionabili posizionati in punti elevati / rischiosi
  collectibles: [
    { id: 'c1_g_1', type: 'gianduiotto', x: 1090, y: 260 }, // Alto sul portico
    { id: 'c1_g_2', type: 'gianduiotto', x: 2900, y: 310 }, // Sopra il tetto tram
    { id: 'c1_g_3', type: 'gianduiotto', x: 3730, y: 370 }, // Sopra il pilastro stretto
    { id: 'c1_g_4', type: 'gianduiotto', x: 4660, y: 310 }, // Alto su Piazza San Carlo
  ],

  enemies: [
    // Piazza Castello
    { id: 'pigeon_1', type: 'pigeon', x: 500, y: 554, patrolLeft: 380, patrolRight: 750 },
    { id: 'pigeon_1b', type: 'pigeon', x: 920, y: 354, patrolLeft: 880, patrolRight: 1010 },
    { id: 'angry_1', type: 'angryLocal', x: 880, y: 536, patrolLeft: 780, patrolRight: 1050 },

    // Piazzetta Reale
    { id: 'pigeon_2', type: 'pigeon', x: 1680, y: 554, patrolLeft: 1560, patrolRight: 1950 },
    { id: 'angry_1b', type: 'angryLocal', x: 2020, y: 536, patrolLeft: 1940, patrolRight: 2260 },

    // Via Po: Tram 1 veloce a terra, Tram 2 di pattuglia
    { id: 'tram_1', type: 'tram', x: 2600, y: 530, patrolLeft: 2540, patrolRight: 3100 },
    { id: 'pigeon_3', type: 'pigeon', x: 2920, y: 324, patrolLeft: 2880, patrolRight: 3040 },
    { id: 'angry_via_po', type: 'angryLocal', x: 3300, y: 536, patrolLeft: 3200, patrolRight: 3520 },

    // Piazza San Carlo
    { id: 'angry_2', type: 'angryLocal', x: 4200, y: 536, patrolLeft: 4050, patrolRight: 4500 },
    { id: 'pigeon_4', type: 'pigeon', x: 4440, y: 384, patrolLeft: 4420, patrolRight: 4570 },
    { id: 'angry_3', type: 'angryLocal', x: 5300, y: 536, patrolLeft: 5120, patrolRight: 5520 },
  ],

  goal: {
    x: 5620,
    y: 500,
  },
};
