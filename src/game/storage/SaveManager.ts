import { SaveData, GameSettings } from '../../types/game';

export class SaveManager {
  private static readonly STORAGE_KEY = 'superturin_save_v1';

  private static defaultData: SaveData = {
    unlockedLevels: 1,
    bestScores: { 1: 0 },
    totalGianduiotti: 0,
    settings: {
      music: true,
      soundEffects: true,
      screenShake: true,
    },
  };

  public static load(): SaveData {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return { ...this.defaultData };
      const parsed = JSON.parse(raw);
      return {
        ...this.defaultData,
        ...parsed,
        settings: { ...this.defaultData.settings, ...parsed.settings },
      };
    } catch {
      return { ...this.defaultData };
    }
  }

  public static save(data: SaveData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Impossibile salvare in localStorage:', e);
    }
  }

  public static unlockLevel(levelId: number): void {
    const data = this.load();
    if (levelId > data.unlockedLevels) {
      data.unlockedLevels = levelId;
      this.save(data);
    }
  }

  public static recordScore(levelId: number, score: number, gianduiotti: number): void {
    const data = this.load();
    const currentBest = data.bestScores[levelId] || 0;
    if (score > currentBest) {
      data.bestScores[levelId] = score;
    }
    data.totalGianduiotti += gianduiotti;
    this.save(data);
  }

  public static updateSettings(settings: Partial<GameSettings>): void {
    const data = this.load();
    data.settings = { ...data.settings, ...settings };
    this.save(data);
  }
}
