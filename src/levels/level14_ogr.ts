import { LevelData } from './types';

export const level14_ogr: LevelData = {
  id: 14,
  title: 'Livello 14 — OGR Torino & Le Grandi Riparazioni',
  subtitle: 'Il Tempio Ferroviario e Culturale, Piattaforme Sospese e LocoTitan OGR-X',
  theme: 'ogr',
  width: 7000,
  height: 720,
  timeLimit: 300,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Ingresso dal Foyer delle OGR (Corso Castelfidardo)
    { id: 'o14_ground_1', x: 0, y: 580, width: 1050, height: 140, style: 'brick' },

    // Blocchi sorpresa industriali
    { id: 'o14_brick_1', x: 360, y: 440, width: 36, height: 36, style: 'steel_beam' },
    { id: 'o14_q1', x: 396, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'gianduiotto' },
    { id: 'o14_q2', x: 432, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },

    // Travi d'acciaio sospese delle campate storiche
    { id: 'o14_beam_1', x: 640, y: 470, width: 140, height: 22, isOneWay: true, style: 'steel_beam' },
    { id: 'o14_beam_2', x: 840, y: 400, width: 140, height: 22, isOneWay: true, style: 'steel_beam' },

    // Gru a ponte industriale mobile
    {
      id: 'o14_crane_move_1',
      x: 1080,
      y: 420,
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'steel_beam',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 110,
      moveSpeed: 2.3,
    },

    // 2. Binario delle Locomotive Storiche (Vagoni FS come piattaforme)
    { id: 'o14_ground_tracks_1', x: 1280, y: 570, width: 1250, height: 150, style: 'brick' },
    { id: 'o14_crate_1', x: 1420, y: 534, width: 36, height: 36, isBreakable: true },
    { id: 'o14_crate_2', x: 1456, y: 534, width: 36, height: 36, isBreakable: true },
    { id: 'o14_q3', x: 1580, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' },

    // Tetto del Vagone Ferroviario Restaurato
    { id: 'o14_train_roof_1', x: 1720, y: 450, width: 220, height: 24, isOneWay: true, style: 'steel_beam' },
    { id: 'o14_train_roof_2', x: 2020, y: 390, width: 200, height: 24, isOneWay: true, style: 'steel_beam' },
    { id: 'o14_q4', x: 2070, y: 290, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },

    // Traballante passerella metallica
    { id: 'o14_crumb_1', x: 2280, y: 440, width: 85, height: 20, isCrumbling: true },

    // Spuntoni di rottami metallici
    { id: 'o14_spike_1', x: 2400, y: 550, width: 70, height: 20, isSpikeHazard: true },
    { id: 'o14_bounce_1', x: 2510, y: 550, width: 44, height: 20, isBouncer: true },

    // Piattaforma montacarichi mobile verticale
    {
      id: 'o14_lift_move_1',
      x: 2620,
      y: 430,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'steel_beam',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 100,
      moveSpeed: 2.2,
    },

    // 3. Sala Fucine & Arena Elettronica / Concerti delle OGR
    { id: 'o14_ground_concert', x: 2820, y: 560, width: 1300, height: 160, style: 'steel_beam' },
    { id: 'o14_crate_3', x: 3000, y: 524, width: 36, height: 36, isBreakable: true },
    { id: 'o14_q5', x: 3180, y: 420, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },

    // Truss e americane luci da concerto sospese
    { id: 'o14_truss_1', x: 3350, y: 440, width: 150, height: 22, isOneWay: true, style: 'steel_beam' },
    { id: 'o14_truss_2', x: 3580, y: 370, width: 160, height: 22, isOneWay: true, style: 'steel_beam' },
    { id: 'o14_crumb_2', x: 3820, y: 430, width: 85, height: 20, isCrumbling: true },

    // Pistone pneumatico a molla ad altissima spinta
    { id: 'o14_bounce_2', x: 3970, y: 540, width: 48, height: 20, isBouncer: true },

    // Piattaforma mobile orizzontale sopra il parterre
    {
      id: 'o14_stage_move',
      x: 4090,
      y: 400,
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'steel_beam',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 115,
      moveSpeed: 2.4,
    },

    // 4. Hangar di Collaudo Grandi Motori
    { id: 'o14_ground_engine_hall', x: 4320, y: 570, width: 1100, height: 150, style: 'brick' },
    { id: 'o14_q6', x: 4500, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'o14_crate_4', x: 4680, y: 534, width: 36, height: 36, isBreakable: true },
    { id: 'o14_beam_3', x: 4850, y: 450, width: 140, height: 22, isOneWay: true, style: 'steel_beam' },
    { id: 'o14_beam_4', x: 5080, y: 390, width: 140, height: 22, isOneWay: true, style: 'steel_beam' },
    { id: 'o14_crumb_3', x: 5280, y: 440, width: 85, height: 20, isCrumbling: true },

    // 5. Arena Meccanica Finale OGR (Scontro Supremo con LocoTitan OGR-X)
    { id: 'o14_ground_boss_arena', x: 5450, y: 560, width: 1550, height: 160, style: 'steel_beam' },

    // Passerelle sopraelevate per dominare il boss titanico
    { id: 'o14_arena_gantry_1', x: 5720, y: 430, width: 160, height: 22, isOneWay: true, style: 'steel_beam' },
    { id: 'o14_arena_gantry_2', x: 6020, y: 360, width: 180, height: 22, isOneWay: true, style: 'steel_beam' },
    { id: 'o14_arena_gantry_3', x: 6340, y: 430, width: 160, height: 22, isOneWay: true, style: 'steel_beam' },
  ],

  checkpoints: [
    { id: 'o14_cp1', x: 2840, y: 520 },
    { id: 'o14_cp2', x: 5480, y: 520 },
  ],

  collectibles: [
    { id: 'o14_c1', type: 'gianduiotto', x: 280, y: 530 },
    { id: 'o14_c2', type: 'gianduiotto', x: 890, y: 350 },
    { id: 'o14_c3', type: 'gianduiotto', x: 1780, y: 400 },
    { id: 'o14_c4', type: 'gianduiotto', x: 2070, y: 240 },
    { id: 'o14_c5', type: 'gianduiotto', x: 3400, y: 390 },
    { id: 'o14_c6', type: 'gianduiotto', x: 3620, y: 320 },
    { id: 'o14_c7', type: 'gianduiotto', x: 4540, y: 520 },
    { id: 'o14_c8', type: 'gianduiotto', x: 5120, y: 340 },
    { id: 'o14_c9', type: 'gianduiotto', x: 6080, y: 300 },
    { id: 'o14_c10', type: 'gianduiotto', x: 6500, y: 510 },
  ],

  enemies: [
    { id: 'o14_e_robot_1', type: 'robotLingotto', x: 550, y: 536, patrolLeft: 420, patrolRight: 680 },
    { id: 'o14_e_vigile_1', type: 'vigile', x: 1550, y: 526, patrolLeft: 1420, patrolRight: 1700 },
    { id: 'o14_e_rider_1', type: 'rider', x: 2950, y: 518, patrolLeft: 2840, patrolRight: 3120 },
    { id: 'o14_e_robot_2', type: 'robotLingotto', x: 3480, y: 516, patrolLeft: 3350, patrolRight: 3650 },
    { id: 'o14_e_angry_1', type: 'angryLocal', x: 4450, y: 526, patrolLeft: 4350, patrolRight: 4600 },
    { id: 'o14_e_robot_3', type: 'robotLingotto', x: 4950, y: 526, patrolLeft: 4820, patrolRight: 5150 },

    // BOSS SUPREMO DELLE OGR: LOCOTITAN OGR-X (16 HP)
    {
      id: 'ogr_final_boss',
      type: 'bossOGR',
      x: 6100,
      y: 478,
      patrolLeft: 5600,
      patrolRight: 6600,
    },
  ],

  goal: {
    x: 6720,
    y: 480,
  },
};
