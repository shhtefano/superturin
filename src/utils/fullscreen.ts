/**
 * Utility per la gestione dello Schermo Intero (Fullscreen API) e Lock Orizzontale
 * con fallback per browser mobile (Chrome, Safari, Firefox, Edge, webkit, ms).
 */

export function toggleFullscreen(): void {
  const doc = document as any;
  const elem = document.documentElement as any;

  const isFullscreen = !!(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );

  if (!isFullscreen) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }

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
