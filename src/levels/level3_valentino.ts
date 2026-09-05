import { LevelData } from './types';

export const level3_valentino: LevelData = {
  id: 3,
  title: 'Livello 3 — Parco del Valentino & Fiume Po',
  subtitle: 'I Pontili del Fiume Po, Scoiattoli Balzanti e Borgo Medievale',
  theme: 'valentino',
  width: 6000,
  height: 720,
  timeLimit: 360,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Viale dei Platani iniziale
    { id: 'v_ground_1', x: 0, y: 580, width: 1000, height: 140, style: 'ground_grass' },

    // Blocchi sospesi tra gli alberi
    { id: 'v_brick_1', x: 380, y: 440, width: 36, height: 36, style: 'wood_dock' },
    { id: 'v_q_1', x: 416, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },
    { id: 'v_brick_2', x: 452, y: 440, width: 36, height: 36, style: 'wood_dock' },

    // Pontile d'imbarco alto
    { id: 'v_tree_1', x: 640, y: 460, width: 130, height: 22, isOneWay: true, style: 'wood_dock' },
    { id: 'v_tree_2', x: 840, y: 390, width: 140, height: 22, isOneWay: true, style: 'wood_dock' },

    // PRIMA FOSSA FIUME PO: 2 Barconi mobili oscillanti sull'acqua
    {
      id: 'v_barge_1',
      x: 1080,
      y: 530,
      width: 130,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 45,
      moveSpeed: 1.6,
    },
    {
      id: 'v_barge_2',
      x: 1320,
      y: 510,
      width: 120,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 75,
      moveSpeed: 1.8,
    },

    // 2. Isolotto Verde dei Pescatori
    { id: 'v_island_1', x: 1540, y: 570, width: 680, height: 150, style: 'ground_grass' },
    { id: 'v_q_2', x: 1720, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'v_step_island', x: 1900, y: 440, width: 130, height: 22, isOneWay: true, style: 'wood_dock' },

    // SECONDA FOSSA FIUME PO: Attraversamento mobile ad altezza d'acqua
    {
      id: 'v_barge_3',
      x: 2320,
      y: 540,
      width: 120,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 50,
      moveSpeed: 2.0,
    },
    {
      id: 'v_barge_4',
      x: 2540,
      y: 490,
      width: 120,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 90,
      moveSpeed: 2.2,
    },
    {
      id: 'v_barge_5',
      x: 2780,
      y: 520,
      width: 120,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 40,
      moveSpeed: 1.7,
    },

    // 3. Riva del Giardino Roccioso
    { id: 'v_rock_garden', x: 3000, y: 570, width: 750, height: 150, style: 'ground_grass' },
    { id: 'v_rock_step_1', x: 3160, y: 460, width: 120, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'v_q_3', x: 3320, y: 340, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' },
    { id: 'v_rock_step_2', x: 3450, y: 400, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },

    // FOSSA DEL FOSSATO DEL CASTELLO: Pontili di legno alti
    {
      id: 'v_barge_6',
      x: 3840,
      y: 450,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 80,
      moveSpeed: 2.0,
    },
    {
      id: 'v_barge_7',
      x: 4050,
      y: 390,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 60,
      moveSpeed: 1.9,
    },

    // 4. Castello e Mura del Borgo Medievale
    { id: 'v_castle_ground', x: 4260, y: 560, width: 850, height: 160, style: 'stone_portico' },
    { id: 'v_castle_step_1', x: 4400, y: 450, width: 130, height: 24, isOneWay: true, style: 'marble' },
    { id: 'v_q_4', x: 4560, y: 330, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },
    { id: 'v_castle_step_2', x: 4680, y: 390, width: 140, height: 24, isOneWay: true, style: 'marble' },
    { id: 'v_castle_roof', x: 4900, y: 320, width: 150, height: 24, isOneWay: true, style: 'marble' },

    // Ponte levatoio finale sul Po
    {
      id: 'v_final_drawbridge',
      x: 5150,
      y: 430,
      width: 130,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 80,
      moveSpeed: 2.2,
    },

    // 5. Terrazza del Porticciolo Reale Finale
    { id: 'v_final_dock', x: 5380, y: 560, width: 620, height: 160, style: 'stone_portico' },
    { id: 'v_final_step', x: 5540, y: 470, width: 120, height: 22, isOneWay: true, style: 'marble' },
  ],

  checkpoints: [
    { id: 'toret_valentino_1', x: 1580, y: 522 },
    { id: 'toret_valentino_2', x: 4320, y: 512 },
  ],

  // Pochi collezionabili rari sospesi sull'acqua e tra le mura
  collectibles: [
    { id: 'v_g_1', type: 'gianduiotto', x: 1200, y: 440 }, // In volo sopra il primo barcone sul Po
    { id: 'v_g_2', type: 'gianduiotto', x: 2660, y: 410 }, // Tra i due barconi mobili
    { id: 'v_g_3', type: 'gianduiotto', x: 4940, y: 280 }, // Alto sui merli del Borgo Medievale
  ],

  enemies: [
    // Parco iniziale
    { id: 'val_squirrel_1', type: 'squirrel', x: 540, y: 554, patrolLeft: 420, patrolRight: 800 },
    { id: 'val_pigeon_1', type: 'pigeon', x: 860, y: 364, patrolLeft: 840, patrolRight: 980 },

    // Isolotto pescatori
    { id: 'val_squirrel_2', type: 'squirrel', x: 1750, y: 544, patrolLeft: 1620, patrolRight: 2100 },

    // Giardino Roccioso
    { id: 'val_angry_1', type: 'angryLocal', x: 3200, y: 526, patrolLeft: 3080, patrolRight: 3500 },
    { id: 'val_pigeon_2', type: 'pigeon', x: 3480, y: 374, patrolLeft: 3450, patrolRight: 3590 },

    // Borgo Medievale
    { id: 'val_squirrel_3', type: 'squirrel', x: 4450, y: 534, patrolLeft: 4300, patrolRight: 4800 },
    { id: 'val_angry_2', type: 'angryLocal', x: 4720, y: 346, patrolLeft: 4680, patrolRight: 4820 },
    { id: 'val_angry_3', type: 'angryLocal', x: 5600, y: 516, patrolLeft: 5420, patrolRight: 5800 },
  ],

  goal: {
    x: 5800,
    y: 480,
  },
};
