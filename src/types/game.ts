export type GameStatus =
  | 'menu'
  | 'levelSelect'
  | 'howToPlay'
  | 'settings'
  | 'playing'
  | 'paused'
  | 'gameOver'
  | 'levelComplete';

export type PowerUpType = 'cocaina' | 'marijuana' | 'md' | 'lsd' | 'funghetti';

export interface ActivePowerUpInfo {
  type: PowerUpType;
  name: string;
  durationLeft: number;
  durationPercent: number; // 0 to 1
  bonusText: string;
  malusText: string;
  color: string;
}

export interface SynergyInfo {
  id: string;
  name: string;
  description: string;
  badge: string;
  color: string;
}

export interface HudData {
  lives: number;
  maxLives: number;
  score: number;
  gianduiotti: number;
  timeLeft: number;
  currentLevelId: number;
  levelTitle: string;
  activePowerUps: ActivePowerUpInfo[];
  activeSynergies: SynergyInfo[];
}

export interface GameSettings {
  music: boolean;
  soundEffects: boolean;
  screenShake: boolean;
}

export interface SaveData {
  unlockedLevels: number;
  bestScores: Record<number, number>;
  totalGianduiotti: number;
  settings: GameSettings;
}

export interface EngineCallbacks {
  onStateChange: (status: GameStatus) => void;
  onHudUpdate: (data: HudData) => void;
}
