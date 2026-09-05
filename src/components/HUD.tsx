import React from 'react';
import { HudData } from '../types/game';

interface HUDProps {
  data: HudData;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({ data, onPause }) => {
  const hearts = Array.from({ length: data.maxLives }, (_, i) => (
    <span key={i} style={{ opacity: i < data.lives ? 1 : 0.25 }}>
      ❤️
    </span>
  ));

  const minutes = Math.floor(data.timeLeft / 60);
  const seconds = data.timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const activePowerUps = data.activePowerUps || [];
  const activeSynergies = data.activeSynergies || [];

  return (
    <div className="hud-container">
      <div className="hud-left">
        <div className="hud-stats-row">
          <div className="hud-item lives" title="Vite">{hearts}</div>
          <div className="hud-item score" title="Punteggio">
            <span>⭐</span>
            <span>{data.score}</span>
          </div>
          <div className="hud-item gianduiotti" title="Gianduiotti">
            <span>🍫</span>
            <span>{data.gianduiotti}</span>
          </div>
          <div className={`hud-item time ${data.timeLeft <= 30 ? 'warning' : ''}`} title="Tempo Residuo">
            <span>⏱️</span>
            <span>{timeFormatted}</span>
          </div>
        </div>

        {/* Banner Sinergie Combinate Speciali */}
        {activeSynergies.length > 0 && (
          <div className="synergies-container">
            {activeSynergies.map((synergy) => (
              <div
                key={synergy.id}
                className="synergy-banner"
                style={{
                  borderColor: synergy.color,
                  boxShadow: `0 0 16px ${synergy.color}88, inset 0 0 8px ${synergy.color}33`,
                }}
              >
                <span className="synergy-badge" style={{ backgroundColor: synergy.color }}>
                  {synergy.badge}
                </span>
                <div className="synergy-text">
                  <span className="synergy-name" style={{ color: synergy.color }}>
                    {synergy.name}
                  </span>
                  <span className="synergy-desc">{synergy.description}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lista Power-up Multipli Attivi con Timer individuali e Bonus/Malus */}
        {activePowerUps.length > 0 && (
          <div className="powerup-list">
            {activePowerUps.map((powerUp) => (
              <div
                key={powerUp.type}
                className="powerup-card"
                style={{
                  borderColor: powerUp.color,
                  boxShadow: `0 0 12px ${powerUp.color}44`,
                }}
              >
                <div className="powerup-header">
                  <span className="powerup-title" style={{ color: powerUp.color }}>
                    {powerUp.name} <span className="powerup-timer">({powerUp.durationLeft}s)</span>
                  </span>
                  <div className="powerup-progress">
                    <div
                      className="powerup-fill"
                      style={{
                        width: `${Math.round(powerUp.durationPercent * 100)}%`,
                        backgroundColor: powerUp.color,
                      }}
                    />
                  </div>
                </div>

                <div className="powerup-details">
                  <div className="powerup-bonus">{powerUp.bonusText}</div>
                  <div className="powerup-malus">{powerUp.malusText}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hud-right">
        <button className="btn-pause" onClick={onPause}>
          ⏸ PAUSA
        </button>
      </div>
    </div>
  );
};
