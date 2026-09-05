import React, { useState, useEffect } from 'react';
import { useMenuKeyboard } from '../hooks/useMenuKeyboard';
import { toggleFullscreen, isFullscreenActive } from '../utils/fullscreen';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onQuitToMenu: () => void;
  joypadActive?: boolean;
  onToggleJoypad?: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onQuitToMenu,
  joypadActive,
  onToggleJoypad,
}) => {
  const [fullscreen, setFullscreen] = useState(isFullscreenActive);

  useEffect(() => {
    const handleFsChange = () => setFullscreen(isFullscreenActive());
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const handleToggleFs = () => {
    toggleFullscreen();
    setTimeout(() => setFullscreen(isFullscreenActive()), 100);
  };

  const options = [
    { label: '1. RIPRENDI', action: onResume, primary: true },
    {
      label: fullscreen ? '⛶ SCHERMO INTERO: [ATTIVO]' : '⛶ SCHERMO INTERO: [ATTIVA]',
      action: handleToggleFs,
      primary: false,
    },
    ...(onToggleJoypad
      ? [
          {
            label: joypadActive ? '🎮 JOYPAD TOUCH: [ATTIVO]' : '🎮 JOYPAD TOUCH: [DISATTIVO]',
            action: onToggleJoypad,
            primary: false,
          },
        ]
      : []),
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
