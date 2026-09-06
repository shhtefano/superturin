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

// Mini-componente Canvas per renderizzare l'avatar pixel-art animato del personaggio
const CharacterPreviewCanvas: React.FC<{ heroId: CharacterId; isSelected: boolean }> = ({
  heroId,
  isSelected,
}) => {
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

      // Glow di selezione dietro all'eroe
      if (isSelected) {
        const char = getCharacterConfig(heroId);
        const grad = ctx.createRadialGradient(32, 38, 5, 32, 38, 28);
        grad.addColorStop(0, char.color + '88');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(32, 38, 28, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ombra sotto i piedi
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(32, 57, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Piccolo respiro animato (bobbing)
      tick++;
      const bobbing = Math.sin(tick * 0.08) * 1.5;

      // Disegna il player con lo sprite personalizzato
      Sprites.drawPlayerCombined(
        ctx,
        16, // x
        8 + bobbing, // y
        32, // width
        48, // height
        true, // facingRight
        true, // isGrounded
        0, // vx
        0, // vy
        0, // invincibleTimer
        new Map(), // activePowerUps
        false, // isSliding
        heroId, // characterId
        heroId === 'devis' && isSelected, // isGhostActive
        heroId === 'krebs' && isSelected, // isBioAuraActive
        heroId === 'benedetta' && isSelected // isCharmActive
      );

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [heroId, isSelected]);

  return (
    <canvas
      ref={canvasRef}
      width={64}
      height={64}
      className="char-preview-canvas"
      style={{
        imageRendering: 'pixelated',
      }}
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

      // Selezione diretta con tasti 1-8
      if (e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const index = parseInt(e.key, 10) - 1;
        if (CHARACTER_LIST[index]) {
          const hero = CHARACTER_LIST[index].id;
          setSelectedHero(hero);
          onSelectHero(hero);
        }
        return;
      }

      // Frecce Sinistra / Destra
      if (e.key === 'ArrowLeft' || e.key === 'KeyA') {
        e.preventDefault();
        const currentIndex = CHARACTER_LIST.findIndex((c) => c.id === selectedHero);
        const prevIndex = (currentIndex - 1 + CHARACTER_LIST.length) % CHARACTER_LIST.length;
        const hero = CHARACTER_LIST[prevIndex].id;
        setSelectedHero(hero);
        onSelectHero(hero);
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'KeyD') {
        e.preventDefault();
        const currentIndex = CHARACTER_LIST.findIndex((c) => c.id === selectedHero);
        const nextIndex = (currentIndex + 1) % CHARACTER_LIST.length;
        const hero = CHARACTER_LIST[nextIndex].id;
        setSelectedHero(hero);
        onSelectHero(hero);
        return;
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
      <div className="modal-card char-select-card">
        {/* Header Modale */}
        <div className="char-select-header">
          <h1 className="modal-title char-modal-title">
            SCEGLI IL TUO EROE
          </h1>
          <p className="modal-subtitle char-modal-subtitle">
            Ogni eroe sabaudo possiede una <strong style={{ color: '#ffd166' }}>Super-Abilità unica</strong> attivabile con <kbd className="arcade-kbd">SPAZIO</kbd> o con il tasto ⭐ del Joypad!
          </p>
        </div>

        {/* Griglia degli Eroi di Torino */}
        <div className="char-grid">
          {CHARACTER_LIST.map((char, index) => {
            const isSelected = char.id === selectedHero;

            return (
              <div
                key={char.id}
                className={`char-card ${isSelected ? 'is-active' : ''}`}
                style={{
                  borderColor: isSelected ? char.color : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: isSelected
                    ? `0 0 20px ${char.color}66, 0 8px 24px rgba(0,0,0,0.7)`
                    : 'none',
                }}
                onClick={() => {
                  setSelectedHero(char.id);
                  onSelectHero(char.id);
                }}
              >
                {/* Badge Numerico per selezione rapida da tastiera */}
                <div
                  className="char-key-badge"
                  style={{
                    backgroundColor: isSelected ? char.color : 'rgba(15, 23, 42, 0.8)',
                    color: isSelected ? '#030712' : '#94a3b8',
                  }}
                >
                  {index + 1}
                </div>

                {/* Avatar Canvas */}
                <div className="char-avatar-box">
                  <CharacterPreviewCanvas heroId={char.id} isSelected={isSelected} />
                </div>

                {/* Informazioni Eroe */}
                <div className="char-info">
                  <div className="char-tag" style={{ color: char.color }}>
                    {char.tag}
                  </div>
                  <h3 className="char-name" style={{ color: isSelected ? '#ffffff' : '#e2e8f0' }}>
                    {char.name}
                  </h3>
                  <div className="char-role">{char.subtitle}</div>
                </div>

                {/* Box Super Abilità */}
                <div
                  className="char-skill-preview"
                  style={{
                    borderLeftColor: char.color,
                  }}
                >
                  <div className="char-skill-title">
                    <span className="char-skill-star">⭐</span>
                    <strong style={{ color: char.color }}>{char.skillName}</strong>
                    <span className="char-skill-cd">⏱ {char.skillCooldown}s</span>
                  </div>
                  <p className="char-skill-desc">{char.skillDescription}</p>
                </div>

                {/* Indicatore di selezione */}
                <div className="char-select-indicator">
                  {isSelected ? (
                    <span className="indicator-selected" style={{ color: char.color }}>
                      ✓ SELEZIONATO
                    </span>
                  ) : (
                    <span className="indicator-choose">CLICCA PER SCEGLIERE</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dettagli dell'eroe selezionato attualmente */}
        <div
          className="char-summary-bar"
          style={{
            borderColor: activeConfig.color,
            background: `linear-gradient(90deg, ${activeConfig.color}22 0%, rgba(15, 23, 42, 0.8) 100%)`,
          }}
        >
          <div className="char-summary-left">
            <span className="char-summary-name" style={{ color: activeConfig.color }}>
              {activeConfig.name} — {activeConfig.subtitle}
            </span>
            <span className="char-summary-lore">{activeConfig.description}</span>
          </div>
          <button
            type="button"
            className="btn-arcade btn-arcade-primary char-confirm-btn"
            onClick={() => handlePickAndPlay(activeConfig.id)}
          >
            ▶ GIOCA CON {activeConfig.name.toUpperCase()}
          </button>
        </div>

        {/* Footer comandi */}
        <div className="char-select-footer">
          <div className="menu-nav-hint">
            ⌨️ Scegli con <kbd>1</kbd>-<kbd>8</kbd> o <kbd>◀</kbd> <kbd>▶</kbd> • Premi <kbd>INVIO</kbd> per giocare • <kbd>ESC</kbd> per chiudere
          </div>
          <button type="button" className="btn-arcade btn-arcade-secondary btn-close-modal" onClick={onClose}>
            INDIETRO AL MENU
          </button>
        </div>
      </div>
    </div>
  );
};
