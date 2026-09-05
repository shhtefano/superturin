import { LevelData } from './types';

export const level6_lingotto: LevelData = {
  id: 6,
  title: 'Livello 6 — Lingotto e la Pista sul Tetto',
  subtitle: 'La Pista 500, Curve Paraboliche della FIAT e la Bolla di Cristallo',
  theme: 'mole',
  width: 7200,
  height: 720,
  timeLimit: 400,
  playerStart: { x: 120, y: 500 },

  platforms: [
    // 1. Partenza dalla Grande Rampa Elicoidale dello Stabilimento Lingotto
    { id: 'l6_ground_start', x: 0, y: 580, width: 1000, height: 140, style: 'ground_pave' },

    // Blocchi industriali di collaudo con bonus iniziale
    { id: 'l6_brick_1', x: 360, y: 440, width: 36, height: 36, style: 'brick' },
    { id: 'l6_q_1', x: 396, y: 440, width: 36, height: 36, isQuestionBlock: true, questionContent: 'cocaina' },
    { id: 'l6_brick_2', x: 432, y: 440, width: 36, height: 36, style: 'brick' },

    // Passaggio basso per testare la SCIVOLATA (Skill [1]): soffitto ribassato
    { id: 'l6_slide_roof', x: 600, y: 480, width: 220, height: 30, style: 'steel_beam' },
    { id: 'l6_q_slide', x: 700, y: 390, width: 36, height: 36, isQuestionBlock: true, questionContent: 'gianduiotto' },

    // Salita della Rampa: gradoni metallici verso il tetto
    { id: 'l6_ramp_step_1', x: 860, y: 490, width: 120, height: 24, isOneWay: true, style: 'steel_beam' },
    { id: 'l6_ramp_step_2', x: 1020, y: 420, width: 120, height: 24, isOneWay: true, style: 'steel_beam' },

    // Fossa interna della fabbrica: piattaforme mobili dell'ascensore industriale montacarichi
    {
      id: 'l6_lift_1',
      x: 1200,
      y: 430,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 80,
      moveSpeed: 2.2,
    },
    {
      id: 'l6_lift_2',
      x: 1400,
      y: 370,
      width: 110,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 90,
      moveSpeed: 2.4,
    },

    // 2. Uscita sul Tetto del Lingotto (Quota +28m) - Inizio Pista Asfalto Nord
    { id: 'l6_roof_north', x: 1650, y: 500, width: 950, height: 220, style: 'ground_pave' },
    { id: 'l6_q_2', x: 1950, y: 360, width: 36, height: 36, isQuestionBlock: true, questionContent: 'lsd' },

    // Piattaforme sospese sopra i lucernari di vetro
    { id: 'l6_glass_ped_1', x: 2150, y: 390, width: 130, height: 20, isOneWay: true, style: 'marble' },
    { id: 'l6_glass_ped_2', x: 2350, y: 330, width: 130, height: 20, isOneWay: true, style: 'marble' },

    // Salto nel vuoto tra i corpi di fabbrica: navetta a carrello semovente veloce
    {
      id: 'l6_shuttle_1',
      x: 2680,
      y: 380,
      width: 100,
      height: 22,
      isOneWay: true,
      style: 'steel_beam',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 120,
      moveSpeed: 2.8,
    },
    {
      id: 'l6_shuttle_2',
      x: 2950,
      y: 340,
      width: 100,
      height: 22,
      isOneWay: true,
      style: 'steel_beam',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 75,
      moveSpeed: 2.5,
    },

    // 3. Il Giardino Pensile "La Pista 500" (Aiuole verdi, alberi nani e fiori d'alta quota)
    { id: 'l6_pista500_garden', x: 3200, y: 480, width: 1250, height: 240, style: 'ground_grass' },
    { id: 'l6_garden_dock_1', x: 3350, y: 370, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'l6_q_3', x: 3550, y: 260, width: 36, height: 36, isQuestionBlock: true, questionContent: 'funghetti' },
    { id: 'l6_garden_dock_2', x: 3750, y: 330, width: 140, height: 22, isOneWay: true, style: 'stone_portico' },
    { id: 'l6_garden_dock_3', x: 4000, y: 360, width: 130, height: 22, isOneWay: true, style: 'wood_dock' },
    { id: 'l6_q_4', x: 4200, y: 270, width: 36, height: 36, isQuestionBlock: true, questionContent: 'md' },

    // Cunicolo stretto con tubature industriali: richiede SCIVOLATA o BOMBARDAMENTO nemici
    { id: 'l6_pipe_roof', x: 4320, y: 410, width: 190, height: 24, style: 'steel_beam' },

    // Fossa del collaudo: piattaforme oscillanti sincronizzate
    {
      id: 'l6_sway_1',
      x: 4580,
      y: 440,
      width: 95,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 85,
      moveSpeed: 2.6,
    },
    {
      id: 'l6_sway_2',
      x: 4800,
      y: 380,
      width: 95,
      height: 20,
      isOneWay: true,
      style: 'marble',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 100,
      moveSpeed: 2.7,
    },

    // 4. La Grande Curva Parabolica Sud (Pedane sopraelevate inclinate per test aerodinamici)
    { id: 'l6_parabolica_base', x: 5050, y: 520, width: 900, height: 200, style: 'ground_pave' },
    { id: 'l6_parabolica_tier1', x: 5200, y: 430, width: 130, height: 24, isOneWay: true, style: 'steel_beam' },
    { id: 'l6_parabolica_tier2', x: 5400, y: 360, width: 130, height: 24, isOneWay: true, style: 'steel_beam' },
    { id: 'l6_q_5', x: 5550, y: 240, width: 36, height: 36, isQuestionBlock: true, questionContent: 'marijuana' },
    { id: 'l6_parabolica_tier3', x: 5680, y: 290, width: 140, height: 24, isOneWay: true, style: 'steel_beam' },

    // Il Grande Baratro dell'Eliporto: doppia piattaforma mobile
    {
      id: 'l6_heli_plat_1',
      x: 6020,
      y: 370,
      width: 105,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'y',
      moveRange: 90,
      moveSpeed: 2.6,
    },
    {
      id: 'l6_heli_plat_2',
      x: 6240,
      y: 330,
      width: 105,
      height: 22,
      isOneWay: true,
      style: 'wood_dock',
      isMoving: true,
      moveAxis: 'x',
      moveRange: 80,
      moveSpeed: 2.5,
    },

    // 5. La Bolla di Renzo Piano (Tetto Sud e Eliporto panoramico)
    { id: 'l6_ground_bolla', x: 6450, y: 490, width: 750, height: 230, style: 'ground_pave' },
    { id: 'l6_bolla_stand_1', x: 6600, y: 400, width: 150, height: 22, isOneWay: true, style: 'marble' },
    { id: 'l6_bolla_stand_2', x: 6820, y: 340, width: 160, height: 24, isOneWay: true, style: 'marble' },
  ],

  checkpoints: [
    // Checkpoint 1: Inizio Pista sul Tetto (Toret 1)
    { id: 'l6_toret_1', x: 1720, y: 440 },
    // Checkpoint 2: Ingresso Parabolica Sud (Toret 2)
    { id: 'l6_toret_2', x: 5120, y: 460 },
  ],

  collectibles: [
    // Rampa iniziale
    { id: 'l6_g_1', type: 'gianduiotto', x: 480, y: 520 },
    { id: 'l6_g_2', type: 'gianduiotto', x: 920, y: 440 },

    // Uscita tetto
    { id: 'l6_g_3', type: 'gianduiotto', x: 1820, y: 440 },
    { id: 'l6_g_4', type: 'gianduiotto', x: 2210, y: 340 },
    { id: 'l6_g_5', type: 'gianduiotto', x: 2410, y: 280 },

    // Giardino pensile Pista 500
    { id: 'l6_g_6', type: 'gianduiotto', x: 3420, y: 320 },
    { id: 'l6_g_7', type: 'gianduiotto', x: 3820, y: 280 },
    { id: 'l6_g_8', type: 'gianduiotto', x: 4060, y: 310 },

    // Parabolica
    { id: 'l6_g_9', type: 'gianduiotto', x: 5260, y: 380 },
    { id: 'l6_g_10', type: 'gianduiotto', x: 5460, y: 310 },
    { id: 'l6_g_11', type: 'gianduiotto', x: 5740, y: 240 },

    // Eliporto Bolla finale
    { id: 'l6_g_12', type: 'gianduiotto', x: 6670, y: 350 },
    { id: 'l6_g_13', type: 'gianduiotto', x: 6900, y: 290 },
  ],

  enemies: [
    // Rampa iniziale: piccioni industriali e collaudatore arrabbiato
    { id: 'l6_pigeon_1', type: 'pigeon', x: 520, y: 540, patrolLeft: 460, patrolRight: 580 },
    { id: 'l6_angry_1', type: 'angryLocal', x: 880, y: 526, patrolLeft: 840, patrolRight: 960 },

    // Tetto Nord: prototipo FIAT / Tram veloce in collaudo sulla pista!
    { id: 'l6_tram_1', type: 'tram', x: 2000, y: 456, patrolLeft: 1780, patrolRight: 2400 },

    // Giardino pensile: scoiattoli dei giardini del Lingotto e collaudatore
    { id: 'l6_squirrel_1', type: 'squirrel', x: 3450, y: 444, patrolLeft: 3300, patrolRight: 3700 },
    { id: 'l6_pigeon_2', type: 'pigeon', x: 3900, y: 440, patrolLeft: 3820, patrolRight: 4020 },
    { id: 'l6_squirrel_2', type: 'squirrel', x: 4280, y: 444, patrolLeft: 4150, patrolRight: 4420 },

    // Parabolica Sud: tram di prova e collaudatore furioso
    { id: 'l6_tram_2', type: 'tram', x: 5350, y: 476, patrolLeft: 5120, patrolRight: 5800 },
    { id: 'l6_angry_2', type: 'angryLocal', x: 5720, y: 236, patrolLeft: 5680, patrolRight: 5800 },

    // Tetto Bolla finale
    { id: 'l6_pigeon_3', type: 'pigeon', x: 6550, y: 450, patrolLeft: 6480, patrolRight: 6680 },
    { id: 'l6_angry_3', type: 'angryLocal', x: 6780, y: 436, patrolLeft: 6680, patrolRight: 7000 },
  ],

  goal: {
    x: 7020,
    y: 280,
  },
};
