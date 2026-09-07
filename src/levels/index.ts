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
import { level11_palatina } from './level11_palatina';
import { level12_cappuccini } from './level12_cappuccini';
import { level13_venaria } from './level13_venaria';
import { level14_ogr } from './level14_ogr';

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
  11: level11_palatina,
  12: level12_cappuccini,
  13: level13_venaria,
  14: level14_ogr,
};

export function getLevelById(id: number): LevelData {
  return LEVELS[id] || LEVELS[1];
}
