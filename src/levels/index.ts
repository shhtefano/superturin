import { LevelData } from './types';
import { level1_centro } from './level1_centro';
import { level2_mole } from './level2_mole';
import { level3_valentino } from './level3_valentino';
import { level4_murazzi } from './level4_murazzi';
import { level5_superga } from './level5_superga';
import { level6_lingotto } from './level6_lingotto';

export const LEVELS: Record<number, LevelData> = {
  1: level1_centro,
  2: level2_mole,
  3: level3_valentino,
  4: level4_murazzi,
  5: level5_superga,
  6: level6_lingotto,
};

export function getLevelById(id: number): LevelData {
  return LEVELS[id] || LEVELS[1];
}
