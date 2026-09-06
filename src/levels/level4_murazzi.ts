import { LevelData } from './types';

export const level4_murazzi: LevelData = {
  id: 4,
  title: 'Livello 4 — Murazzi del Po di Notte',
  subtitle: 'Arcate dei Murazzi, Luci d\'Artista e la Darsena Notturna',
  theme: 'murazzi',
  width: 6800,
  height: 720,
  timeLimit: 230,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Inizio banchina dei Murazzi di Piazza Vittorio
    { id: 'm4_ground_1', x: 0, y: 580, width: 1050, height: 140, style: 'stone_portico' },

    // Blocchi al neon sotto le arcate storiche
    { id: 'm4_brick_1', x: 380, y: 440, width: 36, height: 36, style: 'brick' },
    { id: 'm4_q_1', x: 416, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' }, // Neon MD
    { id: 'm4_brick_2', x: 452, y: 440, width: 36, height: 36, style: 'brick' },

    // OSTACOLO INTERATTIVO: Barile di Vermouth torinese distruggibile
    { id: 'm4_barrel_1', x: 550, y: 544, width: 36, height: 36, isBreakable: true },

    // Passerella dell'antico approdo
    { id: 'm4_dock_1', x: 650, y: 460, width: 130, height: 22, isOneWay: true, style: 'wood_dock' },
    { id: 'm4_dock_2', x: 860, y: 390, width: 140, height: 22, isOneWay: true, style: 'wood_dock' },

    // PRIMA FOSSA NOTTURNA SUL PO: 2 Barche mobili nel buio
    {
      id: 'm4_barge_1',
      x: 1120,
      y: 530,
      width: 115,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 60,
      moveSpeed: 2.2,
    },
    {
      id: 'm4_barge_2',
      x: 1360,
      y: 490,
      width: 115,
      height: 24,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 95,
      moveSpeed: 2.4,
    },

    // OSTACOLO INTERATTIVO: Passerella bagnata traballante sul Po
    { id: 'm4_crumb_dock', x: 1520, y: 510, width: 75, height: 20, isCrumbling: true },

    // 2. Banchina Centrale dei Docks e Discoteche
    { id: 'm4_central_ground', x: 1600, y: 570, width: 780, height: 150, style: 'ground_pave' },
    // OSTACOLO INTERATTIVO: Barile di Vermouth
    { id: 'm4_barrel_2', x: 1720, y: 534, width: 36, height: 36, isBreakable: true },
    { id: 'm4_q_2', x: 1820, y: 430, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' },
    { id: 'm4_docks_step', x: 1980, y: 440, width: 130, height: 22, isOneWay: true, style: 'stone_portico' },

    // SECONDA FOSSA: Attraversamento delle Rimesse dei Canottieri (3 piattaforme oscillanti)
    {
      id: 'm4_barge_3',
      x: 2430,
      y: 520,
      width: 105,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 55,
      moveSpeed: 2.1,
    },
    {
      id: 'm4_barge_4',
      x: 2650,
      y: 460,
      width: 105,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 85,
      moveSpeed: 2.3,
    },
    // OSTACOLO INTERATTIVO: Pedana cedevole dei canottieri
    { id: 'm4_crumb_canottieri', x: 2800, y: 460, width: 70, height: 20, isCrumbling: true },
    {
      id: 'm4_barge_5',
      x: 2950,
      y: 410,
      width: 105,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 65,
      moveSpeed: 2.2,
    },

    // 3. Ponte Vittorio Emanuele I (Binari e Tram Notturno)
    { id: 'm4_bridge_ground', x: 3100, y: 580, width: 950, height: 140, style: 'ground_pave' },
    { id: 'm4_bridge_portico_1', x: 3240, y: 430, width: 150, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'm4_bridge_roof', x: 3480, y: 340, width: 160, height: 22, isOneWay: true, style: 'marble' },
    { id: 'm4_q_3', x: 3550, y: 220, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'm4_bridge_portico_2', x: 3740, y: 420, width: 150, height: 22, isOneWay: true, style: 'stone_portico' },
    // FOSSA DELLA DIGA DEI MURAZZI: Salto tra piloni strettissimi nell'acqua vorticosa
    { id: 'm4_dam_pillar_1', x: 4160, y: 490, width: 70, height: 230, style: 'stone_portico' },
    { id: 'm4_dam_pillar_2', x: 4360, y: 420, width: 70, height: 300, style: 'stone_portico' },
    { id: 'm4_dam_pillar_3', x: 4560, y: 350, width: 70, height: 370, style: 'stone_portico' },

    // Piattaforma mobile alta sopra la cascata d'acqua
    {
      id: 'm4_dam_lift',
      x: 4760,
      y: 380,
      width: 105,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 105,
      moveSpeed: 2.5,
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
      width: 115,
      height: 22,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 90,
      moveSpeed: 2.2,
    },

    // Terrazza Panoramica Finale del Monte & Grande Arena Mini Boss
    { id: 'm4_final_terrace', x: 5860, y: 540, width: 880, height: 180, style: 'marble' },
    { id: 'm4_arena_tier_1', x: 6040, y: 440, width: 140, height: 22, isOneWay: true, style: 'wood_dock' },
    { id: 'm4_arena_tier_2', x: 6380, y: 440, width: 140, height: 22, isOneWay: true, style: 'wood_dock' },
  ],

  checkpoints: [
    { id: 'toret_murazzi_1', x: 1640, y: 532 },
    { id: 'toret_murazzi_2', x: 5040, y: 512 },
  ],

  collectibles: [
    { id: 'm4_g_1', type: 'gianduiotto', x: 880, y: 350 },
    { id: 'm4_g_2', type: 'gianduiotto', x: 3500, y: 300 },
    { id: 'm4_g_3', type: 'gianduiotto', x: 4370, y: 380 },
  ],

  enemies: [
    // 1. Banchina iniziale: Nutria veloce e Rider notturno su monopattino!
    { id: 'm4_nutria_1', type: 'nutria', x: 480, y: 558, patrolLeft: 380, patrolRight: 680 },
    { id: 'm4_rider_murazzi', type: 'rider', x: 680, y: 532, patrolLeft: 560, patrolRight: 1020 },
    { id: 'm4_angry_1', type: 'angryLocal', x: 920, y: 536, patrolLeft: 840, patrolRight: 1040 },

    // Fossa Barconi notturni: Gabbiano del Po che taglia la rotta
    { id: 'm4_gabbiano_fossa1', type: 'gabbiano', x: 1250, y: 440, patrolLeft: 1120, patrolRight: 1480 },

    // 2. Docks dei Club: Nutria gigante delle arcate e Torinese della movida
    { id: 'm4_nutria_docks', type: 'nutria', x: 1680, y: 558, patrolLeft: 1580, patrolRight: 1950 },
    { id: 'm4_angry_2', type: 'angryLocal', x: 1880, y: 536, patrolLeft: 1720, patrolRight: 2150 },
    { id: 'm4_rider_docks', type: 'rider', x: 2100, y: 532, patrolLeft: 1980, patrolRight: 2350 },

    // 3. Ponte Vittorio: Tram notturno sferragliante, Rider e Gabbiano sul ponte
    { id: 'm4_tram_night', type: 'tram', x: 3200, y: 530, patrolLeft: 3120, patrolRight: 3850 },
    { id: 'm4_gabbiano_bridge', type: 'gabbiano', x: 3450, y: 280, patrolLeft: 3300, patrolRight: 3680 },
    { id: 'm4_angry_3', type: 'angryLocal', x: 3760, y: 376, patrolLeft: 3740, patrolRight: 3880 },

    // Fossa della Diga: Gabbiano ad alta quota sopra i piloni stretti
    { id: 'm4_gabbiano_dam', type: 'gabbiano', x: 4420, y: 320, patrolLeft: 4200, patrolRight: 4700 },

    // 4. Monte dei Cappuccini: Nutria di risalita e Vigile della movida
    { id: 'm4_vigile_monte', type: 'vigile', x: 5120, y: 516, patrolLeft: 5020, patrolRight: 5350 },
    { id: 'm4_nutria_monte', type: 'nutria', x: 5380, y: 538, patrolLeft: 5240, patrolRight: 5580 },

    // MINI BOSS DEL LIVELLO 4: REGINA DELLE NUTRIE DEI MURAZZI (5 HP) — Grande Arena Fluviale
    { id: 'murazzi_mini_boss', type: 'bossNutria', x: 6180, y: 482, patrolLeft: 5900, patrolRight: 6620 },
  ],

  goal: {
    x: 6640,
    y: 460,
  },
};
