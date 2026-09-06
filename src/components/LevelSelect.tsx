import React, { useState, useEffect } from 'react';
import { LEVELS } from '../levels';
import { CharacterId } from '../types/game';
import { TorinoWorldMap } from './TorinoWorldMap';

interface LevelSelectProps {
  unlockedLevels?: number;
  bestScores: Record<number, number>;
  characterId?: CharacterId;
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
          {/* Fontana Toret verde torinese con beccuccio dorato */}
          <rect x="108" y="88" width="6" height="17" fill="#1b4332" />
          <polygon points="106,88 111,83 116,88" fill="#1b4332" />
          <circle cx="107" cy="93" r="1.5" fill="#f59e0b" />
          <line x1="106" y1="94" x2="103" y2="99" stroke="#38bdf8" strokeWidth="1" />

          {/* Tram Storico GTT Linea 7 */}
          <rect x="125" y="78" width="75" height="24" rx="3" fill="#166534" />
          <rect x="125" y="72" width="75" height="8" fill="#fef08a" />
          <rect x="132" y="82" width="12" height="10" fill="#0f172a" />
          <rect x="148" y="82" width="12" height="10" fill="#0f172a" />
          <rect x="164" y="82" width="12" height="10" fill="#0f172a" />
          <rect x="180" y="82" width="12" height="10" fill="#0f172a" />
          <rect x="134" y="84" width="4" height="6" fill="#93c5fd" />
          <rect x="150" y="84" width="4" height="6" fill="#93c5fd" />
          <rect x="166" y="84" width="4" height="6" fill="#93c5fd" />
          <rect x="182" y="84" width="4" height="6" fill="#93c5fd" />
          {/* Faro dorato tram */}
          <circle cx="127" cy="94" r="3" fill="#fde047" />
          {/* Binari e strada */}
          <rect x="0" y="105" width="240" height="15" fill="#334155" />
          <line x1="0" y1="109" x2="240" y2="109" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6,4" />
        </svg>
      );

    case 2:
      // Quadro 2: Porta Palazzo & Il Grande Mercato
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky_m2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="70%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky_m2)" />
          {/* Sole caldo */}
          <circle cx="195" cy="25" r="14" fill="#fef08a" />
          {/* Tettoie e facciata liberty di Porta Palazzo */}
          <rect x="20" y="55" width="200" height="45" fill="#64748b" />
          <polygon points="120,30 30,55 210,55" fill="#475569" />
          {/* Orologio storico */}
          <circle cx="120" cy="46" r="6" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
          {/* Tendoni colorati del mercato */}
          <rect x="30" y="75" width="36" height="14" fill="#ef4444" />
          <rect x="74" y="75" width="36" height="14" fill="#22c55e" />
          <rect x="118" y="75" width="36" height="14" fill="#f59e0b" />
          <rect x="162" y="75" width="36" height="14" fill="#3b82f6" />
          {/* Cassette di frutta in legno */}
          <rect x="35" y="94" width="22" height="12" fill="#b45309" />
          <circle cx="41" cy="98" r="2.5" fill="#dc2626" />
          <circle cx="47" cy="98" r="2.5" fill="#16a34a" />
          <rect x="79" y="94" width="22" height="12" fill="#b45309" />
          <circle cx="85" cy="98" r="2.5" fill="#f59e0b" />
          <circle cx="91" cy="98" r="2.5" fill="#eab308" />
          {/* Selciato */}
          <rect x="0" y="106" width="240" height="14" fill="#334155" />
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
          {/* Arcate in pietra dei Murazzi con insegne */}
          <rect x="10" y="55" width="220" height="42" fill="#1e293b" />
          <path d="M20,97 L20,72 A 16 16 0 0 1 52 72 L52,97 Z" fill="#0f172a" />
          <path d="M68,97 L68,72 A 16 16 0 0 1 100 72 L100,97 Z" fill="#0f172a" />
          <path d="M116,97 L116,72 A 16 16 0 0 1 148 72 L148,97 Z" fill="#0f172a" />
          {/* Acqua notturna con riflessi colorati */}
          <rect x="0" y="97" width="240" height="23" fill="#090d16" />
          <line x1="30" y1="106" x2="70" y2="106" stroke="#ec4899" strokeWidth="1.5" opacity="0.7" />
          <line x1="90" y1="110" x2="135" y2="110" stroke="#06b6d4" strokeWidth="1.5" opacity="0.7" />
        </svg>
      );

    case 5:
      // Quadro 5: Piazza San Carlo & I Portici Reali
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky_sc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0369a1" />
              <stop offset="60%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky_sc)" />
          {/* Porticato barocco di Piazza San Carlo */}
          <rect x="10" y="48" width="220" height="52" fill="#334155" />
          <rect x="25" y="62" width="18" height="38" rx="8" fill="#cbd5e1" />
          <rect x="55" y="62" width="18" height="38" rx="8" fill="#cbd5e1" />
          <rect x="165" y="62" width="18" height="38" rx="8" fill="#cbd5e1" />
          <rect x="195" y="62" width="18" height="38" rx="8" fill="#cbd5e1" />
          {/* Monumento Caval 'd Brôns al centro */}
          <rect x="105" y="74" width="30" height="26" fill="#475569" />
          <ellipse cx="120" cy="62" rx="14" ry="8" fill="#b45309" />
          <circle cx="125" cy="52" r="5" fill="#f59e0b" />
          {/* Pavimentazione di marmo nobile */}
          <rect x="0" y="100" width="240" height="20" fill="#475569" />
        </svg>
      );

    case 6:
      // Quadro 6: Mole Antonelliana al tramonto
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky_mole" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#311042" />
              <stop offset="45%" stopColor="#7c2d12" />
              <stop offset="85%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky_mole)" />
          {/* Silhouette Maestosa della Mole */}
          <polygon points="120,4 122,25 118,25" fill="#1e1b4b" />
          <rect x="116" y="25" width="8" height="15" fill="#1e1b4b" />
          <polygon points="120,40 100,68 140,68" fill="#1e1b4b" />
          <rect x="94" y="68" width="52" height="42" fill="#1e1b4b" />
          <text x="105" y="58" fill="#ef4444" fontSize="4.5" fontWeight="bold" fontFamily="monospace">1 1 2 3 5 8</text>
          {/* Cavi ascensore */}
          <line x1="165" y1="35" x2="165" y2="120" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
          <rect x="158" y="58" width="14" height="12" rx="2" fill="#38bdf8" opacity="0.85" />
          <rect x="0" y="110" width="240" height="10" fill="#451a03" />
        </svg>
      );

    case 7:
      // Quadro 7: Museo Egizio & Cripta dei Faraoni
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky_eg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="60%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky_eg)" />
          {/* Piramide dorata all'orizzonte */}
          <polygon points="190,40 145,100 235,100" fill="#d97706" opacity="0.75" />
          <polygon points="190,40 190,100 235,100" fill="#b45309" opacity="0.85" />
          {/* Obelisco slanciato */}
          <polygon points="50,22 46,100 54,100" fill="#1c1917" />
          <polygon points="50,15 47,22 53,22" fill="#fbbf24" />
          {/* Sarcofago faraonico monumentale */}
          <rect x="95" y="58" width="34" height="42" rx="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="112" cy="70" r="7" fill="#fde047" />
          {/* Pavimento in pietra e torce */}
          <rect x="0" y="100" width="240" height="20" fill="#292524" />
          <circle cx="80" cy="92" r="3" fill="#f97316" />
          <circle cx="145" cy="92" r="3" fill="#f97316" />
        </svg>
      );

    case 8:
      // Quadro 8: Superga e la Tranvia a Dentiera
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky_sup" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3730a3" />
              <stop offset="45%" stopColor="#9333ea" />
              <stop offset="75%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky_sup)" />
          {/* Monviso */}
          <polygon points="35,80 75,26 115,80" fill="#60a5fa" />
          <polygon points="67,38 75,26 83,38" fill="#ffffff" />
          {/* Collina di Superga e Basilica */}
          <path d="M0,120 Q90,95 170,60 L240,48 L240,120 Z" fill="#14532d" />
          <rect x="188" y="32" width="34" height="18" fill="#fef08a" />
          <path d="M192,32 Q205,14 218,32 Z" fill="#ffd166" />
          {/* Dentiera */}
          <rect x="75" y="70" width="24" height="14" rx="2" fill="#dc2626" transform="rotate(-15, 75, 70)" />
        </svg>
      );

    case 9:
      // Quadro 9: Lingotto e la Pista sul Tetto
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky_ling" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="40%" stopColor="#3730a3" />
              <stop offset="75%" stopColor="#c026d3" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky_ling)" />
          {/* Stabilimento Lingotto */}
          <rect x="0" y="70" width="240" height="50" fill="#78350f" />
          {/* Curva Parabolica Nord */}
          <path d="M 0,70 Q 70,35 140,56 T 240,56" fill="none" stroke="#0f172a" strokeWidth="12" />
          <path d="M 0,64 Q 70,29 140,50 T 240,50" fill="none" stroke="#dc2626" strokeWidth="2.5" />
          {/* Bolla Renzo Piano */}
          <circle cx="195" cy="42" r="16" fill="#38bdf8" opacity="0.75" />
        </svg>
      );

    case 10:
      // Quadro 10: Piazza Statuto & I Sotterranei Alchemici (Boss Finale)
      return (
        <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky_stat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="40%" stopColor="#3b0764" />
              <stop offset="80%" stopColor="#701a75" />
              <stop offset="100%" stopColor="#831843" />
            </linearGradient>
          </defs>
          <rect width="240" height="120" fill="url(#sky_stat)" />
          {/* Luna rosso sangue */}
          <circle cx="205" cy="28" r="16" fill="#f43f5e" />
          <circle cx="205" cy="28" r="12" fill="#e11d48" />
          {/* Obelisco Geodetico di Piazza Statuto */}
          <rect x="40" y="42" width="16" height="58" fill="#0f172a" />
          <circle cx="48" cy="34" r="7" fill="#fbbf24" />
          {/* Rocce vulcaniche delle grotte alchemiche */}
          <polygon points="75,100 100,55 125,100" fill="#1e1b4b" />
          <polygon points="120,100 150,48 180,100" fill="#2e1065" />
          {/* Sagoma con Corna Dorate del Toro Alchemico Boss Finale */}
          <ellipse cx="120" cy="74" rx="20" ry="14" fill="#0f172a" />
          <path d="M 112,64 Q 116,48 126,44" stroke="#f59e0b" strokeWidth="3" fill="none" />
          <path d="M 128,64 Q 124,48 114,44" stroke="#f59e0b" strokeWidth="3" fill="none" />
          {/* Occhi rossi incandescenti del Boss */}
          <circle cx="116" cy="72" r="2.5" fill="#ef4444" />
          <circle cx="124" cy="72" r="2.5" fill="#ef4444" />
          {/* Terreno con fiamme alchemiche */}
          <rect x="0" y="100" width="240" height="20" fill="#18181b" />
          <line x1="0" y1="102" x2="240" y2="102" stroke="#f43f5e" strokeWidth="2" strokeDasharray="8,6" />
        </svg>
      );

    default:
      return null;
  }
};

