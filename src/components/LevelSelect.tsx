import React from 'react';
import { LEVELS } from '../levels';
import { useMenuKeyboard } from '../hooks/useMenuKeyboard';

interface LevelSelectProps {
  unlockedLevels: number;
  bestScores: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  unlockedLevels,
  bestScores,
  onSelectLevel,
  onClose,
}) => {
  const levelList = Object.values(LEVELS);
  // Gli elementi selezionabili sono i livelli + il pulsante "INDIETRO" finale
  const totalOptions = levelList.length + 1;

  const { selectedIndex, setSelectedIndex } = useMenuKeyboard(
    totalOptions,
    (index) => {
      if (index < levelList.length) {
        const lvl = levelList[index];
        if (lvl.id <= unlockedLevels) {
          onSelectLevel(lvl.id);
        }
      } else {
        onClose();
      }
    },
    onClose // Tasto ESC torna indietro
  );

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '640px' }}>
        <h2 className="modal-title">SELEZIONE LIVELLO</h2>
        <p className="modal-subtitle">Scegli la tua tappa per le vie di Torino</p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '22px',
            maxHeight: '340px',
            overflowY: 'auto',
          }}
        >
          {levelList.map((level, idx) => {
            const isUnlocked = level.id <= unlockedLevels;
            const bestScore = bestScores[level.id] || 0;
            const isSelected = selectedIndex === idx;

            return (
              <div
                key={level.id}
                onClick={() => isUnlocked && onSelectLevel(level.id)}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected
                    ? 'rgba(40, 56, 84, 0.9)'
                    : isUnlocked
                    ? 'rgba(30, 41, 59, 0.7)'
                    : 'rgba(15, 23, 42, 0.4)',
                  border: isSelected
                    ? '2px solid var(--color-oro-reale)'
                    : isUnlocked
                    ? '1px solid rgba(255, 183, 3, 0.4)'
                    : '1px solid #334155',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.45,
                  transform: isSelected ? 'scale(1.02)' : 'none',
                  boxShadow: isSelected ? '0 0 16px rgba(255, 183, 3, 0.5)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', color: isUnlocked ? '#f8fafc' : '#64748b' }}>
                    {isSelected ? '▶ ' : ''}{level.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {level.subtitle}
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: '0.75rem' }}>
                  {isUnlocked ? (
                    <span style={{ color: 'var(--color-oro-reale)' }}>⭐ {bestScore}</span>
                  ) : (
                    <span>🔒 BLOCCATO</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          className={`btn-arcade btn-arcade-secondary ${
            selectedIndex === levelList.length ? 'is-selected' : ''
          }`}
          onClick={onClose}
          onMouseEnter={() => setSelectedIndex(levelList.length)}
        >
          {selectedIndex === levelList.length ? '▶ ' : ''}INDIETRO
        </button>

        <div className="menu-nav-hint">
          ⌨️ Usa <kbd>▲</kbd> <kbd>▼</kbd> e <kbd>INVIO</kbd> per scegliere, <kbd>ESC</kbd> per tornare indietro
        </div>
      </div>
    </div>
  );
};
