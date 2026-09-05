import { LevelData } from './types';

export const level1_centro: LevelData = {
  id: 1,
  title: 'Livello 1 — Centro di Torino',
  subtitle: 'Piazza Castello, Portici Sabaudi e Tram Storico',
  theme: 'centro',
  width: 4200,
  height: 720,
  timeLimit: 300,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // Terreno principale Piazza Castello
    { id: 'ground_1', x: 0, y: 580, width: 1250, height: 140, style: 'ground_pave' },

    // BLOCCHI SORPRESA "?" STILE SUPER MARIO (Piazza Castello)
    { id: 'q_block_1', x: 360, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'gianduiotto' },
    { id: 'brick_1', x: 396, y: 430, width: 36, height: 36, style: 'brick' },
    { id: 'q_block_2', x: 432, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'brick_2', x: 468, y: 430, width: 36, height: 36, style: 'brick' },
    { id: 'q_block_3', x: 504, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },

    // Portici e gradini di Palazzo Madama
    { id: 'plat_portico_1', x: 620, y: 390, width: 150, height: 24, isOneWay: true, style: 'stone_portico' },
    { id: 'plat_portico_2', x: 860, y: 430, width: 150, height: 24, isOneWay: true, style: 'stone_portico' },

    // Fossa e passaggio
    { id: 'ground_2', x: 1350, y: 580, width: 750, height: 140, style: 'ground_pave' },
    { id: 'step_madama_1', x: 1550, y: 470, width: 150, height: 24, isOneWay: true, style: 'marble' },
    { id: 'q_block_4', x: 1720, y: 340, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' },
    { id: 'step_madama_2', x: 1800, y: 390, width: 160, height: 24, isOneWay: true, style: 'marble' },

    // Zona Binari del Tram GTT (il tram passa sotto, i portici sopra)
    { id: 'ground_tram', x: 2180, y: 580, width: 850, height: 140, style: 'ground_pave' },
    { id: 'portico_tram_1', x: 2240, y: 430, width: 160, height: 24, isOneWay: true, style: 'stone_portico' },
    { id: 'portico_tram_roof', x: 2480, y: 340, width: 180, height: 24, isOneWay: true, style: 'marble' },
    { id: 'q_block_5', x: 2550, y: 220, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },
    { id: 'portico_tram_2', x: 2740, y: 430, width: 160, height: 24, isOneWay: true, style: 'stone_portico' },

    // Sezione Palazzo Reale finale
    { id: 'ground_palazzo', x: 3120, y: 580, width: 1080, height: 140, style: 'ground_pave' },
    { id: 'reale_step_1', x: 3280, y: 470, width: 130, height: 24, isOneWay: true, style: 'marble' },
    { id: 'reale_step_2', x: 3480, y: 390, width: 130, height: 24, isOneWay: true, style: 'marble' },
    { id: 'q_block_6', x: 3530, y: 270, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'reale_step_3', x: 3680, y: 460, width: 140, height: 24, isOneWay: true, style: 'marble' },
  ],

  checkpoints: [
    { id: 'toret_1', x: 1400, y: 532 },
    { id: 'toret_2', x: 3170, y: 532 },
  ],

  collectibles: [
    { id: 'g_1', type: 'gianduiotto', x: 280, y: 540 },
    { id: 'c_1', type: 'marijuana', x: 670, y: 350 },
    { id: 'g_2', type: 'gianduiotto', x: 920, y: 390 },
    { id: 'c_2', type: 'funghetti', x: 1870, y: 350 },
    { id: 'g_3', type: 'gianduiotto', x: 2300, y: 390 },
    { id: 'c_3', type: 'cocaina', x: 2540, y: 300 },
    { id: 'g_4', type: 'gianduiotto', x: 2800, y: 390 },
    { id: 'c_4', type: 'md', x: 3320, y: 430 },
    { id: 'c_5', type: 'lsd', x: 3720, y: 420 },
  ],

  enemies: [
    { id: 'pigeon_1', type: 'pigeon', x: 500, y: 554, patrolLeft: 400, patrolRight: 750 },
    { id: 'pigeon_2', type: 'pigeon', x: 1600, y: 554, patrolLeft: 1450, patrolRight: 1900 },
    { id: 'tram_1', type: 'tram', x: 2260, y: 530, patrolLeft: 2220, patrolRight: 2850 },
    { id: 'angry_1', type: 'angryLocal', x: 3420, y: 536, patrolLeft: 3260, patrolRight: 3700 },
  ],

  goal: {
    x: 4020,
    y: 500,
  },
};
