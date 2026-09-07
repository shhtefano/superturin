import React, { useEffect, useState } from 'react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'controls' | 'items'>('controls');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) {
        e.preventDefault();
        onClose();
      } else if (e.code === 'Tab' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        e.preventDefault();
        setActiveTab((prev) => (prev === 'controls' ? 'items' : 'controls'));
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop">
      <div className="modal-card how-to-play-compact-card">
        {/* Header compatto */}
        <div className="modal-header-compact">
          <h2 className="modal-title" style={{ fontSize: '1.25rem', marginBottom: '2px' }}>
            GUIDA RAPIDA DI GIOCO
          </h2>
        </div>

        {/* Tab switch per dividere le info ed eliminare ogni scorrimento verticale */}
        <div className="how-to-play-tabs">
          <button
            type="button"
            className={`how-tab-btn ${activeTab === 'controls' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('controls')}
          >
            🎮 CONTROLLI & ABILITÀ
          </button>
          <button
            type="button"
            className={`how-tab-btn ${activeTab === 'items' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            🍫 SOSTANZE & BONUS (12s)
          </button>
        </div>

        {/* Contenuto Tab 1: Controlli */}
        {activeTab === 'controls' && (
          <div className="controls-compact-grid">
            <div className="control-item">
              <span className="key-badge">A</span> / <span className="key-badge">D</span> o <span className="key-badge">◀</span> <span className="key-badge">▶</span>
              <span className="control-desc">Movimento sinistra / destra</span>
            </div>
            <div className="control-item">
              <span className="key-badge">W</span> / <span className="key-badge">▲</span>
              <span className="control-desc">Salto dinamico arcade</span>
            </div>
            <div className="control-item">
              <span className="key-badge">SHIFT</span>
              <span className="control-desc">Scatto / Corsa rapida</span>
            </div>
            <div className="control-item">
              <span className="key-badge">SPAZIO</span> / <span className="key-badge">⭐</span>
              <span className="control-desc"><strong>Super-Abilità unica dell'Eroe</strong></span>
            </div>
            <div className="control-item">
              <span className="key-badge">1</span> / <span className="key-badge">J</span>
              <span className="control-desc"><strong>🔫 Pistola Sabauda:</strong> spara a distanza</span>
            </div>
            <div className="control-item">
              <span className="key-badge">2</span> / <span className="key-badge">K</span>
              <span className="control-desc"><strong>💣 Bomba Gianduiotto:</strong> danno AoE</span>
            </div>
          </div>
        )}

        {/* Contenuto Tab 2: Sostanze e Collezionabili */}
        {activeTab === 'items' && (
          <div className="items-compact-grid">
            <div className="item-pill">
              <span className="item-icon">🍫</span>
              <div className="item-details">
                <strong>Gianduiotto</strong>: +100 Punti classici
              </div>
            </div>
            <div className="item-pill">
              <span className="item-icon">⚡</span>
              <div className="item-details">
                <strong>Cocaina</strong>: +50% Sprint & Super Salto
              </div>
            </div>
            <div className="item-pill">
              <span className="item-icon">🌿</span>
              <div className="item-details">
                <strong>Marijuana</strong>: +1 Cuore & Scudo Invulnerabile
              </div>
            </div>
            <div className="item-pill">
              <span className="item-icon">💊</span>
              <div className="item-details">
                <strong>MDMA</strong>: Punti x2 & Magnete Monete
              </div>
            </div>
            <div className="item-pill">
              <span className="item-icon">🌀</span>
              <div className="item-details">
                <strong>LSD</strong>: Sblocca il <em>Doppio Salto</em> in volo
              </div>
            </div>
            <div className="item-pill">
              <span className="item-icon">🍄</span>
              <div className="item-details">
                <strong>Funghetti</strong>: Diventi GIGANTE e schiacci i nemici
              </div>
            </div>
          </div>
        )}

        {/* Pulsante di chiusura compatto */}
        <button
          type="button"
          className="btn-arcade btn-arcade-primary is-selected"
          style={{ marginTop: '10px', padding: '10px 16px', fontSize: '0.78rem' }}
          onClick={onClose}
        >
          ▶ HO CAPITO, ANDIAMO! (INVIO / ESC)
        </button>

        <div className="menu-nav-hint" style={{ marginTop: '6px', fontSize: '0.66rem' }}>
          ⌨️ Premi <kbd>TAB</kbd> o <kbd>◀</kbd>/<kbd>▶</kbd> per cambiare tab • <kbd>INVIO</kbd> per chiudere
        </div>
      </div>
    </div>
  );
};