const LEVEL_METADATA: Record<number, { tag: string; diff: string; nemici: string }> = {
  1: { tag: '🏛️ CENTRO STORICO', diff: '⭐', nemici: 'Piccioni, Vigili con Paletta, Tram 7' },
  2: { tag: '🍎 PORTA PALAZZO', diff: '⭐⭐', nemici: 'Torinesi col carrello, Gabbiani golosi' },
  3: { tag: '🌳 PARCO VALENTINO', diff: '⭐⭐', nemici: 'Nutrie del Po, Scoiattoli balzanti & Barconi' },
  4: { tag: '🌙 MURAZZI DI NOTTE', diff: '⭐⭐⭐', nemici: 'Rider su Monopattino, Regina Nutria (BOSS 4 HP)' },
  5: { tag: '☕ PIAZZA SAN CARLO', diff: '⭐⭐⭐', nemici: 'Vigili con Fischietto, Caval \'d Brôns' },
  6: { tag: '🗼 MOLE ANTONELLIANA', diff: '⭐⭐⭐⭐', nemici: 'Gabbiani in picchiata, Re Piccione (BOSS 4 HP)' },
  7: { tag: '🏺 MUSEO EGIZIO', diff: '⭐⭐⭐⭐', nemici: 'Guardiani del museo, Spuntoni di granito' },
  8: { tag: '🐗 COLLINA SUPERGA', diff: '⭐⭐⭐⭐⭐', nemici: 'Cinghiali feroci in carica (NO Stomp) & Dentiera' },
  9: { tag: '🤖 LINGOTTO FIAT', diff: '⭐⭐⭐⭐⭐', nemici: 'Robot Saldatori, Comau Titan (BOSS 5 HP)' },
  10: { tag: '🐂 PIAZZA STATUTO', diff: '⭐⭐⭐⭐⭐⭐ (MAX)', nemici: 'Trappole alchemiche, TAURUS INVICTUS (BOSS 8 HP)' },
};

