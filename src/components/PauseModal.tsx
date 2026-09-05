import React from 'react';
import { useMenuKeyboard } from '../hooks/useMenuKeyboard';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onQuitToMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onQuitToMenu,
}) => {
  const options = [
    { label: '1. RIPRENDI', action: onResume, primary: true },
    { label: '2. RICOMINCIA LIVELLO', action: onRestart, primary: false },
    { label: '3. MENU PRINCIPALE', action: onQuitToMenu, primary: false },
  ];

  const { selectedIndex, setSelectedIndex } = useMenuKeyboard(
    options.length,
    (index) => options[index].action(),
    onResume // Tasto ESC riprende la partita
  );

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2 className="modal-title">GIOCO IN PAUSA</h2>
        <p className="modal-subtitle">Prenditi una pausa per un caffè al bar storico!</p>

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
          ⌨️ Usa <kbd>▲</kbd> <kbd>▼</kbd> e <kbd>INVIO</kbd> (oppure <kbd>ESC</kbd> per riprendere)
        </div>
      </div>
    </div>
  );
};
