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
    { label: '1. GIOCA', action: onStartGame, primary: true },
    { label: `2. SCEGLI EROE [${heroConfig.name.toUpperCase()}]`, action: onOpenCharacterSelect, primary: false },
    { label: '3. SELEZIONA LIVELLO', action: onOpenLevelSelect, primary: false },
    { label: '4. COME GIOCARE', action: onOpenHowToPlay, primary: false },
    { label: '5. IMPOSTAZIONI', action: onOpenSettings, primary: false },
    { label: '6. 📱 SCHERMO INTERO / INSTALLA PWA', action: openPWAInstallModal, primary: false },
  ];

  const { selectedIndex, setSelectedIndex } = useMenuKeyboard(
    options.length,
    (index) => options[index].action()
  );

  return (
    <div className="modal-backdrop">
      <div className="modal-card main-menu-card">
        <h1 className="modal-title main-modal-title">
          TORINO RUN
        </h1>
        <p className="modal-subtitle main-modal-subtitle">
          Il Platformer Sabaudo ambientato tra Piazza Castello e la Mole
        </p>

        <div className="main-hero-stats">
          <span>👤 Eroe: <strong style={{ color: heroConfig.color }}>{heroConfig.name}</strong></span>
          <span>⭐ Skill: {heroConfig.skillName}</span>
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
          ⌨️ Usa <kbd>▲</kbd> <kbd>▼</kbd> o <kbd>W</kbd>/<kbd>S</kbd> e <kbd>INVIO</kbd> (oppure i tasti <kbd>1-6</kbd>)
        </div>
      </div>
    </div>
  );
};
