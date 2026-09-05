import React from 'react';
import { useMenuKeyboard } from '../hooks/useMenuKeyboard';

interface LevelCompleteModalProps {
  score: number;
  gianduiotti: number;
  timeLeft: number;
  onNextLevel: () => void;
  onRestart: () => void;
  onQuitToMenu: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  score,
  gianduiotti,
  timeLeft,
  onNextLevel,
  onRestart,
  onQuitToMenu,
}) => {
  const options = [
    { label: '1. PROSSIMO LIVELLO', action: onNextLevel, primary: true },
    { label: '2. GIOCA DI NUOVO', action: onRestart, primary: false },
    { label: '3. MENU PRINCIPALE', action: onQuitToMenu, primary: false },
  ];

  const { selectedIndex, setSelectedIndex } = useMenuKeyboard(
    options.length,
    (index) => options[index].action()
  );

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ borderColor: 'var(--color-oro-light)' }}>
        <h2 className="modal-title">LIVELLO COMPLETATO!</h2>
        <p className="modal-subtitle">Complimenti! Hai raggiunto il traguardo reale!</p>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            fontFamily: 'var(--font-display)',
            fontSize: '0.78rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            textAlign: 'left',
          }}
        >
          <div>⭐ Punteggio Finale: <span style={{ color: 'var(--color-oro-reale)' }}>{score}</span></div>
          <div>🍫 Gianduiotti Raccolti: <span style={{ color: '#ffe066' }}>{gianduiotti}</span></div>
          <div>⏱️ Tempo Rimanente: <span style={{ color: '#38bdf8' }}>{timeLeft}s</span></div>
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
          ⌨️ Premi <kbd>INVIO</kbd> per il prossimo livello o <kbd>▲</kbd> <kbd>▼</kbd> per scegliere
        </div>
      </div>
    </div>
  );
};
