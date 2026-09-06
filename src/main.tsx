import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registra Service Worker per PWA e Gioco Offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('SuperTurin PWA Service Worker registrato con successo:', reg.scope);
      })
      .catch((err) => {
        console.warn('SuperTurin Service Worker non registrato:', err);
      });
  });
}

