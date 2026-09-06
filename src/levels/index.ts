import { LevelData } from './types';
import { level1_centro } from './level1_centro';
import { level2_mercato } from './level2_mercato';
import { level3_valentino } from './level3_valentino';
import { level4_murazzi } from './level4_murazzi';
import { level5_sancarlo } from './level5_sancarlo';
import { level2_mole } from './level2_mole';
import { level7_egizio } from './level7_egizio';
import { level5_superga } from './level5_superga';
import { level6_lingotto } from './level6_lingotto';
import { level10_statuto } from './level10_statuto';

export const LEVELS: Record<number, LevelData> = {
  1: level1_centro,
  2: level2_mercato,
  3: level3_valentino,
  4: level4_murazzi,
  5: level5_sancarlo,
  6: level2_mole,
  7: level7_egizio,
  8: level5_superga,
  9: level6_lingotto,
  10: level10_statuto,
};

export function getLevelById(id: number): LevelData {
  return LEVELS[id] || LEVELS[1];
}
