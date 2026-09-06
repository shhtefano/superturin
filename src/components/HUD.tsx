import React from 'react';
import { HudData } from '../types/game';

interface HUDProps {
  data: HudData;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({ data, onPause }) => {
  const hearts = Array.from({ length: data.maxLives }, (_, i) => (
    <span key={i} className="hud-heart" style={{ opacity: i < data.lives ? 1 : 0.25 }}>
      ❤️
    </span>
  ));

  const minutes = Math.floor(data.timeLeft / 60);
  const seconds = data.timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const activePowerUps = data.activePowerUps || [];

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

        {/* Indicatori Compatti Effetti Attivi (Icone Valore Bonus / Malus Arcade) */}
        {activePowerUps.length > 0 && (
          <div className="status-effects-bar">
            {/* Power-up attivi con icone valore Bonus/Malus e timer */}
            {activePowerUps.map((powerUp) => (
              <div
                key={powerUp.type}
                className="status-pill powerup-pill"
                style={{
                  borderColor: powerUp.color,
                  boxShadow: `0 0 8px ${powerUp.color}55`,
                }}
                title={`${powerUp.name} (${powerUp.durationLeft}s) — ${powerUp.bonusText} | ${powerUp.malusText}`}
              >
                {/* Icona sostanza e timer */}
                <div className="status-pill-lead">
                  <span className="lead-icon">{powerUp.icon || '⚡'}</span>
                  <span className="lead-timer">{powerUp.durationLeft}s</span>
                </div>

                {/* Valori Bonus con icone verdi */}
                {powerUp.badges
                  ?.filter((b) => b.type === 'bonus')
                  .map((b, i) => (
                    <span
                      key={`b_${i}`}
                      className="status-pill-value val-bonus"
                      title={b.tooltip || b.label}
                    >
                      <span className="val-icon">{b.icon}</span>
                      <span className="val-label">{b.label}</span>
                    </span>
                  ))}

                {/* Valori Malus con icone rosse */}
                {powerUp.badges
                  ?.filter((b) => b.type === 'malus')
                  .map((b, i) => (
                    <span
                      key={`m_${i}`}
                      className="status-pill-value val-malus"
                      title={b.tooltip || b.label}
                    >
                      <span className="val-icon">{b.icon}</span>
                      <span className="val-label">{b.label}</span>
                    </span>
                  ))}

                {/* Sottile barra timer progressiva sul fondo della pillola */}
                <div
                  className="status-pill-progress"
                  style={{
                    width: `${Math.round(powerUp.durationPercent * 100)}%`,
                    backgroundColor: powerUp.color,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pop-up Notifica Momentanea Collezionabile Raccolto */}
      {data.lastCollected && (
        <div
          key={data.lastCollected.timestamp}
          className="hud-collected-toast"
          style={{
            borderColor: data.lastCollected.color,
            boxShadow: `0 0 16px ${data.lastCollected.color}55`,
          }}
        >
          <span className="toast-icon">{data.lastCollected.icon}</span>
          <div className="toast-body">
            <div className="toast-header-row">
              <span className="toast-name" style={{ color: data.lastCollected.color }}>
                {data.lastCollected.name}
              </span>
              {(data.lastCollected.bonusIcon || data.lastCollected.malusIcon) && (
                <span className="toast-badges">
                  {data.lastCollected.bonusIcon && (
                    <span className="toast-pill-bonus" title="Bonus">
                      🟢 {data.lastCollected.bonusIcon}
                    </span>
                  )}
                  {data.lastCollected.malusIcon && (
                    <span className="toast-pill-malus" title="Malus">
                      🔴 {data.lastCollected.malusIcon}
                    </span>
                  )}
                </span>
              )}
            </div>
            <span className="toast-desc">{data.lastCollected.description}</span>
          </div>
        </div>
      )}

      <div className="hud-right">
        <button className="btn-pause-round" onClick={onPause} title="Pausa">
          ⏸
        </button>

        {/* Hotbar delle Skill (Tasti 1 e 2 + SPAZIO) */}
        {data.skills && (
          <div className="hud-skills-bar">
            <div
              className={`skill-slot ${data.skills.shootReady ? 'is-ready' : 'is-cooldown'}`}
              title="[1] o Num1 / J: Sparo Pistola (colpisce nemici e blocchi ? a distanza)"
            >
              <div className="skill-badge-key">1</div>
              <div className="skill-icon">🔫</div>
              <div className="skill-name">PISTOLA</div>
              {!data.skills.shootReady && (
                <div
                  className="skill-cooldown-fill"
                  style={{ height: `${Math.round((data.skills.shootCooldownRatio ?? 0) * 100)}%` }}
                >
                  <span className="skill-cd-text">{(data.skills.shootTimeLeft ?? 0).toFixed(1)}s</span>
                </div>
              )}
            </div>

            <div
              className={`skill-slot ${data.skills.bombReady ? 'is-ready' : 'is-cooldown'}`}
              title="[2] o Num2 / K: Bomba Gianduiotto (esplosione parabolica dorata ad area)"
            >
              <div className="skill-badge-key">2</div>
              <div className="skill-icon">💣</div>
              <div className="skill-name">BOMBA 🍫</div>
              {!data.skills.bombReady && (
                <div
                  className="skill-cooldown-fill"
                  style={{ height: `${Math.round((data.skills.bombCooldownRatio ?? 0) * 100)}%` }}
                >
                  <span className="skill-cd-text">{(data.skills.bombTimeLeft ?? 0).toFixed(1)}s</span>
                </div>
              )}
            </div>

            {/* Super Abilità Eroe (Barra Spaziatrice) */}
            {data.skills.specialSkillName && (
              <div
                className={`skill-slot special-skill-slot ${data.skills.specialSkillReady ? 'is-ready' : 'is-cooldown'}`}
                title={`[SPAZIO]: ${data.skills.specialSkillName} (${data.skills.characterName})`}
              >
                <div className="skill-badge-key">SPAZIO</div>
                <div className="skill-icon">⭐</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' }}>
                  <div className="skill-name">{data.skills.specialSkillName}</div>
                  <div className="skill-hero-tag">{data.skills.characterName}</div>
                </div>
                {!data.skills.specialSkillReady && (
                  <div
                    className="skill-cooldown-fill special-cooldown-fill"
                    style={{ height: `${Math.round((data.skills.specialSkillCooldownRatio ?? 0) * 100)}%` }}
                  >
                    <span className="skill-cd-text">{(data.skills.specialSkillTimeLeft ?? 0).toFixed(1)}s</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
