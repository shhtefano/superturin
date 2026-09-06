export type GameStatus =
  | 'menu'
  | 'characterSelect'
  | 'levelSelect'
  | 'howToPlay'
  | 'settings'
  | 'playing'
  | 'paused'
  | 'gameOver'
  | 'levelComplete';

export type CharacterId =
  | 'shhte'
  | 'ugo'
  | 'jari'
  | 'jonson'
  | 'krebs'
  | 'devis'
  | 'willy'
  | 'benedetta'
  | 'alessiuccia'
  | 'ludo'
  | 'ariannuccia'
  | 'prato'
  | 'sandrone'
  | 'vinzert';

export type PowerUpType = 'cocaina' | 'marijuana' | 'md' | 'lsd' | 'funghetti';

export interface PowerUpBadge {
  icon: string;
  label: string;
  type: 'bonus' | 'malus';
  tooltip?: string;
}

export interface ActivePowerUpInfo {
  type: PowerUpType;
  name: string;
  icon: string;
  durationLeft: number;
  durationPercent: number; // 0 to 1
  bonusText: string;
  malusText: string;
  color: string;
  badges: PowerUpBadge[];
}

export interface SynergyInfo {
  id: string;
  name: string;
  description: string;
  badge: string;
  color: string;
  badges?: PowerUpBadge[];
}

export interface SkillInfo {
  shootReady: boolean;
  shootCooldownRatio: number;
  shootTimeLeft: number;
  bombReady: boolean;
  bombCooldownRatio: number;
  bombTimeLeft: number;
  // Super-Abilità del Personaggio (Tasto SPACE / Mobile ⭐ SPECIAL)
  characterId: CharacterId;
  characterName: string;
  specialSkillName: string;
  specialSkillReady: boolean;
  specialSkillCooldownRatio: number;
  specialSkillTimeLeft: number;
}

export interface CollectedNotification {
  name: string;
  popupLabel: string;
  icon: string;
  color: string;
  description: string;
  timestamp: number;
  bonusIcon?: string;
  malusIcon?: string;
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
  skills?: SkillInfo;
  lastCollected?: CollectedNotification;
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
  selectedCharacter: CharacterId;
}

export interface EngineCallbacks {
  onStateChange: (status: GameStatus) => void;
  onHudUpdate: (data: HudData) => void;
}