export const LevelSelect: React.FC<LevelSelectProps> = ({
  unlockedLevels,
  bestScores,
  characterId,
  onSelectLevel,
  onClose,
}) => {
  const levelList = Object.values(LEVELS);
  const [viewMode, setViewMode] = useState<'map' | 'gallery'>('map');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Scorciatoie da tastiera immediate per la galleria a quadri
  useEffect(() => {
    if (viewMode !== 'gallery') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Tasti numerici 1..9 e 0 (per 10)
      if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9', 'Numpad0'].includes(e.code)) {
        e.preventDefault();
        const raw = e.code.replace('Digit', '').replace('Numpad', '');
        const id = raw === '0' ? 10 : parseInt(raw, 10);
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
  }, [viewMode, selectedIndex, levelList, onSelectLevel, onClose]);

  // Visualizzazione predefinita: Mappa del Mondo di Torino (Super Mario World style)
  if (viewMode === 'map') {
    return (
      <TorinoWorldMap
        initialLevelId={levelList[selectedIndex]?.id || 1}
        bestScores={bestScores}
        unlockedLevels={unlockedLevels}
        characterId={characterId}
        onSelectLevel={onSelectLevel}
        onSwitchToGallery={() => setViewMode('gallery')}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card level-select-card" style={{ maxWidth: '900px', width: '95%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 className="modal-title level-modal-title" style={{ marginBottom: '2px' }}>SCEGLI IL TUO QUADRO</h2>
            <p className="modal-subtitle level-modal-subtitle" style={{ marginBottom: 0 }}>
              Tutti i 10 livelli sbloccati! Clicca su un quadro o premi il numero <kbd>1</kbd>-<kbd>9</kbd>, <kbd>0</kbd>.
            </p>
          </div>
          <button
            className="btn-arcade"
            style={{ padding: '6px 14px', fontSize: '0.66rem', background: '#ffb703', color: '#0f172a', whiteSpace: 'nowrap' }}
            onClick={() => setViewMode('map')}
          >
            🗺️ TORNA ALLA MAPPA
          </button>
        </div>

        {/* Griglia a Quadri con Anteprima d'Arte */}
        <div className="level-gallery-grid">
          {levelList.map((level, idx) => {
            const isSelected = selectedIndex === idx;
            const meta = LEVEL_METADATA[level.id] || { tag: 'TORINO', diff: '⭐⭐⭐', nemici: 'Ostacoli torinesi' };
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
                  <div className="level-quadro-enemies">
                    <span className="level-enemies-label">Nemici:</span> {meta.nemici}
                  </div>
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
        <div className="level-select-footer">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-arcade btn-arcade-secondary level-btn-back"
              onClick={() => setViewMode('map')}
            >
              🗺️ VISTA MAPPA
            </button>
            <button
              className="btn-arcade btn-arcade-secondary level-btn-back"
              onClick={onClose}
            >
              ◀ TORNA AL MENU (ESC)
            </button>
          </div>

          <div className="menu-nav-hint level-nav-hint">
            ⌨️ Premi <kbd>1</kbd>-<kbd>9</kbd>, <kbd>0</kbd> per avvio rapido | Frecce <kbd>◀</kbd><kbd>▶</kbd><kbd>▲</kbd><kbd>▼</kbd> + <kbd>INVIO</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
