import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '../game/core/GameEngine';
import { GameStatus, HudData, SaveData } from '../types/game';
import { SaveManager } from '../game/storage/SaveManager';
import { HUD } from './HUD';
import { MainMenu } from './MainMenu';
import { PauseModal } from './PauseModal';
import { GameOverModal } from './GameOverModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { GameVictoryModal } from './GameVictoryModal';
import { HowToPlayModal } from './HowToPlayModal';
import { SettingsModal } from './SettingsModal';
import { LevelSelect } from './LevelSelect';
import { CharacterSelectModal } from './CharacterSelectModal';
import { VirtualJoypad } from './VirtualJoypad';
import { OrientationPrompt } from './OrientationPrompt';
import { PWAInstallModal } from './PWAInstallModal';
import { LEVELS } from '../levels';
import { CharacterId } from '../types/game';
import { toggleFullscreen, isFullscreenActive, openPWAInstallModal } from '../utils/fullscreen';

export const GameView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [status, setStatus] = useState<GameStatus>('menu');
  const [saveData, setSaveData] = useState<SaveData>(() => SaveManager.load());
  const [fullscreen, setFullscreen] = useState<boolean>(isFullscreenActive);
  const [showPWAModal, setShowPWAModal] = useState<boolean>(false);
  const [showVirtualJoypad, setShowVirtualJoypad] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024;
  });
  const [hudData, setHudData] = useState<HudData>({
    lives: 3,
    maxLives: 3,
    score: 0,
    gianduiotti: 0,
    timeLeft: 300,
    currentLevelId: 1,
    levelTitle: 'Livello 1 — Centro di Torino',
    activePowerUps: [],
    activeSynergies: [],
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

  // Listener cambio stato schermo intero e PWA modal
  useEffect(() => {
    const handleFsChange = () => setFullscreen(isFullscreenActive());
    const handleOpenPWA = () => setShowPWAModal(true);

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    window.addEventListener('open-pwa-install-modal', handleOpenPWA);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      window.removeEventListener('open-pwa-install-modal', handleOpenPWA);
    };
  }, []);

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

  const handleSelectCharacter = (heroId: CharacterId) => {
    SaveManager.setSelectedCharacter(heroId);
    setSaveData(SaveManager.load());
    if (engineRef.current) {
      engineRef.current.setSelectedCharacter(heroId);
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
      {/* Avviso rotazione schermo orizzontale obbligatorio per mobile */}
      <OrientationPrompt />

      <div className="game-viewport">
        {/* Canvas ad alta risoluzione base 1280x720 */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="game-canvas"
        />

        {/* Virtual Joypad Arcade Touch per Mobile / Tablet */}
        {status === 'playing' && showVirtualJoypad && (
          <VirtualJoypad
            inputManager={engineRef.current ? engineRef.current.input : null}
            skills={hudData.skills}
            onPause={handlePause}
            isFullscreen={fullscreen}
          />
        )}

        {/* Pulsante rapido Schermo Intero per Mobile / Touch nei menu */}
        {showVirtualJoypad && status !== 'playing' && (
          <button
            type="button"
            className="btn-quick-fullscreen"
            onClick={toggleFullscreen}
            title={fullscreen ? 'Esci da Schermo Intero' : 'Attiva Schermo Intero Orizzontale'}
          >
            {fullscreen ? '⤓ FINESTRA' : '⛶ SCHERMO INTERO'}
          </button>
        )}

        {/* UI Overlay React */}
        <div className="ui-layer">
          {status === 'playing' && (
            <HUD data={hudData} onPause={handlePause} />
          )}

          {status === 'menu' && (
            <MainMenu
              onStartGame={handleStartGame}
              onOpenCharacterSelect={() => setStatus('characterSelect')}
              onOpenLevelSelect={() => setStatus('levelSelect')}
              onOpenHowToPlay={() => setStatus('howToPlay')}
              onOpenSettings={() => setStatus('settings')}
              unlockedLevels={saveData.unlockedLevels}
              totalGianduiotti={saveData.totalGianduiotti}
              selectedCharacter={saveData.selectedCharacter ?? 'shhte'}
            />
          )}

          {status === 'characterSelect' && (
            <CharacterSelectModal
              currentHero={saveData.selectedCharacter ?? 'shhte'}
              onSelectHero={handleSelectCharacter}
              onStartGame={() => {
                handleStartGame();
              }}
              onClose={() => setStatus('menu')}
            />
          )}

          {status === 'paused' && (
            <PauseModal
              onResume={handleResume}
              onRestart={handleRestart}
              onQuitToMenu={handleQuitToMenu}
              joypadActive={showVirtualJoypad}
              onToggleJoypad={() => setShowVirtualJoypad((prev) => !prev)}
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

          {status === 'gameVictory' && (
            <GameVictoryModal
              score={hudData.score}
              gianduiotti={hudData.gianduiotti}
              timeLeft={hudData.timeLeft}
              onRestart={() => handleSelectLevel(1)}
              onOpenMap={() => setStatus('levelSelect')}
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
              characterId={saveData.selectedCharacter}
              onSelectLevel={handleSelectLevel}
              onClose={() => setStatus('menu')}
            />
          )}

          {/* Modale Guida PWA / Schermo Intero per iOS e Android */}
          <PWAInstallModal
            isOpen={showPWAModal}
            onClose={() => setShowPWAModal(false)}
          />
        </div>
      </div>
    </div>
  );
};
