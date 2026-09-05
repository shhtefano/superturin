import { LevelData } from './types';

export const level4_murazzi: LevelData = {
  id: 4,
  title: 'Livello 4 — Murazzi del Po di Notte',
  subtitle: 'Arcate dei Murazzi, Luci d\'Artista e la Darsena Notturna',
  theme: 'notte',
  width: 6400,
  height: 720,
  timeLimit: 360,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Inizio banchina dei Murazzi di Piazza Vittorio
    { id: 'm4_ground_1', x: 0, y: 580, width: 1050, height: 140, style: 'stone_portico' },

    // Blocchi al neon sotto le arcate storiche
    { id: 'm4_brick_1', x: 380, y: 440, width: 36, height: 36, style: 'brick' },
    { id: 'm4_q_1', x: 416, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' }, // Neon MD
    { id: 'm4_brick_2', x: 452, y: 440, width: 36, height: 36, style: 'brick' },

    // Passerella dell'antico approdo
    { id: 'm4_dock_1', x: 650, y: 460, width: 130, height: 22, isOneWay: true, style: 'wood_dock' },
    { id: 'm4_dock_2', x: 860, y: 390, width: 140, height: 22, isOneWay: true, style: 'wood_dock' },

    // PRIMA FOSSA NOTTURNA SUL PO: 2 Barche mobili nel buio
    {
      id: 'm4_barge_1',
      x: 1120,
      y: 530,
      width: 120,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 55,
      moveSpeed: 2.1,
    },
    {
      id: 'm4_barge_2',
      x: 1360,
      y: 490,
      width: 120,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 90,
      moveSpeed: 2.3,
    },

    // 2. Arcata dei Club e Docks Sotterranei
    { id: 'm4_club_ground', x: 1580, y: 580, width: 780, height: 140, style: 'stone_portico' },
    { id: 'm4_club_step_1', x: 1750, y: 470, width: 130, height: 22, isOneWay: true, style: 'marble' },
    { id: 'm4_q_2', x: 1920, y: 340, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' }, // Psichedelia
    { id: 'm4_club_step_2', x: 2050, y: 410, width: 140, height: 22, isOneWay: true, style: 'marble' },

    // SECONDA FOSSA: Attraversamento delle Rimesse dei Canottieri (3 piattaforme oscillanti)
    {
      id: 'm4_barge_3',
      x: 2430,
      y: 520,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 50,
      moveSpeed: 2.0,
    },
    {
      id: 'm4_barge_4',
      x: 2650,
      y: 460,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 80,
      moveSpeed: 2.2,
    },
    {
      id: 'm4_barge_5',
      x: 2880,
      y: 410,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 60,
      moveSpeed: 2.1,
    },

    // 3. Ponte Vittorio Emanuele I (Binari e Tram Notturno)
    { id: 'm4_bridge_ground', x: 3100, y: 580, width: 950, height: 140, style: 'ground_pave' },
    { id: 'm4_bridge_portico_1', x: 3240, y: 430, width: 150, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'm4_bridge_roof', x: 3480, y: 340, width: 160, height: 22, isOneWay: true, style: 'marble' },
    { id: 'm4_q_3', x: 3550, y: 220, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'm4_bridge_portico_2', x: 3740, y: 420, width: 150, height: 22, isOneWay: true, style: 'stone_portico' },

    // FOSSA DELLA DIGA DEI MURAZZI: Salto tra piloni strettissimi nell'acqua vorticosa
    { id: 'm4_dam_pillar_1', x: 4160, y: 490, width: 75, height: 230, style: 'stone_portico' },
    { id: 'm4_dam_pillar_2', x: 4360, y: 420, width: 75, height: 300, style: 'stone_portico' },
    { id: 'm4_dam_pillar_3', x: 4560, y: 350, width: 75, height: 370, style: 'stone_portico' },

    // Piattaforma mobile alta sopra la cascata d'acqua
    {
      id: 'm4_dam_lift',
      x: 4760,
      y: 380,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 100,
      moveSpeed: 2.4,
    },

    // 4. Salita verso il Monte dei Cappuccini Notturno
    { id: 'm4_monte_ground', x: 4980, y: 560, width: 750, height: 160, style: 'stone_portico' },
    { id: 'm4_monte_step_1', x: 5120, y: 450, width: 130, height: 24, isOneWay: true, style: 'marble' },
    { id: 'm4_q_4', x: 5280, y: 330, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'm4_monte_step_2', x: 5400, y: 390, width: 140, height: 24, isOneWay: true, style: 'marble' },

    // Salto del Belvedere finale
    {
      id: 'm4_final_lift',
      x: 5650,
      y: 420,
      width: 120,
      height: 22,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 80,
      moveSpeed: 2.2,
    },

    // 5. Terrazza Belvedere Panoramica con Faro Luminoso
    { id: 'm4_final_terrace', x: 5880, y: 540, width: 520, height: 180, style: 'marble' },
  ],

  checkpoints: [
    { id: 'toret_murazzi_1', x: 1640, y: 532 },
    { id: 'toret_murazzi_2', x: 5040, y: 512 },
  ],

  collectibles: [
    { id: 'm4_g_1', type: 'gianduiotto', x: 880, y: 350 },  // Alto sull'approdo di legno
    { id: 'm4_g_2', type: 'gianduiotto', x: 3500, y: 300 }, // Sul tetto del ponte Vittorio
    { id: 'm4_g_3', type: 'gianduiotto', x: 4370, y: 380 }, // In bilico sul pilone della diga
  ],

  enemies: [
    // Banchina iniziale
    { id: 'm4_pigeon_1', type: 'pigeon', x: 540, y: 554, patrolLeft: 420, patrolRight: 800 },
    { id: 'm4_angry_1', type: 'angryLocal', x: 880, y: 536, patrolLeft: 750, patrolRight: 1020 },

    // Docks dei Club
    { id: 'm4_angry_2', type: 'angryLocal', x: 1720, y: 536, patrolLeft: 1600, patrolRight: 2150 },
    { id: 'm4_pigeon_2', type: 'pigeon', x: 2060, y: 374, patrolLeft: 2040, patrolRight: 2180 },

    // Ponte Vittorio Emanuele (Tram notturno in corsa)
    { id: 'm4_tram_night', type: 'tram', x: 3200, y: 530, patrolLeft: 3120, patrolRight: 3850 },
    { id: 'm4_angry_3', type: 'angryLocal', x: 3760, y: 376, patrolLeft: 3740, patrolRight: 3880 },

    // Monte dei Cappuccini
    { id: 'm4_pigeon_3', type: 'pigeon', x: 5140, y: 414, patrolLeft: 5110, patrolRight: 5240 },
    { id: 'm4_angry_4', type: 'angryLocal', x: 5350, y: 516, patrolLeft: 5080, patrolRight: 5550 },
  ],

  goal: {
    x: 6220,
    y: 460,
  },
};
