import React, { useState, useEffect } from 'react';
import { GameSettings } from '../types/game';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const toggleOption = (idx: number) => {
    if (idx === 0) onUpdateSettings({ music: !settings.music });
    else if (idx === 1) onUpdateSettings({ soundEffects: !settings.soundEffects });
    else if (idx === 2) onUpdateSettings({ screenShake: !settings.screenShake });
    else if (idx === 3) onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 3));
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < 3 ? prev + 1 : 0));
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        toggleOption(selectedIndex);
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.code === 'Digit1') toggleOption(0);
      else if (e.code === 'Digit2') toggleOption(1);
      else if (e.code === 'Digit3') toggleOption(2);
      else if (e.code === 'Digit4') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, settings, onUpdateSettings, onClose]);

  const items = [
    { label: '1. 🎵 Musica di Sottofondo (BGM)', checked: settings.music },
    { label: '2. 🔊 Effetti Sonori (SFX)', checked: settings.soundEffects },
    { label: '3. 📳 Vibrazione Schermo (Screen Shake)', checked: settings.screenShake },
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2 className="modal-title">IMPOSTAZIONI</h2>
        <p className="modal-subtitle">Configurazione Audio & Effetti</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {items.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => toggleOption(idx)}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(40, 56, 84, 0.9)' : 'rgba(30, 41, 59, 0.6)',
                  border: isSelected ? '2px solid var(--color-oro-reale)' : '1px solid #334155',
                  cursor: 'pointer',
                  transform: isSelected ? 'scale(1.02)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? '#ffb703' : '#f8fafc' }}>
                  {isSelected ? '▶ ' : ''}{item.label}
                </span>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => {}}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-oro-reale)', cursor: 'pointer' }}
                />
              </div>
            );
          })}
        </div>

        <button
          className={`btn-arcade btn-arcade-primary ${selectedIndex === 3 ? 'is-selected' : ''}`}
          onClick={onClose}
          onMouseEnter={() => setSelectedIndex(3)}
        >
          {selectedIndex === 3 ? '▶ ' : ''}SALVA & CHIUDI
        </button>

        <div className="menu-nav-hint">
          ⌨️ Usa <kbd>▲</kbd> <kbd>▼</kbd> e <kbd>INVIO</kbd> / <kbd>SPAZIO</kbd> per attivare/disattivare, <kbd>ESC</kbd> per chiudere
        </div>
      </div>
    </div>
  );
};
