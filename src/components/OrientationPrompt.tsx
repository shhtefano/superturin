import React, { useState, useEffect } from 'react';
import { toggleFullscreen } from '../utils/fullscreen';

export const OrientationPrompt: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Rileva se lo schermo è in verticale (altezza > larghezza)
      const isWindowPortrait = window.innerHeight > window.innerWidth;
      // Consideriamo dispositivo mobile o touch
      const isTouchOrSmall =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 850;

      setIsPortrait(isWindowPortrait && isTouchOrSmall);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleRequestLandscapeFullscreen = () => {
    toggleFullscreen();
  };

  if (!isPortrait) return null;

  return (
    <div className="orientation-modal-backdrop">
      <div className="orientation-card">
        {/* Telefono animato che ruota in orizzontale */}
        <div className="rotate-phone-anim">
          <svg viewBox="0 0 100 100" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="25"
              y="15"
              width="50"
              height="70"
              rx="8"
              stroke="#ffb703"
              strokeWidth="4"
              fill="rgba(255, 183, 3, 0.12)"
            />
            {/* Schermo interno */}
            <rect x="30" y="25" width="40" height="48" rx="3" fill="#38bdf8" opacity="0.3" />
            {/* Altoparlante e tasto home */}
            <line x1="44" y1="20" x2="56" y2="20" stroke="#ffb703" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="78" r="3" fill="#ffb703" />
            {/* Frecce di rotazione */}
            <path
              d="M 82,32 A 38 38 0 0 1 82,68"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="4,4"
            />
            <polygon points="86,68 76,68 81,77" fill="#ffffff" />
          </svg>
        </div>

        <h2 className="orientation-title">RUOTA IL DISPOSITIVO</h2>
        <p className="orientation-text">
          Super Turin è un platformer arcade ad alta velocità progettato per lo <strong>schermo orizzontale</strong>!
          Gira il tuo smartphone in <strong>orizzontale</strong> per giocare con il Joypad integrato.
        </p>

        <button
          type="button"
          className="btn-arcade btn-arcade-primary"
          style={{ width: '100%', fontSize: '0.75rem', padding: '14px 20px', marginTop: '14px' }}
          onClick={handleRequestLandscapeFullscreen}
        >
          ⛶ ENTRA A SCHERMO INTERO ORIZZONTALE
        </button>
      </div>
    </div>
  );
};
