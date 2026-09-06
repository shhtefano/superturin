import { LevelData } from './types';

export const level5_superga: LevelData = {
  id: 5,
  title: 'Livello 5 — Superga e la Tranvia a Dentiera',
  subtitle: 'La Grande Salita della Collina, Rotaie della Dentiera e la Basilica',
  theme: 'superga',
  width: 6800,
  height: 720,
  timeLimit: 250,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Stazione di Partenza di Sassi
    { id: 's5_ground_1', x: 0, y: 580, width: 1050, height: 140, style: 'brick' },

    // Blocchi sorpresa della stazione
    { id: 's5_brick_1', x: 380, y: 440, width: 36, height: 36, style: 'brick' },
    { id: 's5_q_1', x: 416, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 's5_brick_2', x: 452, y: 440, width: 36, height: 36, style: 'brick' },

    // Scalini di pietra per accedere alla rotaia dentata
    { id: 's5_step_1', x: 640, y: 470, width: 130, height: 22, isOneWay: true, style: 'marble' },
    { id: 's5_step_2', x: 840, y: 400, width: 140, height: 22, isOneWay: true, style: 'marble' },

    // PRIMA FOSSA DELLA COLLINA: Piattaforma-cremagliera mobile su asse X e Y
    {
      id: 's5_rack_1',
      x: 1080,
      y: 450,
      width: 115,
      height: 22,
      isOneWay: true,
      style: 'dentiera_rail',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 105,
      moveSpeed: 2.3,
    },
    {
      id: 's5_rack_2',
      x: 1320,
      y: 420,
      width: 105,
      height: 22,
      isOneWay: true,
      style: 'dentiera_rail',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 75,
      moveSpeed: 2.1,
    },

    // 2. Primo Terrapieno Collinare (Fermata Pian di Sassi)
    { id: 's5_ground_sassi', x: 1540, y: 560, width: 750, height: 160, style: 'ground_grass' },
    { id: 's5_sassi_step_1', x: 1680, y: 450, width: 130, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 's5_q_2', x: 1840, y: 330, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' }, // Per i doppi salti tra crepacci
    { id: 's5_sassi_step_2', x: 1980, y: 390, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },

    // SECONDA FOSSA DEL BOSCO: Salto tra 3 funivie/piattaforme mobili veloci
    {
      id: 's5_lift_forest_1',
      x: 2360,
      y: 440,
      width: 95,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 85,
      moveSpeed: 2.5,
    },
    {
      id: 's5_lift_forest_2',
      x: 2580,
      y: 380,
      width: 95,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 95,
      moveSpeed: 2.3,
    },
    {
      id: 's5_lift_forest_3',
      x: 2800,
      y: 320,
      width: 95,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 95,
      moveSpeed: 2.6,
    },

    // 3. Settore Rotaie Dentiera in Pendenza ripida
    { id: 's5_ground_tracks', x: 3020, y: 540, width: 950, height: 180, style: 'dentiera_rail' },
    { id: 's5_track_bridge_1', x: 3160, y: 410, width: 150, height: 22, isOneWay: true, style: 'dentiera_rail' },
    { id: 's5_track_bridge_roof', x: 3400, y: 310, width: 160, height: 22, isOneWay: true, style: 'marble' },
    { id: 's5_q_3', x: 3480, y: 190, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },
    { id: 's5_track_bridge_2', x: 3660, y: 390, width: 150, height: 22, isOneWay: true, style: 'dentiera_rail' },

    // IL GRANDE BURRONE PANORAMICO: 3 Pilastri di roccia scoscesa nel vuoto
    { id: 's5_cliff_1', x: 4080, y: 480, width: 68, height: 240, style: 'brick' },
    { id: 's5_cliff_2', x: 4280, y: 400, width: 68, height: 320, style: 'brick' },
    { id: 's5_cliff_3', x: 4480, y: 320, width: 68, height: 400, style: 'brick' },

    // Piattaforma-ascensore rapida verso l'Altopiano di Superga
    {
      id: 's5_superga_lift_1',
      x: 4680,
      y: 350,
      width: 105,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 125,
      moveSpeed: 2.7,
    },
    {
      id: 's5_superga_lift_2',
      x: 4900,
      y: 280,
      width: 105,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 95,
      moveSpeed: 2.4,
    },

    // 4. Piazzale del Parco di Superga
    { id: 's5_piazzale_ground', x: 5120, y: 520, width: 850, height: 200, style: 'stone_portico' },
    { id: 's5_piazzale_step_1', x: 5280, y: 410, width: 130, height: 24, isOneWay: true, style: 'marble' },
    { id: 's5_q_4', x: 5440, y: 290, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 's5_piazzale_step_2', x: 5560, y: 350, width: 140, height: 24, isOneWay: true, style: 'marble' },
    { id: 's5_piazzale_colonnade', x: 5780, y: 280, width: 160, height: 24, isOneWay: true, style: 'marble' },

    // Baratro finale della Cupola di Juvarra
    {
      id: 's5_final_lift',
      x: 6020,
      y: 360,
      width: 115,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 95,
      moveSpeed: 2.6,
    },

    // 5. Sagrato Trionfale della Basilica di Superga
    { id: 's5_basilica_ground', x: 6240, y: 500, width: 560, height: 220, style: 'marble' },
    { id: 's5_basilica_step', x: 6400, y: 420, width: 130, height: 24, isOneWay: true, style: 'marble' },
  ],

  checkpoints: [
    { id: 'toret_superga_1', x: 1600, y: 512 },
    { id: 'toret_superga_2', x: 5180, y: 472 },
  ],

  collectibles: [
    { id: 's5_g_1', type: 'gianduiotto', x: 1990, y: 350 }, // Alto su Pian di Sassi
    { id: 's5_g_2', type: 'gianduiotto', x: 3420, y: 270 }, // In cima al ponte della dentiera
    { id: 's5_g_3', type: 'gianduiotto', x: 4490, y: 280 }, // Sulla cima del pilastro nel burrone
  ],

  enemies: [
    // 1. Stazione Sassi: Scoiattolo dei boschi e primo Cinghiale selvaggio (NON calpestabile!)
    { id: 's5_squirrel_sassi', type: 'squirrel', x: 540, y: 554, patrolLeft: 420, patrolRight: 750 },
    { id: 's5_cinghiale_sassi', type: 'cinghiale', x: 820, y: 548, patrolLeft: 680, patrolRight: 1020 },

    // 2. Pian di Sassi: Cinghiale in carica fra i cespugli e Scoiattolo
    { id: 's5_cinghiale_bosco', type: 'cinghiale', x: 1780, y: 528, patrolLeft: 1600, patrolRight: 2050 },
    { id: 's5_squirrel_1', type: 'squirrel', x: 1960, y: 524, patrolLeft: 1850, patrolRight: 2250 },
    { id: 's5_angry_sassi', type: 'angryLocal', x: 2200, y: 506, patrolLeft: 2050, patrolRight: 2380 },

    // 3. Binari Dentiera: Tranvia a Dentiera a tutta velocità in discesa!
    { id: 's5_dentiera_tram', type: 'tram', x: 3180, y: 490, patrolLeft: 3080, patrolRight: 3820 },
    { id: 's5_pigeon_tracks', type: 'pigeon', x: 3680, y: 354, patrolLeft: 3660, patrolRight: 3800 },

    // Burrone Panoramico: Gabbiano montano sopra il vuoto
    { id: 's5_gabbiano_cliff', type: 'gabbiano', x: 4320, y: 270, patrolLeft: 4120, patrolRight: 4580 },

    // 4. Piazzale Superga: Cinghiale alfa di Superga, Scoiattolo e Torinese escursionista
    { id: 's5_cinghiale_piazzale', type: 'cinghiale', x: 5350, y: 488, patrolLeft: 5180, patrolRight: 5650 },
    { id: 's5_squirrel_2', type: 'squirrel', x: 5620, y: 484, patrolLeft: 5480, patrolRight: 5880 },
    { id: 's5_angry_1', type: 'angryLocal', x: 5800, y: 476, patrolLeft: 5650, patrolRight: 5950 },

    // Sagrato Basilica: Vigile montano e Torinese finale
    { id: 's5_vigile_basilica', type: 'vigile', x: 6320, y: 456, patrolLeft: 6250, patrolRight: 6520 },
  ],

  goal: {
    x: 6620,
    y: 420,
  },
};
