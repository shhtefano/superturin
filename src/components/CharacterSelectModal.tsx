import React, { useEffect, useRef, useState } from 'react';
import { CharacterId } from '../types/game';
import { CHARACTER_LIST, getCharacterConfig } from '../characters';
import { Sprites } from '../game/graphics/Sprites';

interface CharacterSelectModalProps {
  currentHero: CharacterId;
  onSelectHero: (heroId: CharacterId) => void;
  onStartGame?: () => void;
  onClose: () => void;
}

// Mini-avatar pixel art animato per ciascuna tessera del roster
const MiniHeroAvatar: React.FC<{ heroId: CharacterId; isSelected: boolean }> = ({ heroId, isSelected }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isSelected) {
        const char = getCharacterConfig(heroId);
        ctx.fillStyle = char.color + '44';
        ctx.beginPath();
        ctx.arc(17, 17, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(17, 30, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      tick++;
      const bobbing = Math.sin(tick * 0.08) * 1.1;

      Sprites.drawPlayerCombined(
        ctx,
        7,
        3 + bobbing,
        20,
        26,
        true,
        true,
        0,
        0,
        0,
        new Map(),
        false,
        heroId,
        heroId === 'devis' && isSelected,
        heroId === 'krebs' && isSelected,
        heroId === 'benedetta' && isSelected,
        heroId === 'prato' && isSelected
      );

      animFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameId);
  }, [heroId, isSelected]);

  return (
    <canvas
      ref={canvasRef}
      width={34}
      height={34}
      style={{ imageRendering: 'pixelated', display: 'block', flexShrink: 0 }}
    />
  );
};

