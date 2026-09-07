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
        ctx.arc(18, 18, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(18, 32, 9, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      tick++;
      const bobbing = Math.sin(tick * 0.08) * 1.2;

      Sprites.drawPlayerCombined(
        ctx,
        7,
        4 + bobbing,
        22,
        28,
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
      width={36}
      height={36}
      style={{ imageRendering: 'pixelated', display: 'block' }}
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

      // Aureola / Glow rotante attorno all'eroe
      tick++;
      const pulse = 0.55 + Math.sin(tick * 0.06) * 0.2;
      const grad = ctx.createRadialGradient(40, 48, 8, 40, 48, 38);
      grad.addColorStop(0, char.color + Math.floor(pulse * 255).toString(16).padStart(2, '0'));
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(40, 48, 38, 0, Math.PI * 2);
      ctx.fill();

      // Ombra sotto i piedi
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(40, 72, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      const bobbing = Math.sin(tick * 0.08) * 2;

      Sprites.drawPlayerCombined(
        ctx,
        20,
        14 + bobbing,
        40,
        58,
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
      width={80}
      height={82}
      style={{ imageRendering: 'pixelated', display: 'block' }}
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
  const rosterScrollRef = useRef<HTMLDivElement>(null);

  // Scorri la tessera selezionata nella vista se necessario
  useEffect(() => {
    const el = document.getElementById(`hero-tile-${selectedHero}`);
    if (el && rosterScrollRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [selectedHero]);

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

      // Tasti 1-9 e 0 per scelta rapida
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

  const handleSlide = (dir: 'left' | 'right') => {
    if (rosterScrollRef.current) {
      const scrollAmount = 180;
      rosterScrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="modal-backdrop char-select-backdrop">
      <div className="modal-card char-select-compact-card">
        {/* Header compatto */}
        <div className="char-compact-header">
          <div className="char-compact-title-row">
            <h2 className="modal-title char-compact-title">SCEGLI L'EROE SABAUDO</h2>
            <span className="char-count-badge">14 EROI DISPONIBILI</span>
          </div>
          <p className="char-compact-subtitle">
            Ogni eroe sabaudo possiede una <strong style={{ color: '#ffd166' }}>Super-Abilità unica</strong> (<kbd className="arcade-kbd">SPAZIO</kbd> o ⭐ Joypad).
          </p>
        </div>

        {/* Layout Principale a Schermo Intero: Roster a sinistra/sopra + Vetrina a destra/sotto */}
        <div className="char-select-main-layout">
          {/* Barra / Griglia Roster dei 14 Eroi */}
          <div className="char-roster-wrapper">
            <button
              type="button"
              className="roster-slide-arrow roster-arrow-left"
              onClick={() => handleSlide('left')}
              title="Scorri a sinistra"
            >
              ◀
            </button>

            <div className="char-roster-grid" ref={rosterScrollRef}>
              {CHARACTER_LIST.map((char, index) => {
                const isSelected = char.id === selectedHero;
                return (
                  <button
                    key={char.id}
                    id={`hero-tile-${char.id}`}
                    type="button"
                    className={`char-tile ${isSelected ? 'is-active' : ''}`}
                    style={{
                      borderColor: isSelected ? char.color : 'rgba(255, 255, 255, 0.12)',
                      boxShadow: isSelected ? `0 0 14px ${char.color}88` : 'none',
                    }}
                    onClick={() => {
                      setSelectedHero(char.id);
                      onSelectHero(char.id);
                    }}
                    title={`${index + 1}. ${char.name} — ${char.skillName}`}
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

                    <div className="char-tile-avatar">
                      <MiniHeroAvatar heroId={char.id} isSelected={isSelected} />
                    </div>

                    <span
                      className="char-tile-name"
                      style={{ color: isSelected ? '#ffffff' : '#cbd5e1' }}
                    >
                      {char.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="roster-slide-arrow roster-arrow-right"
              onClick={() => handleSlide('right')}
              title="Scorri a destra"
            >
              ▶
            </button>
          </div>

          {/* Vetrina Dettagliata dell'Eroe Selezionato */}
          <div
            className="char-showcase-panel"
            style={{
              borderColor: activeConfig.color,
              background: `linear-gradient(135deg, ${activeConfig.color}18 0%, rgba(10, 16, 30, 0.92) 100%)`,
            }}
          >
            <div className="char-showcase-avatar-col">
              <ShowcaseHeroAvatar heroId={activeConfig.id} />
              <span className="char-showcase-tag" style={{ color: activeConfig.color }}>
                {activeConfig.tag}
              </span>
            </div>

            <div className="char-showcase-info-col">
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
                  <span className="char-showcase-skill-cd">⏱ {activeConfig.skillCooldown}s Cooldown</span>
                </div>
                <p className="char-showcase-skill-desc">{activeConfig.skillDescription}</p>
              </div>

              {/* Pulsante di Avvio Gioco Rapido */}
              <div className="char-showcase-actions">
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
          </div>
        </div>

        {/* Footer compatto con istruzioni tastiera */}
        <div className="char-compact-footer">
          <span>⌨️ Usa <kbd>◀</kbd> <kbd>▶</kbd> <kbd>▲</kbd> <kbd>▼</kbd> o <kbd>1</kbd>-<kbd>9</kbd> per selezionare • Premi <kbd>INVIO</kbd> per giocare</span>
        </div>
      </div>
    </div>
  );
};
