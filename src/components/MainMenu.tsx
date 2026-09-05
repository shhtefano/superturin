import React from 'react';
import { useMenuKeyboard } from '../hooks/useMenuKeyboard';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  unlockedLevels: number;
  totalGianduiotti: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenHowToPlay,
  onOpenSettings,
  unlockedLevels,
  totalGianduiotti,
}) => {
  const options = [
    { label: '1. GIOCA', action: onStartGame, primary: true },
    { label: '2. SELEZIONA LIVELLO', action: onOpenLevelSelect, primary: false },
    { label: '3. COME GIOCARE', action: onOpenHowToPlay, primary: false },
    { label: '4. IMPOSTAZIONI', action: onOpenSettings, primary: false },
  ];

  const { selectedIndex, setSelectedIndex } = useMenuKeyboard(
    options.length,
    (index) => options[index].action()
  );

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h1 className="modal-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>
          TORINO RUN
        </h1>
        <p className="modal-subtitle">
          Il Platformer Sabaudo ambientato tra Piazza Castello e la Mole
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '26px',
            fontSize: '0.85rem',
            color: 'var(--text-accent)',
            fontFamily: 'var(--font-display)',
          }}
        >
          <span>🏆 Livelli: {unlockedLevels}</span>
          <span>🍫 Gianduiotti: {totalGianduiotti}</span>
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
          ⌨️ Usa <kbd>▲</kbd> <kbd>▼</kbd> o <kbd>W</kbd>/<kbd>S</kbd> e <kbd>INVIO</kbd> (oppure i tasti <kbd>1-4</kbd>)
        </div>
      </div>
    </div>
  );
};
