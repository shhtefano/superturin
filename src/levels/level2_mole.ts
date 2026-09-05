import { LevelData } from './types';

export const level2_mole: LevelData = {
  id: 2,
  title: 'Livello 2 — La Mole Antonelliana',
  subtitle: 'Salita Verticale tra Mattoni Sabaudi e Ascensori Panoramici',
  theme: 'mole',
  width: 3800,
  height: 720,
  timeLimit: 320,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // Base d'ingresso della Mole
    { id: 'mole_base_1', x: 0, y: 580, width: 850, height: 140, style: 'brick' },

    // Blocchi interrogativi d'inizio
    { id: 'm_q_1', x: 320, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'gianduiotto' },
    { id: 'm_brick_1', x: 356, y: 430, width: 36, height: 36, style: 'brick' },
    { id: 'm_q_2', x: 392, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },

    // ASCENSORE PANORAMICO 1 (Piattaforma mobile verticale)
    {
      id: 'mole_lift_1',
      x: 950,
      y: 480,
      width: 120,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 130,
      moveSpeed: 1.8,
    },

    // Terrazza Loggiato Inferiore
    { id: 'mole_terrace_1', x: 1180, y: 380, width: 650, height: 340, style: 'brick' },
    { id: 'm_q_3', x: 1350, y: 250, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'm_q_4', x: 1550, y: 250, width: 36, height: 36, isQuestionBlock: true, questionContent: 'gianduiotto' },

    // ASCENSORE PANORAMICO 2 (Piattaforma mobile orizzontale)
    {
      id: 'mole_lift_2',
      x: 1980,
      y: 350,
      width: 130,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 120,
      moveSpeed: 1.6,
    },

    // Struttura Tempietto superiore
    { id: 'mole_tempietto', x: 2280, y: 400, width: 700, height: 320, style: 'brick' },
    { id: 'tempietto_step_1', x: 2420, y: 300, width: 140, height: 22, isOneWay: true, style: 'marble' },
    { id: 'm_q_5', x: 2600, y: 190, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'tempietto_step_2', x: 2720, y: 240, width: 150, height: 22, isOneWay: true, style: 'marble' },

    // ASCENSORE 3: Verso la Guglia
    {
      id: 'mole_lift_3',
      x: 3100,
      y: 360,
      width: 120,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 140,
      moveSpeed: 2.0,
    },

    // Terrazza Sommitale con la Guglia
    { id: 'mole_spire_platform', x: 3320, y: 420, width: 480, height: 300, style: 'marble' },
  ],

  checkpoints: [
    { id: 'toret_mole', x: 1240, y: 332 },
  ],

  collectibles: [
    { id: 'mg_1', type: 'gianduiotto', x: 240, y: 540 },
    { id: 'mg_2', type: 'lsd', x: 990, y: 320 },
    { id: 'mg_3', type: 'gianduiotto', x: 1420, y: 340 },
    { id: 'mg_4', type: 'md', x: 1680, y: 340 },
    { id: 'mg_5', type: 'marijuana', x: 2020, y: 280 },
    { id: 'mg_6', type: 'gianduiotto', x: 2460, y: 260 },
    { id: 'mg_7', type: 'cocaina', x: 2760, y: 200 },
    { id: 'mg_8', type: 'gianduiotto', x: 3420, y: 380 },
  ],

  enemies: [
    { id: 'mole_pigeon_1', type: 'pigeon', x: 450, y: 554, patrolLeft: 380, patrolRight: 720 },
    { id: 'mole_pigeon_2', type: 'pigeon', x: 1380, y: 354, patrolLeft: 1280, patrolRight: 1720 },
    { id: 'mole_angry_1', type: 'angryLocal', x: 2480, y: 356, patrolLeft: 2360, patrolRight: 2850 },
  ],

  goal: {
    x: 3620,
    y: 340,
  },
};