// Vetrina grande animata per l'eroe selezionato
const ShowcaseHeroAvatar: React.FC<{ heroId: CharacterId }> = ({ heroId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const char = getCharacterConfig(heroId);

      tick++;
      const pulse = 0.55 + Math.sin(tick * 0.06) * 0.2;
      const grad = ctx.createRadialGradient(38, 44, 8, 38, 44, 34);
      grad.addColorStop(0, char.color + Math.floor(pulse * 255).toString(16).padStart(2, '0'));
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(38, 44, 34, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(38, 66, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      const bobbing = Math.sin(tick * 0.08) * 1.8;

      Sprites.drawPlayerCombined(
        ctx,
        18,
        12 + bobbing,
        38,
        54,
        true,
        true,
        0,
        0,
        0,
        new Map(),
        false,
        heroId,
        heroId === 'devis',
        heroId === 'krebs',
        heroId === 'benedetta',
        heroId === 'prato'
      );

      animFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameId);
  }, [heroId]);

  return (
    <canvas
      ref={canvasRef}
      width={76}
      height={76}
      style={{ imageRendering: 'pixelated', display: 'block', flexShrink: 0 }}
    />
  );
};

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  currentHero,
  onSelectHero,
  onStartGame,
  onClose,
}) => {
  const [selectedHero, setSelectedHero] = useState<CharacterId>(currentHero);

  // Gestione tastiera arcade per selezione eroe
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        onSelectHero(selectedHero);
        if (onStartGame) {
          onStartGame();
        } else {
          onClose();
        }
        return;
      }

      // Tasti numerici 1-9 per selezione rapida diretta
      if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key, 10) - 1;
        if (CHARACTER_LIST[idx]) {
          setSelectedHero(CHARACTER_LIST[idx].id);
          onSelectHero(CHARACTER_LIST[idx].id);
        }
        return;
      }

      const currentIndex = CHARACTER_LIST.findIndex((c) => c.id === selectedHero);

      if (e.key === 'ArrowLeft' || e.key === 'KeyA') {
        e.preventDefault();
        const prevIdx = (currentIndex - 1 + CHARACTER_LIST.length) % CHARACTER_LIST.length;
        setSelectedHero(CHARACTER_LIST[prevIdx].id);
        onSelectHero(CHARACTER_LIST[prevIdx].id);
      } else if (e.key === 'ArrowRight' || e.key === 'KeyD') {
        e.preventDefault();
        const nextIdx = (currentIndex + 1) % CHARACTER_LIST.length;
        setSelectedHero(CHARACTER_LIST[nextIdx].id);
        onSelectHero(CHARACTER_LIST[nextIdx].id);
      } else if (e.key === 'ArrowUp' || e.key === 'KeyW') {
        e.preventDefault();
        // Spostamento tra le 2 righe (7 colonne per riga)
        const prevRowIdx = (currentIndex - 7 + CHARACTER_LIST.length) % CHARACTER_LIST.length;
        setSelectedHero(CHARACTER_LIST[prevRowIdx].id);
        onSelectHero(CHARACTER_LIST[prevRowIdx].id);
      } else if (e.key === 'ArrowDown' || e.key === 'KeyS') {
        e.preventDefault();
        const nextRowIdx = (currentIndex + 7) % CHARACTER_LIST.length;
        setSelectedHero(CHARACTER_LIST[nextRowIdx].id);
        onSelectHero(CHARACTER_LIST[nextRowIdx].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedHero, onSelectHero, onStartGame, onClose]);

  const activeConfig = getCharacterConfig(selectedHero);

  const handlePickAndPlay = (heroId: CharacterId) => {
    setSelectedHero(heroId);
    onSelectHero(heroId);
    if (onStartGame) {
      onStartGame();
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop char-select-backdrop">
      <div className="modal-card char-select-wide-card">
        {/* Header compatto a larghezza piena */}
        <div className="char-wide-header">
          <div className="char-wide-title-row">
            <h2 className="modal-title char-wide-title">ROSTER EROI DI TORINO</h2>
            <span className="char-count-badge">14 EROI SABAUDI</span>
          </div>
          <p className="char-wide-subtitle">
            Scegli il tuo eroe: ciascuno ha statistiche e una <strong style={{ color: '#ffd166' }}>Super-Abilità unica</strong> (<kbd className="arcade-kbd">SPAZIO</kbd> / ⭐ Joypad).
          </p>
        </div>

        {/* Griglia a 7 colonne x 2 righe: TUTTI I 14 EROI VISIBILI CONTEMPORANEAMENTE SENZA SCROLL */}
        <div className="char-roster-2x7-grid">
          {CHARACTER_LIST.map((char, index) => {
            const isSelected = char.id === selectedHero;
            return (
              <button
                key={char.id}
                type="button"
                className={`char-tile-wide ${isSelected ? 'is-active' : ''}`}
                style={{
                  borderColor: isSelected ? char.color : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: isSelected ? `0 0 14px ${char.color}99` : 'none',
                }}
                onClick={() => {
                  setSelectedHero(char.id);
                  onSelectHero(char.id);
                }}
                title={`${index + 1}. ${char.name} — ${char.subtitle}`}
              >
                <span
                  className="char-tile-num"
                  style={{
                    color: isSelected ? '#030712' : '#94a3b8',
                    backgroundColor: isSelected ? char.color : 'rgba(15, 23, 42, 0.75)',
                  }}
                >
                  {index + 1}
                </span>

                <div className="char-tile-avatar-box">
                  <MiniHeroAvatar heroId={char.id} isSelected={isSelected} />
                </div>

                <div className="char-tile-text-box">
                  <span
                    className="char-tile-name"
                    style={{ color: isSelected ? '#ffffff' : '#cbd5e1' }}
                  >
                    {char.name}
                  </span>
                  <span className="char-tile-mini-tag" style={{ color: char.color }}>
                    {char.tag.split(' ')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Vetrina Dettagliata dell'Eroe Selezionato: Layout Orizzontale a 3 Sezioni */}
        <div
          className="char-showcase-wide-panel"
          style={{
            borderColor: activeConfig.color,
            background: `linear-gradient(135deg, ${activeConfig.color}15 0%, rgba(10, 16, 30, 0.94) 100%)`,
          }}
        >
          {/* Sezione 1: Avatar grande e tag */}
          <div className="char-showcase-avatar-col">
            <ShowcaseHeroAvatar heroId={activeConfig.id} />
            <span className="char-showcase-tag" style={{ color: activeConfig.color }}>
              {activeConfig.tag}
            </span>
          </div>

          {/* Sezione 2: Nome, Descrizione e Super-Abilità */}
          <div className="char-showcase-center-col">
            <div className="char-showcase-title-row">
              <h3 className="char-showcase-name" style={{ color: activeConfig.color }}>
                {activeConfig.name}
              </h3>
              <span className="char-showcase-subtitle">{activeConfig.subtitle}</span>
            </div>

            <p className="char-showcase-desc">{activeConfig.description}</p>

            {/* Box Super Abilità */}
            <div className="char-showcase-skill-card" style={{ borderLeftColor: activeConfig.color }}>
              <div className="char-showcase-skill-header">
                <span className="char-showcase-skill-name">
                  ⭐ <strong style={{ color: activeConfig.color }}>{activeConfig.skillName}</strong>
                </span>
                <span className="char-showcase-skill-cd">⏱ {activeConfig.skillCooldown}s Ricarica</span>
              </div>
              <p className="char-showcase-skill-desc">{activeConfig.skillDescription}</p>
            </div>
          </div>

          {/* Sezione 3: Pulsanti d'azione */}
          <div className="char-showcase-action-col">
            <button
              type="button"
              className="btn-arcade btn-arcade-primary char-play-btn"
              onClick={() => handlePickAndPlay(activeConfig.id)}
            >
              ▶ GIOCA CON {activeConfig.name.toUpperCase()} (INVIO)
            </button>
            <button
              type="button"
              className="btn-arcade btn-arcade-secondary char-cancel-btn"
              onClick={onClose}
            >
              ◀ INDIETRO (ESC)
            </button>
          </div>
        </div>

        {/* Footer compatto con istruzioni tastiera */}
        <div className="char-compact-footer">
          <span>⌨️ Frecce <kbd>◀</kbd> <kbd>▶</kbd> <kbd>▲</kbd> <kbd>▼</kbd> o tasti <kbd>1</kbd>-<kbd>9</kbd> per selezionare • Premi <kbd>INVIO</kbd> per giocare subito</span>
        </div>
      </div>
    </div>
  );
};
