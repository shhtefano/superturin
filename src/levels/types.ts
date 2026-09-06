import { PlatformStyle } from '../entities/Platform';
import { PowerUpType } from '../types/game';

export type LevelTheme = 'centro' | 'mole' | 'valentino' | 'notte' | 'murazzi' | 'superga' | 'lingotto';

export type CollectibleType = 'gianduiotto' | 'cocaina' | 'marijuana' | 'md' | 'lsd' | 'funghetti';

export interface PlatformConfig {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOneWay?: boolean;
  style?: PlatformStyle;
  isQuestionBlock?: boolean;
  questionContent?: CollectibleType;
  isMoving?: boolean;
  moveAxis?: 'x' | 'y';
  moveRange?: number;
  moveSpeed?: number;
  isBouncer?: boolean;       // Molla Sabauda (lancia in alto)
  isCrumbling?: boolean;     // Piattaforma traballante che crolla dopo 0.6s
  isSpikeHazard?: boolean;   // Spuntoni/dissuasori appuntiti
  isBreakable?: boolean;     // Cassa/barile distruttibile con salti/spari/bombe
}

export interface CheckpointConfig {
  id: string;
  x: number;
  y: number;
}

export interface CollectibleConfig {
  id: string;
  type: CollectibleType;
  x: number;
  y: number;
}

export type EnemyType =
  | 'pigeon'
  | 'tram'
  | 'angryLocal'
  | 'squirrel'
  | 'vigile'
  | 'nutria'
  | 'gabbiano'
  | 'rider'
  | 'cinghiale'
  | 'robotLingotto'
  | 'bossPiccione'
  | 'bossNutria'
  | 'bossComau';

export interface EnemyConfig {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  patrolLeft: number;
  patrolRight: number;
}

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  theme: LevelTheme;
  width: number;
  height: number;
  timeLimit: number; // in secondi
  playerStart: { x: number; y: number };
  platforms: PlatformConfig[];
  checkpoints: CheckpointConfig[];
  collectibles: CollectibleConfig[];
  enemies: EnemyConfig[];
  goal: { x: number; y: number };
}
