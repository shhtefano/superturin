import { LevelData } from './types';

export const level2_mercato: LevelData = {
  id: 2,
  title: 'Livello 2 — Porta Palazzo & Il Grande Mercato',
  subtitle: 'Bancarelle Colorate, Cassette di Frutta e il Trambusto di Piazza della Repubblica',
  theme: 'mercato',
  width: 5600,
  height: 720,
  timeLimit: 220,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Ingresso Mercato Centrale - Area iniziale
    { id: 'm2_ground_1', x: 0, y: 580, width: 950, height: 140, style: 'ground_pave' },

    // Cassette di mele e verdure (rompibili con salti o colpi)
    { id: 'm2_crate_1', x: 380, y: 544, width: 36, height: 36, isBreakable: true },
    { id: 'm2_crate_2', x: 416, y: 544, width: 36, height: 36, isBreakable: true },
    { id: 'm2_crate_3', x: 416, y: 508, width: 36, height: 36, isBreakable: true },

    // Blocchi sorpresa sopra le bancarelle
    { id: 'm2_brick_1', x: 550, y: 440, width: 36, height: 36, style: 'brick' },
    { id: 'm2_q_1', x: 586, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'm2_brick_2', x: 622, y: 440, width: 36, height: 36, style: 'brick' },

    // Tendone a molla elastica (Bouncer per saltare in alto)
    { id: 'm2_bouncer_1', x: 780, y: 550, width: 64, height: 30, isBouncer: true },

    // Piattaforme sospese sui tendoni delle bancarelle
    { id: 'm2_canopy_1', x: 860, y: 390, width: 140, height: 22, isOneWay: true, style: 'wood_dock' },
    { id: 'm2_canopy_2', x: 1040, y: 330, width: 130, height: 22, isOneWay: true, style: 'wood_dock' },

    // Fossa 1: Passaggio pedonale tra i banchi con piattaforma mobile
    {
      id: 'm2_moving_1',
      x: 1220,
      y: 460,
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 100,
      moveSpeed: 1.6,
    },

    // 2. Padiglione della Frutta e Verdura
    { id: 'm2_ground_2', x: 1480, y: 580, width: 850, height: 140, style: 'ground_pave' },
    { id: 'm2_crate_4', x: 1620, y: 544, width: 36, height: 36, isBreakable: true },
    { id: 'm2_q_2', x: 1740, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },
    { id: 'm2_shelf_1', x: 1880, y: 460, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'm2_shelf_2', x: 2060, y: 380, width: 130, height: 22, isOneWay: true, style: 'stone_portico' },

    // Piattaforma mobile verticale
    {
      id: 'm2_moving_2',
      x: 2360,
      y: 470,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 90,
      moveSpeed: 1.5,
    },

    // 3. Tettoia Liberty dell'Orologio
    { id: 'm2_ground_3', x: 2580, y: 580, width: 900, height: 140, style: 'ground_pave' },
    { id: 'm2_bouncer_2', x: 2780, y: 550, width: 64, height: 30, isBouncer: true },
    { id: 'm2_roof_1', x: 2900, y: 390, width: 150, height: 22, isOneWay: true, style: 'marble' },
    { id: 'm2_q_3', x: 3020, y: 280, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'm2_roof_2', x: 3120, y: 340, width: 140, height: 22, isOneWay: true, style: 'marble' },

    // Fossa 3: Binari del Tram 4 con piattaforma traballante
    { id: 'm2_crumb_1', x: 3520, y: 460, width: 90, height: 22, isCrumbling: true },
    {
      id: 'm2_moving_3',
      x: 3680,
      y: 440,
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 90,
      moveSpeed: 1.8,
    },

    // 4. Mercato dei Fiori e Piazzale Finale
    { id: 'm2_ground_4', x: 3950, y: 580, width: 850, height: 140, style: 'ground_pave' },
    { id: 'm2_crate_5', x: 4120, y: 544, width: 36, height: 36, isBreakable: true },
    { id: 'm2_crate_6', x: 4156, y: 544, width: 36, height: 36, isBreakable: true },
    { id: 'm2_q_4', x: 4280, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },
    { id: 'm2_step_1', x: 4440, y: 470, width: 130, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'm2_step_2', x: 4620, y: 400, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },

    // Passerella traguardo
    { id: 'm2_ground_goal', x: 4900, y: 580, width: 700, height: 140, style: 'ground_pave' },
  ],

  checkpoints: [
    { id: 'cp_mercato_1', x: 1580, y: 495 },
    { id: 'cp_mercato_2', x: 3980, y: 495 },
  ],

  collectibles: [
    { id: 'm2_c1', type: 'gianduiotto', x: 260, y: 530 },
    { id: 'm2_c2', type: 'gianduiotto', x: 300, y: 530 },
    { id: 'm2_c3', type: 'gianduiotto', x: 890, y: 350 },
    { id: 'm2_c4', type: 'gianduiotto', x: 1070, y: 290 },
    { id: 'm2_c5', type: 'gianduiotto', x: 1780, y: 530 },
    { id: 'm2_c6', type: 'gianduiotto', x: 2100, y: 340 },
    { id: 'm2_c7', type: 'gianduiotto', x: 2950, y: 350 },
    { id: 'm2_c8', type: 'gianduiotto', x: 3160, y: 300 },
    { id: 'm2_c9', type: 'gianduiotto', x: 4480, y: 430 },
    { id: 'm2_c10', type: 'gianduiotto', x: 4660, y: 360 },
  ],

  enemies: [
    { id: 'm2_pig_1', type: 'pigeon', x: 450, y: 546, patrolLeft: 380, patrolRight: 620 },
    { id: 'm2_angry_1', type: 'angryLocal', x: 700, y: 538, patrolLeft: 580, patrolRight: 820 },
    { id: 'm2_gabbiano_1', type: 'gabbiano', x: 920, y: 280, patrolLeft: 840, patrolRight: 1150 },
    { id: 'm2_pig_2', type: 'pigeon', x: 1680, y: 546, patrolLeft: 1550, patrolRight: 1850 },
    { id: 'm2_vigile_1', type: 'vigile', x: 1950, y: 538, patrolLeft: 1820, patrolRight: 2120 },
    { id: 'm2_gabbiano_2', type: 'gabbiano', x: 2850, y: 270, patrolLeft: 2700, patrolRight: 3150 },
    { id: 'm2_pig_3', type: 'pigeon', x: 3050, y: 546, patrolLeft: 2950, patrolRight: 3250 },
    { id: 'm2_angry_2', type: 'angryLocal', x: 4250, y: 538, patrolLeft: 4050, patrolRight: 4450 },
    { id: 'm2_gabbiano_3', type: 'gabbiano', x: 4500, y: 310, patrolLeft: 4350, patrolRight: 4750 },
    { id: 'm2_vigile_2', type: 'vigile', x: 5050, y: 538, patrolLeft: 4950, patrolRight: 5350 },
  ],

  goal: {
    x: 5380,
    y: 500,
  },
};
