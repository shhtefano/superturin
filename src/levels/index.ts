import { LevelData } from './types';
import { level1_centro } from './level1_centro';
import { level2_mole } from './level2_mole';
import { level3_valentino } from './level3_valentino';

export const LEVELS: Record<number, LevelData> = {
  1: level1_centro,
  2: level2_mole,
  3: level3_valentino,
};

export function getLevelById(id: number): LevelData {
  return LEVELS[id] || LEVELS[1];
}
