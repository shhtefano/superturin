import { LevelData } from './types';

export const level2_mole: LevelData = {
  id: 2,
  title: 'Livello 2 — La Mole Antonelliana',
  subtitle: 'La Grande Scalata Verticale tra Ascensori nel Vuoto e la Guglia',
  theme: 'mole',
  width: 5600,
  height: 720,
  timeLimit: 260,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Ingresso e Base Monumentale
    { id: 'm_base_1', x: 0, y: 580, width: 850, height: 140, style: 'brick' },

    // Blocchi per preparare la scalata
    { id: 'm_brick_1', x: 380, y: 440, width: 36, height: 36, style: 'brick' },
    { id: 'm_q_1', x: 416, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' }, // Sblocca doppio salto
    { id: 'm_brick_2', x: 452, y: 440, width: 36, height: 36, style: 'brick' },

    // Scalini di marmo per raggiungere il primo ascensore
    { id: 'm_step_1', x: 620, y: 480, width: 130, height: 22, isOneWay: true, style: 'marble' },

    // ASCENSORE 1: Salita verticale rapida sopra il baratro
    {
      id: 'm_lift_1',
      x: 880,
      y: 460,
      width: 110,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 150,
      moveSpeed: 2.2,
    },

    // 2. Terrazza Intermedia 1 (Loggiato Alto)
    { id: 'm_terrace_1', x: 1080, y: 350, width: 680, height: 370, style: 'brick' },
    { id: 'm_q_2', x: 1280, y: 220, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'm_step_2', x: 1480, y: 250, width: 130, height: 22, isOneWay: true, style: 'marble' },

    // Fossa dei Mattoni: Doppio ascensore sincronizzato in controfase
    {
      id: 'm_lift_2a',
      x: 1840,
      y: 360,
      width: 100,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 90,
      moveSpeed: 1.8,
    },
    {
      id: 'm_lift_2b',
      x: 2100,
      y: 400,
      width: 100,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 130,
      moveSpeed: 2.0,
    },

    // 3. Settore Cupola - Piattaforme a gradoni e pilastri stretti
    { id: 'm_cupola_base', x: 2300, y: 430, width: 750, height: 290, style: 'brick' },
    { id: 'm_cupola_step_1', x: 2450, y: 320, width: 120, height: 22, isOneWay: true, style: 'marble' },
    { id: 'm_q_3', x: 2620, y: 200, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' },
    { id: 'm_cupola_step_2', x: 2750, y: 260, width: 140, height: 22, isOneWay: true, style: 'marble' },

    // Baratro del Tempietto: 2 Piattaforme mobili su assi incrociati
    {
      id: 'm_lift_3',
      x: 3120,
      y: 320,
      width: 110,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 140,
      moveSpeed: 2.3,
    },
    {
      id: 'm_lift_4',
      x: 3320,
      y: 260,
      width: 110,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 110,
      moveSpeed: 2.1,
    },

    // 4. Balconata del Tempietto Superiore
    { id: 'm_tempietto_plat', x: 3540, y: 380, width: 700, height: 340, style: 'brick' },
    { id: 'm_step_tempietto', x: 3720, y: 270, width: 130, height: 22, isOneWay: true, style: 'marble' },
    { id: 'm_q_4', x: 3900, y: 150, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },

    // Baratro della Guglia: Serie di 3 pilastri strettissimi nel vuoto
    { id: 'm_spire_pillar_1', x: 4320, y: 460, width: 70, height: 260, style: 'brick' },
    { id: 'm_spire_pillar_2', x: 4520, y: 380, width: 70, height: 340, style: 'brick' },
    { id: 'm_spire_pillar_3', x: 4720, y: 310, width: 70, height: 410, style: 'brick' },

    // ASCENSORE FINALE: Salita rapida verso la vetta della Guglia
    {
      id: 'm_lift_final',
      x: 4920,
      y: 350,
      width: 110,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 160,
      moveSpeed: 2.5,
    },

    // 5. Terrazza Panoramica Sommitale con la Guglia e Toro d'Oro
    { id: 'm_spire_summit', x: 5120, y: 400, width: 480, height: 320, style: 'marble' },
  ],

  checkpoints: [
    { id: 'toret_mole_1', x: 1140, y: 302 },
    { id: 'toret_mole_2', x: 3600, y: 332 },
  ],

  // Rari collezionabili posizionati nei punti più vertiginosi
  collectibles: [
    { id: 'm_g_1', type: 'gianduiotto', x: 920, y: 260 },  // In aria sopra l'ascensore 1
    { id: 'm_g_2', type: 'gianduiotto', x: 2790, y: 210 }, // Vertice alto della cupola
    { id: 'm_g_3', type: 'gianduiotto', x: 4540, y: 330 }, // In cima al pilastro stretto nel vuoto
  ],

  enemies: [
    // Base Mole
    { id: 'mole_pig_1', type: 'pigeon', x: 520, y: 554, patrolLeft: 420, patrolRight: 750 },
    { id: 'mole_angry_base', type: 'angryLocal', x: 680, y: 536, patrolLeft: 580, patrolRight: 820 },

    // Terrazza 1
    { id: 'mole_angry_1', type: 'angryLocal', x: 1260, y: 306, patrolLeft: 1120, patrolRight: 1600 },
    { id: 'mole_pig_2', type: 'pigeon', x: 1520, y: 224, patrolLeft: 1480, patrolRight: 1610 },

    // Cupola
    { id: 'mole_angry_2', type: 'angryLocal', x: 2420, y: 386, patrolLeft: 2320, patrolRight: 2680 },
    { id: 'mole_pig_3', type: 'pigeon', x: 2800, y: 234, patrolLeft: 2750, patrolRight: 2890 },
    { id: 'mole_pig_3b', type: 'pigeon', x: 3050, y: 324, patrolLeft: 2950, patrolRight: 3150 },

    // Tempietto Superiore
    { id: 'mole_angry_3', type: 'angryLocal', x: 3650, y: 336, patrolLeft: 3560, patrolRight: 4100 },
    { id: 'mole_angry_3b', type: 'angryLocal', x: 3950, y: 336, patrolLeft: 3800, patrolRight: 4200 },
    { id: 'mole_pig_4', type: 'pigeon', x: 4740, y: 284, patrolLeft: 4720, patrolRight: 4790 },
  ],

  goal: {
    x: 5440,
    y: 320,
  },
};
