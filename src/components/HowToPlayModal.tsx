import React, { useEffect } from 'react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Enter', 'Space', 'Escape', 'KeyW', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '620px' }}>
        <h2 className="modal-title">COME GIOCARE</h2>
        <p className="modal-subtitle">Controlli e Meccaniche Sabaude</p>

        <div className="controls-grid">
          <div><span className="key-badge">A</span> / <span className="key-badge">◀</span></div>
          <div>Muoviti a Sinistra</div>

          <div><span className="key-badge">D</span> / <span className="key-badge">▶</span></div>
          <div>Muoviti a Destra</div>

          <div><span className="key-badge">W</span> / <span className="key-badge">▲</span></div>
          <div>Salto Arcade (tieni premuto per saltare più in alto!)</div>

          <div><span className="key-badge">SPAZIO</span> / <span className="key-badge">⭐ JOYPAD</span></div>
          <div><strong>⭐ Super-Abilità Eroe:</strong> Abilità speciale unica con cooldown (Shhte, Ugo, Jari, Jonson, Krebs, Devis, Willy)</div>

          <div><span className="key-badge">SHIFT</span></div>
          <div>Corsa veloce con scatto</div>

          <div><span className="key-badge">1</span> / <span className="key-badge">Num1</span> / <span className="key-badge">J</span></div>
          <div><strong>💨 Scivolata:</strong> Scatto radente, passa nei cunicoli bassi e stende i nemici</div>

          <div><span className="key-badge">2</span> / <span className="key-badge">Num2</span> / <span className="key-badge">K</span></div>
          <div><strong>🔫 Pistola Sabauda:</strong> Spara proiettili a nemici e blocchi ? distanti</div>

          <div><span className="key-badge">3</span> / <span className="key-badge">Num3</span> / <span className="key-badge">L</span></div>
          <div><strong>💣 Bomba Gianduiotto:</strong> Lancio a parabola ed esplosione ad area dorata</div>
        </div>

        <div className="lore-box" style={{ marginBottom: '20px', maxHeight: '220px', overflowY: 'auto' }}>
          <strong>Collezionabili (Durata 12s - Bonus & Malus):</strong><br />
          • <strong>🍫 Gianduiotto:</strong> Punteggio base classico (+100).<br />
          • <strong>⚡ Cocaina:</strong> Super Velocità (+70%) & Salto Stellare | <em>Malus:</em> Cuore fragile (danni doppi) e tremolio.<br />
          • <strong>🌿 Marijuana:</strong> +1 Cuore & Invulnerabilità totale ai nemici | <em>Malus:</em> Movimenti e riflessi lenti (-35%).<br />
          • <strong>💊 MDMA:</strong> Punti raddoppiati (x2) & Magnete Gianduiotti | <em>Malus:</em> Scivoli sul ghiaccio.<br />
          • <strong>🌀 LSD:</strong> Sblocca il DOPPIO SALTO a mezz'aria | <em>Malus:</em> Distorsione psichedelica.<br />
          • <strong>🍄 Funghetti:</strong> Diventi GIGANTE e schiacci i nemici frontalmente | <em>Malus:</em> Corpo enorme e caduta pesante.<br />
          • <strong>❓ Blocchi Sorpresa:</strong> Colpiscili da sotto con la testa per estrarre le sostanze!<br />
          • <strong>💥 COMBINAZIONI MULTIPLE & SINERGIE:</strong> Puoi accumulare più sostanze insieme! Effetti cumulativi e sblocco di sinergie leggendarie come <em>⚡🌿 Speedball Sabaudo</em>, <em>✨🌀 Candyflip Cosmico</em>, <em>🍄🌀 Colosso Psichedelico</em> e <em>🔥👑 Polydoping dei Murazzi (x3 Punti!)</em>.
        </div>

        <button className="btn-arcade btn-arcade-primary is-selected" onClick={onClose}>
          ▶ HO CAPITO, ANDIAMO! (INVIO / ESC)
        </button>

        <div className="menu-nav-hint">
          ⌨️ Premi <kbd>INVIO</kbd>, <kbd>SPAZIO</kbd> o <kbd>ESC</kbd> per chiudere
        </div>
      </div>
    </div>
  );
};
