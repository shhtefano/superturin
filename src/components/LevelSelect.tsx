import React, { useState, useEffect } from 'react';
import { LEVELS } from '../levels';

interface LevelSelectProps {
  unlockedLevels?: number;
  bestScores: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

// Miniature artistiche per ogni quadro di Torino
const LevelQuadroArt: React.FC<{ levelId: number }> = ({ levelId }) => {
  switch (levelId) {
    case 1:
      // Quadro 1: Piazza Castello & Tram GTT
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky1)" />
          {/* Sole Mario */}
          <circle cx="205" cy="24" r="16" fill="#fef08a" />
          <circle cx="205" cy="24" r="12" fill="#fde047" />
          {/* Nuvola Mario con occhietti */}
          <ellipse cx="60" cy="28" rx="22" ry="10" fill="#ffffff" />
          <ellipse cx="70" cy="22" rx="14" ry="10" fill="#ffffff" />
          <ellipse cx="50" cy="24" rx="12" ry="8" fill="#ffffff" />
          <rect x="58" y="24" width="2" height="4" fill="#0f172a" />
          <rect x="66" y="24" width="2" height="4" fill="#0f172a" />
          {/* Colline lontane */}
          <path d="M0,120 Q50,75 110,95 T240,85 L240,120 Z" fill="#22c55e" />
          {/* Portici di Piazza Castello */}
          <rect x="15" y="65" width="85" height="40" fill="#1e3a8a" opacity="0.85" />
          <rect x="25" y="78" width="14" height="27" rx="7" fill="#bae6fd" />
          <rect x="48" y="78" width="14" height="27" rx="7" fill="#bae6fd" />
          <rect x="71" y="78" width="14" height="27" rx="7" fill="#bae6fd" />
          {/* Tram Storico GTT */}
          <rect x="125" y="78" width="75" height="24" rx="3" fill="#d97706" />
          <rect x="125" y="96" width="75" height="6" fill="#365314" />
          <rect x="132" y="82" width="12" height="10" fill="#fef08a" />
          <rect x="148" y="82" width="12" height="10" fill="#fef08a" />
          <rect x="164" y="82" width="12" height="10" fill="#fef08a" />
          <rect x="180" y="82" width="12" height="10" fill="#fef08a" />
          {/* Binari e strada */}
          <rect x="0" y="105" width="240" height="15" fill="#334155" />
          <line x1="0" y1="109" x2="240" y2="109" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6,4" />
        </svg>
      );

