import React from 'react';
import { useMenuKeyboard } from '../hooks/useMenuKeyboard';

interface GameOverModalProps {
  score: number;
  gianduiotti: number;
  onRetry: () => void;
  onQuitToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  gianduiotti,
  onRetry,
  onQuitToMenu,
}) => {
  const options = [
    { label: '1. RIPROVA', action: onRetry, primary: true },
    { label: '2. MENU PRINCIPALE', action: onQuitToMenu, primary: false },
  ];

  const { selectedIndex, setSelectedIndex } = useMenuKeyboard(
    options.length,
    (index) => options[index].action()
  );

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ borderColor: 'var(--color-granata)' }}>
        <h2 className="modal-title" style={{ color: '#ef4444' }}>
          GAME OVER
        </h2>
        <p className="modal-subtitle">
          Boia fauss! Sei stato sopraffatto dal caos cittadino.
        </p>

        <div className="modal-stats-box" style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <div>⭐ Punteggio: {score}</div>
          <div>🍫 Gianduiotti: {gianduiotti}</div>
        </div>

        <div className="btn-group">
          {options.map((opt, idx) => {
            const isSelected = selectedIndex === idx;
            const btnClass = opt.primary ? 'btn-arcade-primary' : 'btn-arcade-secondary';

            return (
              <button
                key={idx}
                className={`btn-arcade ${btnClass} ${isSelected ? 'is-selected' : ''}`}
                onClick={opt.action}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                {isSelected ? '▶ ' : ''}{opt.label}
              </button>
            );
          })}
        </div>

        <div className="menu-nav-hint">
          ⌨️ Premi <kbd>INVIO</kbd> per riprovare subito o <kbd>2</kbd> per il menu
        </div>
      </div>
    </div>
  );
};
