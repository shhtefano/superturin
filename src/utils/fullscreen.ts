/**
 * Utility per la gestione dello Schermo Intero (Fullscreen API), Lock Orizzontale
 * e PWA (Progressive Web App) con fallback per iOS Safari e Android Chrome.
 */

let deferredInstallPrompt: any = null;

if (typeof window !== 'undefined') {
  // Cattura l'evento nativo di installazione per Android Chrome / Edge
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    window.dispatchEvent(new CustomEvent('superturin-pwa-can-install'));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    console.log('Super Turin installata con successo come PWA!');
  });
}

/** Rileva se l'utente è su un dispositivo iOS (iPhone/iPad/iPod) */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/** Rileva se l'app è già in esecuzione come PWA Standalone (a tutto schermo senza barra browser) */
export function isPWAStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (navigator as any).standalone === true
  );
}

/** Verifica se il prompt nativo di installazione è disponibile (Android/Desktop) */
export function canInstallPWA(): boolean {
  return !!deferredInstallPrompt;
}

/** Avvia il prompt nativo di installazione PWA */
export async function triggerPWAInstall(): Promise<boolean> {
  if (!deferredInstallPrompt) return false;
  try {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return outcome === 'accepted';
  } catch (err) {
    console.warn('Errore prompt installazione PWA:', err);
    return false;
  }
}

/** Apre la modale informativa su come installare l'app o andare a schermo intero */
export function openPWAInstallModal(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-pwa-install-modal'));
  }
}

/**
 * Gestione Schermo Intero:
 * - Se su iOS: Apre la guida visuale "Aggiungi a Home" perché Safari iOS blocca requestFullscreen() sui div
 * - Se su Android/Desktop: Invoca requestFullscreen() + orientation.lock('landscape')
 */
export function toggleFullscreen(): void {
  const doc = document as any;
  const elem = document.documentElement as any;

  // Su iPhone/iPad, Safari NON supporta l'HTML5 Fullscreen API su div o canvas.
  // L'unica vera soluzione senza barra del browser è installarla sulla schermata Home (PWA WebClip).
  if (isIOS() && !isPWAStandalone()) {
    openPWAInstallModal();
    return;
  }

  const isFullscreen = !!(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );

  if (!isFullscreen) {
    let requestPromise: Promise<void> | null = null;

    if (elem.requestFullscreen) {
      requestPromise = elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      requestPromise = elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      requestPromise = elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      requestPromise = elem.msRequestFullscreen();
    }

    if (requestPromise) {
      requestPromise.catch((err) => {
        console.warn('Fullscreen non consentito dal browser o policy:', err);
        // Se il browser rifiuta (es. HTTP o restrizioni), apri la guida PWA
        openPWAInstallModal();
      });
    }

    // Scrolla la pagina di 1px per nascondere la barra del browser su mobile Chrome/Safari
    window.scrollTo(0, 1);

    // Tenta di forzare l'orientamento orizzontale su schermi mobile
    if (screen.orientation && 'lock' in screen.orientation) {
      (screen.orientation as any).lock('landscape').catch(() => {});
    }
  } else {
    if (doc.exitFullscreen) {
      doc.exitFullscreen().catch(() => {});
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  }
}

export function isFullscreenActive(): boolean {
  const doc = document as any;
  return !!(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );
}