    case 2:
      // Quadro 2: Mole Antonelliana al tramonto
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#311042" />
              <stop offset="45%" stopColor="#7c2d12" />
              <stop offset="85%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky2)" />
          {/* Stelle brillanti */}
          <circle cx="28" cy="18" r="1.5" fill="#ffffff" />
          <circle cx="55" cy="35" r="1.2" fill="#ffffff" />
          <circle cx="195" cy="22" r="1.5" fill="#ffffff" />
          <circle cx="220" cy="40" r="1.2" fill="#ffffff" />
          <path d="M36,12 A 10 10 0 0 0 46 22 A 10 10 0 0 1 36 12 Z" fill="#fef08a" />
          {/* Silhouette Maestosa della Mole */}
          <polygon points="120,4 122,25 118,25" fill="#1e1b4b" />
          <rect x="116" y="25" width="8" height="15" fill="#1e1b4b" />
          <polygon points="120,40 100,68 140,68" fill="#1e1b4b" />
          <rect x="94" y="68" width="52" height="42" fill="#1e1b4b" />
          {/* Finestrelle illuminate della Mole */}
          <rect x="106" y="74" width="6" height="8" fill="#fef08a" />
          <rect x="117" y="74" width="6" height="8" fill="#fef08a" />
          <rect x="128" y="74" width="6" height="8" fill="#fef08a" />
          <rect x="106" y="88" width="6" height="8" fill="#fef08a" />
          <rect x="117" y="88" width="6" height="8" fill="#fef08a" />
          <rect x="128" y="88" width="6" height="8" fill="#fef08a" />
          {/* Cavi dell'ascensore panoramico */}
          <line x1="165" y1="35" x2="165" y2="120" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
          <rect x="158" y="58" width="14" height="12" rx="2" fill="#38bdf8" opacity="0.85" />
          {/* Base mattoni */}
          <rect x="0" y="110" width="240" height="10" fill="#451a03" />
        </svg>
      );

    case 3:
      // Quadro 3: Parco del Valentino e Fiume Po
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="60%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky3)" />
          {/* Alberi verdi frondosi del Valentino */}
          <circle cx="45" cy="55" r="28" fill="#15803d" />
          <circle cx="75" cy="50" r="24" fill="#16a34a" />
          <rect x="42" y="70" width="8" height="30" fill="#78350f" />
          <rect x="72" y="65" width="8" height="35" fill="#78350f" />
          {/* Borgo Medievale all'orizzonte */}
          <polygon points="195,50 185,75 205,75" fill="#475569" />
          <rect x="188" y="75" width="14" height="25" fill="#334155" />
          <rect x="202" y="70" width="26" height="30" fill="#475569" />
          {/* Onde blu del Fiume Po */}
          <path d="M0,88 C50,82 80,95 140,88 C180,82 210,92 240,86 L240,120 L0,120 Z" fill="#0369a1" />
          <path d="M0,98 C60,92 90,104 150,96 C190,90 220,102 240,96 L240,120 L0,120 Z" fill="#0284c7" />
          {/* Barcone / Pontile in legno galleggiante */}
          <rect x="110" y="86" width="48" height="14" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="2" />
          <line x1="120" y1="88" x2="120" y2="98" stroke="#78350f" strokeWidth="1" />
          <line x1="134" y1="88" x2="134" y2="98" stroke="#78350f" strokeWidth="1" />
          <line x1="148" y1="88" x2="148" y2="98" stroke="#78350f" strokeWidth="1" />
          {/* Scoiattolino arancione */}
          <circle cx="95" cy="74" r="5" fill="#ea580c" />
          <ellipse cx="92" cy="78" rx="6" ry="4" fill="#c2410c" />
        </svg>
      );

    case 4:
      // Quadro 4: Murazzi del Po di Notte & Luci d'Artista
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="65%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky4)" />
          {/* Luci d'Artista Neon sospese */}
          <polyline points="20,24 50,15 80,28 120,16 160,30 200,18 225,25" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4,3" />
          <circle cx="50" cy="15" r="3" fill="#ec4899" />
          <circle cx="120" cy="16" r="3.5" fill="#38bdf8" />
          <circle cx="200" cy="18" r="3" fill="#facc15" />
          {/* Arcate in pietra dei Murazzi */}
          <rect x="10" y="55" width="220" height="42" fill="#1e293b" />
          <path d="M20,97 L20,72 A 16 16 0 0 1 52 72 L52,97 Z" fill="#0f172a" />
          <path d="M68,97 L68,72 A 16 16 0 0 1 100 72 L100,97 Z" fill="#0f172a" />
          <path d="M116,97 L116,72 A 16 16 0 0 1 148 72 L148,97 Z" fill="#0f172a" />
          <path d="M164,97 L164,72 A 16 16 0 0 1 196 72 L196,97 Z" fill="#0f172a" />
          {/* Bagliore Rave / Club da dentro le arcate */}
          <ellipse cx="36" cy="85" rx="10" ry="7" fill="#ec4899" opacity="0.6" />
          <ellipse cx="84" cy="85" rx="10" ry="7" fill="#06b6d4" opacity="0.6" />
          <ellipse cx="132" cy="85" rx="10" ry="7" fill="#a855f7" opacity="0.6" />
          <ellipse cx="180" cy="85" rx="10" ry="7" fill="#ec4899" opacity="0.6" />
          {/* Acqua notturna con riflessi colorati */}
          <rect x="0" y="97" width="240" height="23" fill="#090d16" />
          <line x1="30" y1="106" x2="70" y2="106" stroke="#ec4899" strokeWidth="1.5" opacity="0.7" />
          <line x1="90" y1="110" x2="135" y2="110" stroke="#06b6d4" strokeWidth="1.5" opacity="0.7" />
          <line x1="150" y1="107" x2="190" y2="107" stroke="#a855f7" strokeWidth="1.5" opacity="0.7" />
        </svg>
      );

    case 5:
      // Quadro 5: Superga e la Tranvia a Dentiera
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky5" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3730a3" />
              <stop offset="45%" stopColor="#9333ea" />
              <stop offset="75%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky5)" />
          {/* Vette delle Alpi innevate */}
          <polygon points="15,75 50,40 85,75" fill="#cbd5e1" />
          <polygon points="40,50 50,40 60,50" fill="#ffffff" />
          <polygon points="65,75 95,35 125,75" fill="#94a3b8" />
          <polygon points="85,48 95,35 105,48" fill="#ffffff" />
          {/* Collina ripida di Superga */}
          <path d="M0,120 Q90,95 170,60 L240,48 L240,120 Z" fill="#14532d" />
          {/* Basilica di Superga in cima */}
          <rect x="188" y="32" width="34" height="18" fill="#fef08a" />
          <path d="M192,32 Q205,14 218,32 Z" fill="#ffd166" />
          <rect x="204" y="8" width="2" height="7" fill="#ffd166" />
          <line x1="202" y1="10" x2="208" y2="10" stroke="#ffd166" strokeWidth="1" />
          {/* Colonne pronao */}
          <line x1="192" y1="36" x2="192" y2="50" stroke="#b45309" strokeWidth="1.5" />
          <line x1="198" y1="36" x2="198" y2="50" stroke="#b45309" strokeWidth="1.5" />
          <line x1="212" y1="36" x2="212" y2="50" stroke="#b45309" strokeWidth="1.5" />
          <line x1="218" y1="36" x2="218" y2="50" stroke="#b45309" strokeWidth="1.5" />
          {/* Binari dentati della Tranvia di Sassi in salita */}
          <line x1="0" y1="112" x2="170" y2="68" stroke="#e2e8f0" strokeWidth="2.5" />
          <line x1="0" y1="116" x2="170" y2="72" stroke="#e2e8f0" strokeWidth="2.5" />
          <line x1="20" y1="102" x2="26" y2="114" stroke="#94a3b8" strokeWidth="2" />
          <line x1="60" y1="90" x2="66" y2="102" stroke="#94a3b8" strokeWidth="2" />
          <line x1="100" y1="78" x2="106" y2="90" stroke="#94a3b8" strokeWidth="2" />
          <line x1="140" y1="66" x2="146" y2="78" stroke="#94a3b8" strokeWidth="2" />
          {/* Piccolo vagone storico rosso della Dentiera */}
          <rect x="75" y="70" width="24" height="14" rx="2" fill="#dc2626" transform="rotate(-15, 75, 70)" />
        </svg>
      );

    case 6:
      // Quadro 6: Lingotto e la Pista sul Tetto (La Pista 500)
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky6" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="40%" stopColor="#3730a3" />
              <stop offset="75%" stopColor="#c026d3" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky6)" />
          {/* Alpi innevate al crepuscolo */}
          <polygon points="10,65 40,32 70,65" fill="#475569" />
          <polygon points="32,40 40,32 48,40" fill="#f8fafc" />
          <polygon points="55,65 85,25 115,65" fill="#334155" />
          <polygon points="76,36 85,25 94,36" fill="#f8fafc" />
          <polygon points="100,65 130,35 160,65" fill="#475569" />

          {/* Stabilimento Lingotto: facciata industriale a mattoni e finestre */}
          <rect x="0" y="70" width="240" height="50" fill="#78350f" />
          {/* Finestrelle rettangolari tipiche del Lingotto */}
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={10 + i * 19} y="78" width="11" height="8" fill="#fef08a" opacity="0.8" />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={`b_${i}`} x={10 + i * 19} y="92" width="11" height="8" fill="#fef08a" opacity="0.6" />
          ))}

          {/* La celebre Curva Parabolica Nord della Pista sul Tetto */}
          <path d="M 0,70 Q 70,35 140,56 T 240,56" fill="none" stroke="#0f172a" strokeWidth="12" />
          <path d="M 0,70 Q 70,35 140,56 T 240,56" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4,4" />
          {/* Parapetto metallico rosso della Pista 500 */}
          <path d="M 0,64 Q 70,29 140,50 T 240,50" fill="none" stroke="#dc2626" strokeWidth="2.5" />

          {/* La Bolla di Renzo Piano (sala riunioni e eliporto in cristallo sul tetto) */}
          <circle cx="195" cy="42" r="16" fill="#38bdf8" opacity="0.75" />
          <circle cx="195" cy="42" r="14" fill="#0284c7" opacity="0.6" />
          <ellipse cx="191" cy="38" rx="6" ry="3" fill="#ffffff" opacity="0.7" />
          <line x1="175" y1="56" x2="215" y2="56" stroke="#94a3b8" strokeWidth="2" />

          {/* Silhouette sfrecciante di una FIAT 500 sulla curva parabolica */}
          <g transform="translate(68, 38) rotate(-14)">
            <ellipse cx="12" cy="7" rx="13" ry="6" fill="#ef4444" />
            <circle cx="12" cy="3" rx="7" ry="4" fill="#67e8f9" />
            <circle cx="6" cy="11" r="3" fill="#0f172a" />
            <circle cx="18" cy="11" r="3" fill="#0f172a" />
            <circle cx="24" cy="7" r="2" fill="#fef08a" />
          </g>
        </svg>
      );

    default:
      return null;
  }
};

