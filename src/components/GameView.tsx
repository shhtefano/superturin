import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '../game/core/GameEngine';
import { GameStatus, HudData, SaveData } from '../types/game';
import { SaveManager } from '../game/storage/SaveManager';
import { HUD } from './HUD';
import { MainMenu } from './MainMenu';
import { PauseModal } from './PauseModal';
import { GameOverModal } from './GameOverModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { HowToPlayModal } from './HowToPlayModal';
import { SettingsModal } from './SettingsModal';
import { LevelSelect } from './LevelSelect';
import { LEVELS } from '../levels';

export const GameView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [status, setStatus] = useState<GameStatus>('menu');
  const [saveData, setSaveData] = useState<SaveData>(() => SaveManager.load());
  const [hudData, setHudData] = useState<HudData>({
    lives: 3,
    maxLives: 3,
    score: 0,
    gianduiotti: 0,
    timeLeft: 300,
    currentLevelId: 1,
    levelTitle: 'Livello 1 — Centro di Torino',
    activePowerUp: null,
  });

  const handleStateChange = useCallback((newStatus: GameStatus) => {
    setStatus(newStatus);
    if (newStatus === 'levelComplete' || newStatus === 'gameOver') {
      setSaveData(SaveManager.load());
    }
  }, []);

  const handleHudUpdate = useCallback((data: HudData) => {
    setHudData(data);
  }, []);

  // Inizializzazione GameEngine
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, {
      onStateChange: handleStateChange,
      onHudUpdate: handleHudUpdate,
    });

    // Applica impostazioni salvate
    const currentSave = SaveManager.load();
    engine.audio.setMusicEnabled(currentSave.settings.music);
    engine.audio.setSfxEnabled(currentSave.settings.soundEffects);

    engine.init();
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [handleStateChange, handleHudUpdate]);

  // Listener da tastiera per mettere in pausa con ESC o P durante il gameplay
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (status === 'playing') {
          e.preventDefault();
          if (engineRef.current) {
            engineRef.current.pause();
          }
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [status]);

  // Gestione azioni UI
  const handleStartGame = () => {
    if (engineRef.current) {
      engineRef.current.play();
    }
  };

  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.pause();
    }
  };

  const handleResume = () => {
    if (engineRef.current) {
      engineRef.current.resume();
    }
  };

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.restart();
    }
  };

  const handleNextLevel = () => {
    if (engineRef.current) {
      const nextId = hudData.currentLevelId + 1;
      const targetId = LEVELS[nextId] ? nextId : 1;
      engineRef.current.loadLevel(targetId);
      engineRef.current.play();
    }
  };

  const handleSelectLevel = (levelId: number) => {
    if (engineRef.current) {
      engineRef.current.loadLevel(levelId);
      engineRef.current.play();
    }
  };

  const handleQuitToMenu = () => {
    if (engineRef.current) {
      engineRef.current.status = 'menu';
      engineRef.current.audio.stopBgm();
      setStatus('menu');
    }
  };

  const handleUpdateSettings = (newSettings: Partial<SaveData['settings']>) => {
    SaveManager.updateSettings(newSettings);
    const updated = SaveManager.load();
    setSaveData(updated);

    if (engineRef.current) {
      if (newSettings.music !== undefined) {
        engineRef.current.audio.setMusicEnabled(newSettings.music);
        if (newSettings.music && status === 'playing') {
          engineRef.current.audio.startBgm();
        }
      }
      if (newSettings.soundEffects !== undefined) {
        engineRef.current.audio.setSfxEnabled(newSettings.soundEffects);
      }
    }
  };

  return (
    <div className="game-viewport-wrapper">
      <div className="game-viewport">
        {/* Canvas ad alta risoluzione base 1280x720 */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="game-canvas"
        />

        {/* UI Overlay React */}
        <div className="ui-layer">
          {status === 'playing' && (
            <HUD data={hudData} onPause={handlePause} />
          )}

          {status === 'menu' && (
            <MainMenu
              onStartGame={handleStartGame}
              onOpenLevelSelect={() => setStatus('levelSelect')}
              onOpenHowToPlay={() => setStatus('howToPlay')}
              onOpenSettings={() => setStatus('settings')}
              unlockedLevels={saveData.unlockedLevels}
              totalGianduiotti={saveData.totalGianduiotti}
            />
          )}

          {status === 'paused' && (
            <PauseModal
              onResume={handleResume}
              onRestart={handleRestart}
              onQuitToMenu={handleQuitToMenu}
            />
          )}

          {status === 'gameOver' && (
            <GameOverModal
              score={hudData.score}
              gianduiotti={hudData.gianduiotti}
              onRetry={handleRestart}
              onQuitToMenu={handleQuitToMenu}
            />
          )}

          {status === 'levelComplete' && (
            <LevelCompleteModal
              score={hudData.score}
              gianduiotti={hudData.gianduiotti}
              timeLeft={hudData.timeLeft}
              onNextLevel={handleNextLevel}
              onRestart={handleRestart}
              onQuitToMenu={handleQuitToMenu}
            />
          )}

          {status === 'howToPlay' && (
            <HowToPlayModal onClose={() => setStatus('menu')} />
          )}

          {status === 'settings' && (
            <SettingsModal
              settings={saveData.settings}
              onUpdateSettings={handleUpdateSettings}
              onClose={() => setStatus('menu')}
            />
          )}

          {status === 'levelSelect' && (
            <LevelSelect
              unlockedLevels={saveData.unlockedLevels}
              bestScores={saveData.bestScores}
              onSelectLevel={handleSelectLevel}
              onClose={() => setStatus('menu')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
