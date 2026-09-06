import { LevelData } from './types';

export const level3_valentino: LevelData = {
  id: 3,
  title: 'Livello 3 — Parco del Valentino & Fiume Po',
  subtitle: 'I Pontili del Fiume Po, Scoiattoli Balzanti e Borgo Medievale',
  theme: 'valentino',
  width: 6000,
  height: 720,
  timeLimit: 230,
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

    // OSTACOLO INTERATTIVO: Geyser del Toret a Molla (spinge in alto sui rami del Valentino)
    { id: 'v_bouncer_1', x: 920, y: 560, width: 44, height: 20, isBouncer: true },

    // PRIMA FOSSA FIUME PO: 2 Barconi mobili oscillanti sull'acqua
    {
      id: 'v_barge_1',
      x: 1080,
      y: 530,
      width: 120,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 50,
      moveSpeed: 1.8,
    },
    {
      id: 'v_barge_2',
      x: 1320,
      y: 510,
      width: 115,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 80,
      moveSpeed: 2.0,
    },

    // OSTACOLO INTERATTIVO: Pontile galleggiante traballante che cede sotto i piedi
    { id: 'v_crumb_1', x: 1460, y: 510, width: 70, height: 20, isCrumbling: true },

    // 2. Isolotto Verde dei Pescatori
    { id: 'v_island_1', x: 1540, y: 570, width: 680, height: 150, style: 'ground_grass' },
    // OSTACOLO INTERATTIVO: Cassa di provviste dei pescatori distruggibile
    { id: 'v_crate_1', x: 1640, y: 534, width: 36, height: 36, isBreakable: true },
    { id: 'v_q_2', x: 1720, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'v_step_island', x: 1900, y: 440, width: 130, height: 22, isOneWay: true, style: 'wood_dock' },
    // OSTACOLO INTERATTIVO: Tronco spinoso del parco dannoso al tocco
    { id: 'v_spikes_1', x: 2150, y: 552, width: 64, height: 18, isSpikeHazard: true },

    // SECONDA FOSSA FIUME PO: Attraversamento mobile ad altezza d'acqua
    {
      id: 'v_barge_3',
      x: 2320,
      y: 540,
      width: 110,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 55,
      moveSpeed: 2.2,
    },
    {
      id: 'v_barge_4',
      x: 2540,
      y: 490,
      width: 110,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 95,
      moveSpeed: 2.3,
    },
    {
      id: 'v_barge_5',
      x: 2780,
      y: 520,
      width: 110,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 45,
      moveSpeed: 1.9,
    },

    // 3. Riva del Giardino Roccioso
    { id: 'v_rock_garden', x: 3000, y: 570, width: 750, height: 150, style: 'ground_grass' },
    { id: 'v_rock_step_1', x: 3160, y: 460, width: 120, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'v_q_3', x: 3320, y: 340, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' },
    { id: 'v_rock_step_2', x: 3450, y: 400, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },
    // OSTACOLO INTERATTIVO: Molla del Giardino Roccioso
    { id: 'v_bouncer_2', x: 3660, y: 550, width: 44, height: 20, isBouncer: true },

    // FOSSA DEL FOSSATO DEL CASTELLO: Pontili di legno alti
    {
      id: 'v_barge_6',
      x: 3840,
      y: 450,
      width: 105,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 85,
      moveSpeed: 2.2,
    },
    {
      id: 'v_barge_7',
      x: 4050,
      y: 390,
      width: 105,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 65,
      moveSpeed: 2.1,
    },

    // OSTACOLO INTERATTIVO: Passerella traballante delle mura medievali
    { id: 'v_crumb_castle', x: 4180, y: 430, width: 75, height: 20, isCrumbling: true },

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
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 85,
      moveSpeed: 2.3,
    },

    // 5. Terrazza del Porticciolo Reale Finale
    { id: 'v_final_dock', x: 5380, y: 560, width: 620, height: 160, style: 'stone_portico' },
    { id: 'v_final_step', x: 5540, y: 470, width: 120, height: 22, isOneWay: true, style: 'marble' },
  ],

  checkpoints: [
    { id: 'toret_valentino_1', x: 1580, y: 522 },
    { id: 'toret_valentino_2', x: 4320, y: 512 },
  ],

  collectibles: [
    { id: 'v_g_1', type: 'gianduiotto', x: 1200, y: 440 }, // In volo sopra il primo barcone sul Po
    { id: 'v_g_2', type: 'gianduiotto', x: 2660, y: 410 }, // Tra i due barconi mobili
    { id: 'v_g_3', type: 'gianduiotto', x: 4940, y: 280 }, // Alto sui merli del Borgo Medievale
  ],

  enemies: [
    // 1. Parco iniziale: Scoiattolo scattante, Nutria del Po lungo il prato
    { id: 'val_squirrel_1', type: 'squirrel', x: 500, y: 554, patrolLeft: 380, patrolRight: 720 },
    { id: 'val_nutria_1', type: 'nutria', x: 740, y: 558, patrolLeft: 660, patrolRight: 960 },
    { id: 'val_pigeon_1', type: 'pigeon', x: 860, y: 364, patrolLeft: 840, patrolRight: 980 },

    // Fossa 1 Barconi sul Po: Gabbiano che scende in picchiata sull'acqua
    { id: 'val_gabbiano_po1', type: 'gabbiano', x: 1200, y: 430, patrolLeft: 1080, patrolRight: 1420 },

    // 2. Isolotto pescatori: Nutria bagnata e Torinese pescatore
    { id: 'val_nutria_island', type: 'nutria', x: 1680, y: 548, patrolLeft: 1560, patrolRight: 1880 },
    { id: 'val_squirrel_2', type: 'squirrel', x: 1850, y: 544, patrolLeft: 1720, patrolRight: 2150 },
    { id: 'val_angry_fish', type: 'angryLocal', x: 2020, y: 526, patrolLeft: 1920, patrolRight: 2200 },

    // Fossa 2 Barconi mobili: Gabbiano ad ala tesa sopra i barconi
    { id: 'val_gabbiano_po2', type: 'gabbiano', x: 2620, y: 420, patrolLeft: 2420, patrolRight: 2850 },

    // 3. Giardino Roccioso: Scoiattoli acrobatici e Nutria delle sorgenti
    { id: 'val_squirrel_rock', type: 'squirrel', x: 3080, y: 544, patrolLeft: 3010, patrolRight: 3300 },
    { id: 'val_nutria_rock', type: 'nutria', x: 3350, y: 548, patrolLeft: 3220, patrolRight: 3580 },
    { id: 'val_angry_1', type: 'angryLocal', x: 3520, y: 526, patrolLeft: 3420, patrolRight: 3720 },

    // 4. Borgo Medievale: Vigile all'ingresso, Scoiattoli sui bastioni e Torinese
    { id: 'val_vigile_borgo', type: 'vigile', x: 4350, y: 516, patrolLeft: 4280, patrolRight: 4580 },
    { id: 'val_squirrel_3', type: 'squirrel', x: 4620, y: 534, patrolLeft: 4500, patrolRight: 4850 },
    { id: 'val_gabbiano_castle', type: 'gabbiano', x: 4780, y: 310, patrolLeft: 4680, patrolRight: 5020 },
    { id: 'val_angry_2', type: 'angryLocal', x: 4720, y: 346, patrolLeft: 4680, patrolRight: 4820 },

    // Pontile d'attracco finale: Nutria gigante e Torinese dei canottieri Cerea
    { id: 'val_nutria_final', type: 'nutria', x: 5460, y: 538, patrolLeft: 5390, patrolRight: 5750 },
    { id: 'val_angry_3', type: 'angryLocal', x: 5680, y: 516, patrolLeft: 5540, patrolRight: 5880 },
  ],

  goal: {
    x: 5800,
    y: 480,
  },
};
