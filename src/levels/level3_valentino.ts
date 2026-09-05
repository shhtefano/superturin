import { LevelData } from './types';

export const level3_valentino: LevelData = {
  id: 3,
  title: 'Livello 3 — Parco del Valentino & Fiume Po',
  subtitle: 'Viali Alberati, Scoiattoli Saltellanti e Pontili sul Po',
  theme: 'valentino',
  width: 4000,
  height: 720,
  timeLimit: 300,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // Prato d'ingresso del Parco del Valentino
    { id: 'val_ground_1', x: 0, y: 580, width: 1100, height: 140, style: 'ground_grass' },

    // Blocchi sorpresa tra i rami del parco
    { id: 'v_q_1', x: 380, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },
    { id: 'v_q_2', x: 440, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'v_dock_1', x: 620, y: 450, width: 140, height: 22, isOneWay: true, style: 'wood_dock' },
    { id: 'v_dock_2', x: 840, y: 390, width: 150, height: 22, isOneWay: true, style: 'wood_dock' },

    // ZONA PONTILE SUL PO: Fiume Po sotto, pontili mobili su cui saltare
    {
      id: 'po_barge_1',
      x: 1220,
      y: 540,
      width: 140,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 40,
      moveSpeed: 1.5,
    },
    { id: 'po_island', x: 1480, y: 560, width: 320, height: 160, style: 'ground_grass' },
    { id: 'v_q_3', x: 1600, y: 410, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' },
    {
      id: 'po_barge_2',
      x: 1920,
      y: 530,
      width: 150,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 80,
      moveSpeed: 1.8,
    },

    // Riva del Borgo Medievale
    { id: 'val_ground_2', x: 2200, y: 580, width: 850, height: 140, style: 'ground_grass' },
    { id: 'v_q_4', x: 2400, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'v_dock_3', x: 2550, y: 430, width: 140, height: 22, isOneWay: true, style: 'wood_dock' },
    { id: 'v_q_5', x: 2750, y: 340, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },

    // Castello del Borgo Medievale
    { id: 'val_castle', x: 3180, y: 560, width: 820, height: 160, style: 'stone_portico' },
    { id: 'castle_step_1', x: 3320, y: 460, width: 130, height: 24, isOneWay: true, style: 'marble' },
    { id: 'castle_step_2', x: 3520, y: 380, width: 140, height: 24, isOneWay: true, style: 'marble' },
  ],

  checkpoints: [
    { id: 'toret_valentino_1', x: 1510, y: 512 },
    { id: 'toret_valentino_2', x: 2280, y: 532 },
  ],

  collectibles: [
    { id: 'vg_1', type: 'gianduiotto', x: 260, y: 540 },
    { id: 'vg_2', type: 'marijuana', x: 670, y: 410 },
    { id: 'vg_3', type: 'gianduiotto', x: 890, y: 350 },
    { id: 'vg_4', type: 'funghetti', x: 1260, y: 490 },
    { id: 'vg_5', type: 'gianduiotto', x: 1980, y: 480 },
    { id: 'vg_6', type: 'md', x: 2600, y: 390 },
    { id: 'vg_7', type: 'gianduiotto', x: 3370, y: 420 },
    { id: 'vg_8', type: 'cocaina', x: 3570, y: 340 },
  ],

  enemies: [
    { id: 'squirrel_1', type: 'squirrel', x: 550, y: 554, patrolLeft: 420, patrolRight: 820 },
    { id: 'pigeon_val_1', type: 'pigeon', x: 920, y: 554, patrolLeft: 840, patrolRight: 1080 },
    { id: 'squirrel_2', type: 'squirrel', x: 2450, y: 554, patrolLeft: 2320, patrolRight: 2800 },
  ],

  goal: {
    x: 3820,
    y: 480,
  },
};