const LEVEL_METADATA: Record<number, { tag: string; diff: string }> = {
  1: { tag: '🏛️ CENTRO STORICO', diff: '⭐⭐' },
  2: { tag: '🗼 SCALATA VERTICALE', diff: '⭐⭐⭐⭐' },
  3: { tag: '🌳 NATURA & FIUME', diff: '⭐⭐⭐' },
  4: { tag: '🌙 RAVE NOTTURNO', diff: '⭐⭐⭐⭐' },
  5: { tag: '👑 TRANVIA SUPERGA', diff: '⭐⭐⭐⭐⭐' },
  6: { tag: '🏎️ PISTA SUL TETTO', diff: '⭐⭐⭐⭐⭐' },
};

export const LevelSelect: React.FC<LevelSelectProps> = ({
  bestScores,
  onSelectLevel,
  onClose,
}) => {
  const levelList = Object.values(LEVELS);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Scorciatoie da tastiera immediate (1-6 lancia subito il livello!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tasti numerici 1, 2, 3, 4, 5, 6 (tastiera normale e tastierino numerico) per avvio istantaneo
      if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6'].includes(e.code)) {
        e.preventDefault();
        const id = parseInt(e.code.replace('Digit', '').replace('Numpad', ''), 10);
        if (LEVELS[id]) {
          onSelectLevel(id);
        }
        return;
      }

      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % levelList.length);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + levelList.length) % levelList.length);
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(levelList.length - 1, prev + 3));
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(0, prev - 3));
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        const selectedLevel = levelList[selectedIndex];
        if (selectedLevel) {
          onSelectLevel(selectedLevel.id);
        }
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, levelList, onSelectLevel, onClose]);

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '900px', width: '95%' }}>
        <h2 className="modal-title">SCEGLI IL TUO QUADRO</h2>
        <p className="modal-subtitle" style={{ marginBottom: '16px' }}>
          Tutti i 6 livelli sbloccati! Clicca su un quadro o premi il numero <kbd>1</kbd>-<kbd>6</kbd> per giocare subito.
        </p>

        {/* Griglia a Quadri con Anteprima d'Arte */}
        <div className="level-gallery-grid">
          {levelList.map((level, idx) => {
            const isSelected = selectedIndex === idx;
            const meta = LEVEL_METADATA[level.id] || { tag: 'TORINO', diff: '⭐⭐⭐' };
            const bestScore = bestScores[level.id] || 0;

            return (
              <div
                key={level.id}
                className={`level-quadro ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectLevel(level.id)}
                onMouseEnter={() => setSelectedIndex(idx)}
                title={`Premi ${level.id} o clicca per giocare subito a ${level.title}`}
              >
                {/* Cornice con Anteprima Grafica */}
                <div className="level-quadro-art">
                  <LevelQuadroArt levelId={level.id} />
                  <span className="level-quadro-tag">{meta.tag}</span>
                  <span className="level-quadro-diff" title={`Difficoltà: ${meta.diff}`}>
                    {meta.diff}
                  </span>
                </div>

                {/* Info Livello */}
                <div className="level-quadro-info">
                  <div className="level-quadro-title">
                    <span>{level.id}. {level.title.replace(`Livello ${level.id} — `, '')}</span>
                  </div>
                  <div className="level-quadro-sub">{level.subtitle}</div>
                </div>

                {/* Punteggio e Pulsante Gioca */}
                <div className="level-quadro-footer">
                  <span className="level-quadro-score">
                    {bestScore > 0 ? `⭐ ${bestScore}` : '⭐ Record: 0'}
                  </span>
                  <span className="level-quadro-play-btn">
                    GIOCA [{level.id}] ▶
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pulsante Indietro & Hint comandi */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <button
            className="btn-arcade btn-arcade-secondary"
            style={{ width: 'auto', padding: '10px 24px' }}
            onClick={onClose}
          >
            ◀ TORNA AL MENU (ESC)
          </button>

          <div className="menu-nav-hint" style={{ margin: 0 }}>
            ⌨️ Premi <kbd>1</kbd>-<kbd>6</kbd> per avvio rapido | Frecce <kbd>◀</kbd><kbd>▶</kbd><kbd>▲</kbd><kbd>▼</kbd> + <kbd>INVIO</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
