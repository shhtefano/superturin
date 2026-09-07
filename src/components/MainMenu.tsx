import React from 'react';
import { useMenuKeyboard } from '../hooks/useMenuKeyboard';
import { CharacterId } from '../types/game';
import { getCharacterConfig } from '../characters';
import { openPWAInstallModal } from '../utils/fullscreen';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenCharacterSelect: () => void;
  onOpenLevelSelect: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  unlockedLevels: number;
  totalGianduiotti: number;
  selectedCharacter: CharacterId;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenCharacterSelect,
  onOpenLevelSelect,
  onOpenHowToPlay,
  onOpenSettings,
  unlockedLevels,
  totalGianduiotti,
  selectedCharacter,
}) => {
  const heroConfig = getCharacterConfig(selectedCharacter);

  const options = [
    { label: '1. GIOCA SUBITO', icon: '🎮', action: onStartGame, primary: true },
    { label: `2. EROE: ${heroConfig.name.toUpperCase()}`, icon: '👤', action: onOpenCharacterSelect, primary: false },
    { label: '3. SELEZIONA LIVELLO', icon: '🗺️', action: onOpenLevelSelect, primary: false },
    { label: '4. COME GIOCARE', icon: '❓', action: onOpenHowToPlay, primary: false },
    { label: '5. IMPOSTAZIONI', icon: '⚙️', action: onOpenSettings, primary: false },
    { label: '6. SCHERMO INTERO / PWA', icon: '📱', action: openPWAInstallModal, primary: false },
  ];

  const { selectedIndex, setSelectedIndex } = useMenuKeyboard(
    options.length,
    (index) => options[index].action()
  );

  return (
    <div className="modal-backdrop">
      <div className="modal-card main-menu-compact-card">
        {/* Header compatto */}
        <div className="main-menu-header">
          <h1 className="modal-title main-modal-title">TORINO RUN</h1>
          <p className="modal-subtitle main-modal-subtitle">
            Il Platformer Sabaudo tra Piazza Castello, Murazzi e la Mole
          </p>
        </div>

        {/* Badge di stato eroe compatto su singola riga */}
        <div className="main-hero-stats-compact">
          <span>👤 Eroe: <strong style={{ color: heroConfig.color }}>{heroConfig.name}</strong></span>
          <span>⭐ Abilità: <strong>{heroConfig.skillName}</strong></span>
          <span>🍫 Gianduiotti: <strong style={{ color: '#ffb703' }}>{totalGianduiotti}</strong></span>
        </div>

        {/* Griglia a 2 colonne di pulsanti arcade: 3 righe compatte senza scorrimento */}
        <div className="main-menu-btn-grid">
          {options.map((opt, idx) => {
            const isSelected = selectedIndex === idx;
            const btnClass = opt.primary ? 'btn-arcade-primary' : 'btn-arcade-secondary';

            return (
              <button
                key={idx}
                type="button"
                className={`btn-arcade btn-menu-compact ${btnClass} ${isSelected ? 'is-selected' : ''}`}
                onClick={opt.action}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <span className="btn-menu-icon">{opt.icon}</span>
                <span className="btn-menu-label">{opt.label}</span>
                {isSelected && <span className="btn-menu-pointer">◀</span>}
              </button>
            );
          })}
        </div>

        {/* Footer comandi tastiera compatto */}
        <div className="menu-nav-hint main-menu-nav-hint">
          ⌨️ Usa <kbd>▲</kbd> <kbd>▼</kbd> o <kbd>W</kbd>/<kbd>S</kbd> e <kbd>INVIO</kbd> • Tasti rapidi <kbd>1</kbd>-<kbd>6</kbd>
        </div>
      </div>
    </div>
  );
};
