import { LevelData } from './types';

export const level11_palatina: LevelData = {
  id: 11,
  title: 'Livello 11 — Porta Palatina & Quadrilatero Romano',
  subtitle: 'Le Mura di Augusta Taurinorum, I Vicoli delle Piole e la Torre Rossa',
  theme: 'palatina',
  width: 6600,
  height: 720,
  timeLimit: 270,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Ingresso dal Parco Archeologico della Porta Palatina
    { id: 'p11_ground_1', x: 0, y: 580, width: 950, height: 140, style: 'brick' },

    // Blocchi sorpresa con gianduiotto e cocaina
    { id: 'p11_q1', x: 340, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'gianduiotto' },
    { id: 'p11_brick_1', x: 376, y: 440, width: 36, height: 36, style: 'brick' },
    { id: 'p11_q2', x: 412, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },

    // Scalini d'accesso alla prima Torre Poligonale romana
    { id: 'p11_step_1', x: 620, y: 480, width: 110, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'p11_step_2', x: 770, y: 410, width: 120, height: 22, isOneWay: true, style: 'stone_portico' },

    // Traballante impalcatura di restauro archeologico
    { id: 'p11_crumb_1', x: 970, y: 450, width: 80, height: 20, isCrumbling: true },

    // Piattaforma mobile tra le due torri della Porta Palatina
    {
      id: 'p11_move_1',
      x: 1080,
      y: 430,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 110,
      moveSpeed: 2.2,
    },

    // 2. Torre Occidentale di Porta Palatina
    { id: 'p11_tower_west', x: 1250, y: 350, width: 320, height: 370, style: 'brick' },
    { id: 'p11_crate_1', x: 1320, y: 314, width: 36, height: 36, isBreakable: true },
    { id: 'p11_crate_2', x: 1356, y: 314, width: 36, height: 36, isBreakable: true },
    { id: 'p11_q3', x: 1460, y: 240, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },

    // Camminamento delle guardie sulle mura romane merlate
    { id: 'p11_battlement_1', x: 1570, y: 460, width: 220, height: 260, style: 'brick' },
    // Spuntoni romani difensivi sul selciato
    { id: 'p11_spike_1', x: 1820, y: 550, width: 60, height: 20, isSpikeHazard: true },

    // Barile-molla del Quadrilatero (salto acrobatico sulle mura alte)
    { id: 'p11_bounce_1', x: 1910, y: 560, width: 44, height: 20, isBouncer: true },

    // Piattaforma mobile verticale nel cortile archeologico
    {
      id: 'p11_move_2',
      x: 2020,
      y: 440,
      width: 100,
      height: 22,
      isOneWay: true,
      style: 'stone_portico',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 90,
      moveSpeed: 2.0,
    },

    // 3. I Vicoli acciottolati del Quadrilatero Romano (Via Bellezia & Piazza Emanuele Filiberto)
    { id: 'p11_ground_2', x: 2180, y: 570, width: 1250, height: 150, style: 'ground_pave' },

    // Tettoie in legno delle botteghe storiche e piole
    { id: 'p11_piola_roof_1', x: 2360, y: 440, width: 140, height: 20, isOneWay: true, style: 'wood_dock' },
    { id: 'p11_q4', x: 2410, y: 350, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },
    { id: 'p11_piola_roof_2', x: 2650, y: 420, width: 150, height: 20, isOneWay: true, style: 'wood_dock' },
    { id: 'p11_crumb_2', x: 2880, y: 460, width: 85, height: 20, isCrumbling: true },

    // Piattaforma sospesa tra i balconi in ferro battuto
    {
      id: 'p11_move_3',
      x: 3020,
      y: 390,
      width: 110,
      height: 20,
      isOneWay: true,
      style: 'stone_portico',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 100,
      moveSpeed: 2.4,
    },

    // 4. Piazza delle Erbe e Cortile delle Guardie Romane
    { id: 'p11_ground_3', x: 3480, y: 580, width: 1400, height: 140, style: 'brick' },
    { id: 'p11_crate_3', x: 3640, y: 544, width: 36, height: 36, isBreakable: true },
    { id: 'p11_q5', x: 3780, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },

    // Serie di colonne romane spezzate come piattaforme acrobatiche
    { id: 'p11_pillar_1', x: 4050, y: 470, width: 60, height: 110, style: 'marble' },
    { id: 'p11_pillar_2', x: 4190, y: 400, width: 60, height: 180, style: 'marble' },
    { id: 'p11_pillar_3', x: 4330, y: 330, width: 60, height: 250, style: 'marble' },
    { id: 'p11_bounce_2', x: 4460, y: 560, width: 44, height: 20, isBouncer: true },

    // Traballante arco di trionfo romano
    { id: 'p11_crumb_3', x: 4600, y: 420, width: 85, height: 20, isCrumbling: true },

    // 5. Arena Finale di Porta Palatina (Lo scontro con il Centurione)
    { id: 'p11_ground_boss', x: 4920, y: 580, width: 1680, height: 140, style: 'brick' },

    // Spalti e logge sopra l'arena per saltare sul boss o sparare
    { id: 'p11_arena_plat_1', x: 5240, y: 450, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'p11_arena_plat_2', x: 5550, y: 410, width: 160, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'p11_arena_plat_3', x: 5900, y: 450, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },
  ],

  checkpoints: [
    { id: 'p11_cp1', x: 2200, y: 540 },
    { id: 'p11_cp2', x: 4950, y: 550 },
  ],

  collectibles: [
    { id: 'p11_c1', type: 'gianduiotto', x: 260, y: 530 },
    { id: 'p11_c2', type: 'gianduiotto', x: 800, y: 360 },
    { id: 'p11_c3', type: 'gianduiotto', x: 1350, y: 270 },
    { id: 'p11_c4', type: 'gianduiotto', x: 1720, y: 410 },
    { id: 'p11_c5', type: 'gianduiotto', x: 2420, y: 390 },
    { id: 'p11_c6', type: 'gianduiotto', x: 2700, y: 370 },
    { id: 'p11_c7', type: 'gianduiotto', x: 3700, y: 530 },
    { id: 'p11_c8', type: 'gianduiotto', x: 4220, y: 350 },
    { id: 'p11_c9', type: 'gianduiotto', x: 4360, y: 280 },
    { id: 'p11_c10', type: 'gianduiotto', x: 5600, y: 360 },
  ],

  enemies: [
    { id: 'p11_e_vigile_1', type: 'vigile', x: 520, y: 536, patrolLeft: 420, patrolRight: 640 },
    { id: 'p11_e_angry_1', type: 'angryLocal', x: 1400, y: 306, patrolLeft: 1280, patrolRight: 1530 },
    { id: 'p11_e_rider_1', type: 'rider', x: 2320, y: 528, patrolLeft: 2220, patrolRight: 2540 },
    { id: 'p11_e_angry_2', type: 'angryLocal', x: 2680, y: 526, patrolLeft: 2580, patrolRight: 2820 },
    { id: 'p11_e_vigile_2', type: 'vigile', x: 3650, y: 536, patrolLeft: 3550, patrolRight: 3820 },
    { id: 'p11_e_rider_2', type: 'rider', x: 4500, y: 538, patrolLeft: 4400, patrolRight: 4720 },

    // BOSS DEL LIVELLO 11: IL CENTURIONE DI PORTA PALATINA (12 HP)
    {
      id: 'palatina_boss_centurione',
      type: 'bossCenturione',
      x: 5580,
      y: 504,
      patrolLeft: 5100,
      patrolRight: 6100,
    },
  ],

  goal: {
    x: 6380,
    y: 500,
  },
};
