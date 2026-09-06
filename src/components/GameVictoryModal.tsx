import React, { useEffect, useState } from 'react';
import { useMenuKeyboard } from '../hooks/useMenuKeyboard';
import { SaveManager } from '../game/storage/SaveManager';

interface GameVictoryModalProps {
  score: number;
  gianduiotti: number;
  timeLeft: number;
  onRestart: () => void;
  onOpenMap: () => void;
  onQuitToMenu: () => void;
}

export const GameVictoryModal: React.FC<GameVictoryModalProps> = ({
  score,
  gianduiotti,
  timeLeft,
  onRestart,
  onOpenMap,
  onQuitToMenu,
}) => {
  const [totalScore, setTotalScore] = useState<number>(0);
  const [characterName, setCharacterName] = useState<string>('Shhte');

  useEffect(() => {
    const save = SaveManager.load();
    const sum = Object.values(save.bestScores).reduce((acc, s) => acc + s, 0);
    setTotalScore(Math.max(sum, score));
    const charMap: Record<string, string> = {
      shhte: 'Shhte il Boss',
      ugo: 'Ugo il Maestro',
      jari: 'Jari l\'Indomabile',
      jonson: 'Jonson lo Scienziato',
      krebs: 'Krebs il Samurai',
      devis: 'Devis il Mago',
      willy: 'Willy lo Swift',
      benedetta: 'Benedetta la Regina',
      alessiuccia: 'Alessiuccia Glamour',
      ludo: 'Ludo Hacker EMP',
      ariannuccia: 'Ariannuccia Alpina',
      prato: 'Prato lo Chef',
      sandrone: 'Sandrone Martello FIAT',
      vinzert: 'Vinzert 808 Bass',
    };
    setCharacterName(charMap[save.selectedCharacter] || 'Eroe Sabaudo');
  }, [score]);

  const options = [
    { label: '1. RIGIOCA DAL LIVELLO 1', action: onRestart, primary: true },
    { label: '2. MAPPA DEL MONDO DI TORINO', action: onOpenMap, primary: false },
    { label: '3. MENU PRINCIPALE', action: onQuitToMenu, primary: false },
  ];

  const { selectedIndex, setSelectedIndex } = useMenuKeyboard(
    options.length,
    (index) => options[index].action()
  );

  return (
    <div className="modal-backdrop" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(5, 5, 15, 0.88)' }}>
      <div
        className="modal-card"
        style={{
          borderColor: '#ffb703',
          maxWidth: '560px',
          boxShadow: '0 0 35px rgba(255, 183, 3, 0.45), 0 0 70px rgba(239, 68, 68, 0.25)',
          background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #090d16 100%)',
        }}
      >
        <div style={{ fontSize: '2.8rem', textAlign: 'center', marginBottom: '4px' }}>
          👑 🏆 🐂
        </div>

        <h2
          className="modal-title"
          style={{
            fontSize: '1.55rem',
            letterSpacing: '1px',
            color: '#ffb703',
            textShadow: '0 0 15px rgba(255, 183, 3, 0.6)',
            marginBottom: '4px',
          }}
        >
          HAI SALVATO TORINO!
        </h2>
        <p className="modal-subtitle" style={{ color: '#bae6fd', fontSize: '0.82rem', marginBottom: '14px' }}>
          Taurus Invictus è stato sconfitto! Hai completato tutti i 10 livelli storici e liberato la città dalla magia nera!
        </p>

        {/* Box Statistiche Trionfali */}
        <div
          className="modal-stats-box"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1.5px solid rgba(255, 183, 3, 0.35)',
            borderRadius: '12px',
            padding: '12px 18px',
            marginBottom: '16px',
            textAlign: 'left',
          }}
        >
          <div style={{ marginBottom: '6px' }}>
            🌟 <strong>Eroe Reale:</strong> <span style={{ color: '#fde047', fontWeight: 'bold' }}>{characterName}</span>
          </div>
          <div style={{ marginBottom: '6px' }}>
            ⭐ <strong>Punteggio Livello 10:</strong> <span style={{ color: '#38bdf8' }}>{score}</span>
          </div>
          <div style={{ marginBottom: '6px' }}>
            🏆 <strong>Punteggio Complessivo:</strong> <span style={{ color: '#ffb703', fontWeight: 'bold' }}>{totalScore}</span>
          </div>
          <div style={{ marginBottom: '6px' }}>
            🍫 <strong>Gianduiotti Raccolti:</strong> <span style={{ color: '#ffe066' }}>{gianduiotti}</span>
          </div>
          <div>
            ⏱️ <strong>Tempo Rimasto Finale:</strong> <span style={{ color: '#4ade80' }}>{timeLeft}s</span>
          </div>
        </div>

        <div
          style={{
            fontStyle: 'italic',
            fontSize: '0.74rem',
            color: '#cbd5e1',
            marginBottom: '16px',
            padding: '6px 10px',
            borderLeft: '3px solid #ffb703',
            background: 'rgba(255, 183, 3, 0.08)',
          }}
        >
          "Sotto la Mole e sopra i Murazzi, da Piazza Castello alle fiamme di Statuto: sei la leggenda vivente di Torino!"
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
                style={{ width: '100%', marginBottom: '8px' }}
              >
                {isSelected ? '▶ ' : ''}{opt.label}
              </button>
            );
          })}
        </div>

        <div className="menu-nav-hint" style={{ marginTop: '10px' }}>
          ⌨️ Premi <kbd>INVIO</kbd> per confermare o <kbd>▲</kbd> <kbd>▼</kbd> per scegliere
        </div>
      </div>
    </div>
  );
};
