import { PlatformStyle } from '../entities/Platform';
import { PowerUpType } from '../types/game';

export type LevelTheme =
  | 'centro'
  | 'mercato'
  | 'valentino'
  | 'notte'
  | 'murazzi'
  | 'sancarlo'
  | 'mole'
  | 'egizio'
  | 'superga'
  | 'lingotto'
  | 'alchimia';

export type CollectibleType = 'gianduiotto' | 'cocaina' | 'marijuana' | 'md' | 'lsd' | 'funghetti';

export interface CollectibleMeta {
  name: string;
  popupLabel: string;
  icon: string;
  color: string;
  description: string;
  bonusIcon?: string;
  malusIcon?: string;
}

export const COLLECTIBLE_META: Record<CollectibleType, CollectibleMeta> = {
  gianduiotto: {
    name: 'Gianduiotto d\'Oro',
    popupLabel: '+1 GIANDUIOTTO',
    icon: '🍫',
    color: '#ffb703',
    description: '+100 Punti',
    bonusIcon: '⭐',
  },
  cocaina: {
    name: 'Cocaina Sabauda',
    popupLabel: 'COCAINA (+Sprint)',
    icon: '⚡',
    color: '#38bdf8',
    description: 'Sprint & Velocità Massima',
    bonusIcon: '⚡',
    malusIcon: '🌀',
  },
  marijuana: {
    name: 'Marijuana dei Murazzi',
    popupLabel: 'MARIJUANA (+Scudo)',
    icon: '🌿',
    color: '#4ade80',
    description: 'Scudo Protettivo & Difesa',
    bonusIcon: '🛡️',
    malusIcon: '🐌',
  },
  md: {
    name: 'MDMA Elettronica',
    popupLabel: 'MDMA (+Magnete x2)',
    icon: '✨',
    color: '#f472b6',
    description: 'Magnete Monete & Punti Doppi',
    bonusIcon: '🧲',
    malusIcon: '🧊',
  },
  lsd: {
    name: 'LSD Psichedelico',
    popupLabel: 'LSD (+Doppio Salto)',
    icon: '👁️',
    color: '#c084fc',
    description: 'Doppio Salto Acrobatico',
    bonusIcon: '🌀',
    malusIcon: '🌈',
  },
  funghetti: {
    name: 'Funghetti Allucinogeni',
    popupLabel: 'FUNGHETTI (+Super Salto)',
    icon: '🍄',
    color: '#fb923c',
    description: 'Super Salto & Gravità Ridotta',
    bonusIcon: '🦘',
    malusIcon: '🍄',
  },
};

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
  | 'bossComau'
  | 'bossToro';

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
