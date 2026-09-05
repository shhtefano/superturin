import React, { useState } from 'react';
import { InputManager } from '../game/core/InputManager';
import { SkillInfo } from '../types/game';
import { toggleFullscreen } from '../utils/fullscreen';

interface VirtualJoypadProps {
  inputManager: InputManager | null;
  skills?: SkillInfo;
  onPause?: () => void;
}

export const VirtualJoypad: React.FC<VirtualJoypadProps> = ({
  inputManager,
  skills,
  onPause,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const vibrate = (ms: number = 12) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignora se non supportato
      }
    }
  };

  // --- CONTROLLI DIREZIONALI ---
  const handleDirStart = (dir: 'left' | 'right' | 'down') => {
    if (!inputManager) return;
    vibrate(10);
    inputManager.setTouchDirection(dir, true);
  };

  const handleDirEnd = (dir: 'left' | 'right' | 'down') => {
    if (!inputManager) return;
    inputManager.setTouchDirection(dir, false);
  };

  // --- SALTO ---
  const handleJumpStart = () => {
    if (!inputManager) return;
    vibrate(15);
    inputManager.pressTouchJump();
  };

  const handleJumpEnd = () => {
    if (!inputManager) return;
    inputManager.releaseTouchJump();
  };

  // --- CORSA / SPRINT ---
  const toggleRun = () => {
    if (!inputManager) return;
    const next = !isRunning;
    setIsRunning(next);
    inputManager.setTouchRun(next);
    vibrate(12);
  };

  // --- SKILL (1, 2, 3) ---
  const handleSkillTrigger = (skillNum: 1 | 2 | 3) => {
    if (!inputManager) return;
    vibrate(20);
    inputManager.triggerTouchSkill(skillNum);
  };

  // --- SUPER ABILITÀ EROE (SPACE) ---
  const handleSpecialSkillTrigger = () => {
    if (!inputManager) return;
    vibrate(25);
    inputManager.triggerTouchSpecialSkill();
  };

  // --- FULLSCREEN ---
  const handleFullscreen = () => {
    vibrate(15);
    toggleFullscreen();
  };

  return (
    <div className="virtual-joypad-overlay">
      {/* Barra superiore comandi mobile */}
      <div className="mobile-top-bar">
        {onPause && (
          <button
            type="button"
            className="btn-mobile-icon"
            onClick={() => {
              vibrate(10);
              onPause();
            }}
            title="Pausa"
          >
            ⏸
          </button>
        )}
        <button
          type="button"
          className="btn-mobile-icon"
          onClick={handleFullscreen}
          title="Schermo Intero Orizzontale"
        >
          ⛶
        </button>
      </div>

      {/* D-Pad Sinistro (Movimento Orrizzontale + Giù + Corsa) */}
      <div className="joypad-left-cluster">
        <button
          type="button"
          className={`btn-joypad-run ${isRunning ? 'is-active' : ''}`}
          onClick={toggleRun}
          title="Attiva/Disattiva Corsa Veloce"
        >
          🏃 {isRunning ? 'CORSA ON' : 'CORSA'}
        </button>

        <div className="joypad-dpad">
          {/* Tasto Sinistra */}
          <button
            type="button"
            className="joypad-btn btn-left"
            onTouchStart={(e) => {
              e.preventDefault();
              handleDirStart('left');
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleDirEnd('left');
            }}
            onMouseDown={() => handleDirStart('left')}
            onMouseUp={() => handleDirEnd('left')}
            onMouseLeave={() => handleDirEnd('left')}
            title="Sinistra"
          >
            ◀
          </button>

          {/* Tasto Giù */}
          <button
            type="button"
            className="joypad-btn btn-down"
            onTouchStart={(e) => {
              e.preventDefault();
              handleDirStart('down');
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleDirEnd('down');
            }}
            onMouseDown={() => handleDirStart('down')}
            onMouseUp={() => handleDirEnd('down')}
            onMouseLeave={() => handleDirEnd('down')}
            title="Giù / Accovacciati"
          >
            ▼
          </button>

          {/* Tasto Destra */}
          <button
            type="button"
            className="joypad-btn btn-right"
            onTouchStart={(e) => {
              e.preventDefault();
              handleDirStart('right');
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleDirEnd('right');
            }}
            onMouseDown={() => handleDirStart('right')}
            onMouseUp={() => handleDirEnd('right')}
            onMouseLeave={() => handleDirEnd('right')}
            title="Destra"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Cluster Destro: Salto Principale + Tasti Skill */}
      <div className="joypad-right-cluster">
        {/* Arco Skill Tasti (1, 2, 3) */}
        <div className="joypad-skills-arc">
          {/* Skill 1: Scivolata */}
          <button
            type="button"
            className={`joypad-skill-btn ${skills?.slideReady ?? true ? 'is-ready' : 'is-cooldown'}`}
            onTouchStart={(e) => {
              e.preventDefault();
              handleSkillTrigger(1);
            }}
            onMouseDown={() => handleSkillTrigger(1)}
            title="[1] Scivolata"
          >
            <span className="skill-btn-icon">💨</span>
            <span className="skill-btn-badge">1</span>
            {!(skills?.slideReady ?? true) && (
              <span className="skill-btn-cd">{(skills?.slideTimeLeft ?? 0).toFixed(1)}s</span>
            )}
          </button>

          {/* Skill 2: Pistola */}
          <button
            type="button"
            className={`joypad-skill-btn ${skills?.shootReady ?? true ? 'is-ready' : 'is-cooldown'}`}
            onTouchStart={(e) => {
              e.preventDefault();
              handleSkillTrigger(2);
            }}
            onMouseDown={() => handleSkillTrigger(2)}
            title="[2] Pistola Sabauda"
          >
            <span className="skill-btn-icon">🔫</span>
            <span className="skill-btn-badge">2</span>
            {!(skills?.shootReady ?? true) && (
              <span className="skill-btn-cd">{(skills?.shootTimeLeft ?? 0).toFixed(1)}s</span>
            )}
          </button>

          {/* Skill 3: Bomba Gianduiotto */}
          <button
            type="button"
            className={`joypad-skill-btn ${skills?.bombReady ?? true ? 'is-ready' : 'is-cooldown'}`}
            onTouchStart={(e) => {
              e.preventDefault();
              handleSkillTrigger(3);
            }}
            onMouseDown={() => handleSkillTrigger(3)}
            title="[3] Bomba Gianduiotto"
          >
            <span className="skill-btn-icon">💣</span>
            <span className="skill-btn-badge">3</span>
            {!(skills?.bombReady ?? true) && (
              <span className="skill-btn-cd">{(skills?.bombTimeLeft ?? 0).toFixed(1)}s</span>
            )}
          </button>

          {/* Super Abilità Eroe (Barra Spaziatrice / Star) */}
          <button
            type="button"
            className={`joypad-skill-btn joypad-special-btn ${skills?.specialSkillReady ?? true ? 'is-ready' : 'is-cooldown'}`}
            onTouchStart={(e) => {
              e.preventDefault();
              handleSpecialSkillTrigger();
            }}
            onMouseDown={handleSpecialSkillTrigger}
            title={`[SPAZIO] ${skills?.specialSkillName ?? 'Super Abilità'} (${skills?.characterName ?? ''})`}
          >
            <span className="skill-btn-icon">⭐</span>
            <span className="skill-btn-badge">SPZ</span>
            {!(skills?.specialSkillReady ?? true) && (
              <span className="skill-btn-cd">{(skills?.specialSkillTimeLeft ?? 0).toFixed(1)}s</span>
            )}
          </button>
        </div>

        {/* Pulsante Grande Salto Arcade */}
        <button
          type="button"
          className="joypad-btn-jump"
          onTouchStart={(e) => {
            e.preventDefault();
            handleJumpStart();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleJumpEnd();
          }}
          onMouseDown={handleJumpStart}
          onMouseUp={handleJumpEnd}
          onMouseLeave={handleJumpEnd}
          title="SALTO (Tieni premuto per salto alto)"
        >
          <span className="jump-label">SALTO</span>
          <span className="jump-key">A</span>
        </button>
      </div>
    </div>
  );
};
