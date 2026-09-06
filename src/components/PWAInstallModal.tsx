import React, { useState, useEffect } from 'react';
import {
  isIOS,
  isPWAStandalone,
  canInstallPWA,
  triggerPWAInstall,
} from '../utils/fullscreen';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const [installAvailable, setInstallAvailable] = useState<boolean>(canInstallPWA());
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);

  const iosDevice = isIOS();
  const standalone = isPWAStandalone();

  useEffect(() => {
    const handleCanInstall = () => {
      setInstallAvailable(true);
    };

    window.addEventListener('superturin-pwa-can-install', handleCanInstall);
    return () => window.removeEventListener('superturin-pwa-can-install', handleCanInstall);
  }, []);

  const handleInstallClick = async () => {
    setIsInstalling(true);
    const accepted = await triggerPWAInstall();
    setIsInstalling(false);
    if (accepted) {
      setInstalledSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" style={{ zIndex: 99999 }}>
      <div
        className="modal-card pwa-install-card"
        style={{
          maxWidth: '560px',
          width: '92%',
          background: 'linear-gradient(145deg, rgba(13, 23, 42, 0.98), rgba(7, 15, 30, 0.98))',
          border: '2px solid var(--color-oro-reale)',
          boxShadow: '0 0 35px rgba(255, 183, 3, 0.3)',
          padding: '24px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
          📱
        </div>

        <h2
          className="modal-title"
          style={{
            fontSize: '1.05rem',
            color: 'var(--color-oro-reale)',
            marginBottom: '6px',
          }}
        >
          {standalone ? 'APP A TUTTO SCHERMO ATTIVA' : 'COME GIOCARE A SCHERMO INTERO'}
        </h2>

        <p
          style={{
            fontSize: '0.8rem',
            color: '#cbd5e1',
            lineHeight: 1.4,
            marginBottom: '18px',
          }}
        >
          {standalone
            ? 'Stai già giocando alla versione PWA Standalone di Super Turin: schermo intero nativo garantito!'
            : 'I browser mobile nascondono o bloccano il tasto a tutto schermo dentro le normali schede. Rendere il gioco una Progressive Web App (PWA) rimuove completamente le barre del browser!'}
        </p>

        {/* GUIDA SPECIFICA PER IPHONE / IPAD (IOS SAFARI) */}
        {iosDevice && !standalone && (
          <div
            style={{
              background: 'rgba(30, 58, 138, 0.25)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '18px',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.72rem',
                color: '#38bdf8',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🍏 GUIDA PER IPHONE (SAFARI):
            </div>
            <ol
              style={{
                fontSize: '0.76rem',
                color: '#f8fafc',
                lineHeight: 1.6,
                paddingLeft: '20px',
                margin: 0,
              }}
            >
              <li>
                Tocca l'icona <strong>Condividi</strong>{' '}
                <span style={{ fontSize: '1rem', color: '#38bdf8' }}>⎋</span> (il quadrato con la freccia in alto) nella barra di Safari.
              </li>
              <li>
                Scorri le opzioni verso il basso e tocca <strong>"Aggiungi alla schermata Home"</strong>{' '}
                <span style={{ fontSize: '0.9rem', color: '#facc15' }}>➕</span>.
              </li>
              <li>
                Apri l'icona <strong>SuperTurin</strong> dalla schermata Home: il gioco si aprirà a <strong>vero schermo intero</strong>, senza la barra dell'URL né i pulsanti del browser!
              </li>
            </ol>
          </div>
        )}

        {/* GUIDA / PULSANTE PER ANDROID CHROME & DESKTOP */}
        {!iosDevice && !standalone && (
          <div
            style={{
              background: 'rgba(22, 101, 52, 0.25)',
              border: '1px solid rgba(74, 222, 128, 0.35)',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '18px',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.72rem',
                color: '#4ade80',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🤖 GUIDA ANDROID CHROME:
            </div>

            {installAvailable ? (
              <div>
                <p style={{ fontSize: '0.76rem', color: '#e2e8f0', marginBottom: '12px', lineHeight: 1.4 }}>
                  Clicca il pulsante qui sotto per installare <strong>Super Turin</strong> sul tuo dispositivo. Verrà creata un'icona che apre il gioco a tutto schermo orizzontale istantaneamente!
                </p>
                <button
                  type="button"
                  className="btn-arcade btn-arcade-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.75rem' }}
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                >
                  {isInstalling ? 'INSTALLAZIONE IN CORSO...' : '📲 INSTALLA ORA (SCHERMO INTERO)'}
                </button>
              </div>
            ) : (
              <p style={{ fontSize: '0.76rem', color: '#e2e8f0', lineHeight: 1.5, margin: 0 }}>
                Tocca i tre puntini <strong style={{ color: '#facc15' }}>⋮</strong> in alto a destra su Chrome e seleziona <strong>"Installa app"</strong> o <strong>"Aggiungi a schermata Home"</strong>. L'app si aprirà senza barra degli indirizzi!
              </p>
            )}

            {installedSuccess && (
              <div style={{ color: '#4ade80', fontSize: '0.76rem', marginTop: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                ✅ App installata con successo! Cercala nella Home.
              </div>
            )}
          </div>
        )}

        {/* TASTO CHIUDI */}
        <button
          type="button"
          className="btn-arcade btn-arcade-secondary"
          style={{ width: '100%', fontSize: '0.72rem', padding: '10px 16px' }}
          onClick={onClose}
        >
          HO CAPITO, TORNA AL GIOCO ✖
        </button>
      </div>
    </div>
  );
};
