import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CharacterId } from '../types/game';
import { LEVELS } from '../levels';
import { Sprites } from '../game/graphics/Sprites';

interface TorinoWorldMapProps {
  initialLevelId?: number;
  bestScores: Record<number, number>;
  unlockedLevels?: number;
  characterId?: CharacterId;
  onSelectLevel: (levelId: number) => void;
  onSwitchToGallery: () => void;
  onClose: () => void;
}

export interface MapNode {
  id: number;
  title: string;
  subtitle: string;
  landmark: string;
  tag: string;
  diff: string;
  nemici: string;
  x: number;
  y: number;
  neighbors: {
    up?: number;
    down?: number;
    left?: number;
    right?: number;
  };
}

// 6 Nodi geografici di Torino calibrati sulla mappa reale e risoluzione 1280x720
export const MAP_NODES: Record<number, MapNode> = {
  1: {
    id: 1,
    title: 'Centro di Torino',
    subtitle: 'Piazza Castello, Palazzo Madama & Tram GTT',
    landmark: 'Palazzo Madama',
    tag: '🏛️ CENTRO STORICO',
    diff: '⭐⭐',
    nemici: 'Piccioni, Torinesi con ombrello, Tram 7',
    x: 380,
    y: 280,
    neighbors: { right: 2, down: 3 },
  },
  2: {
    id: 2,
    title: 'La Mole Antonelliana',
    subtitle: 'Ascensore di Cristallo, Guglia & Cupola',
    landmark: 'Mole Antonelliana',
    tag: '🗼 MOLE ANTONELLIANA',
    diff: '⭐⭐⭐',
    nemici: 'Gabbiani ad alta quota, Vigili Urbani, Re Piccione (BOSS)',
    x: 670,
    y: 240,
    neighbors: { left: 1, right: 5, down: 4 },
  },
  3: {
    id: 3,
    title: 'Parco del Valentino',
    subtitle: 'Borgo Medievale, Fiume Po & Canottieri',
    landmark: 'Borgo Medievale',
    tag: '🌳 PARCO VALENTINO',
    diff: '⭐⭐⭐',
    nemici: 'Nutrie del Po, Scoiattoli balzanti & Barconi',
    x: 480,
    y: 500,
    neighbors: { up: 1, right: 4, left: 6, down: 6 },
  },
  4: {
    id: 4,
    title: 'Murazzi del Po di Notte',
    subtitle: 'Arcate in Pietra, Club Storici & Ponte Vittorio',
    landmark: 'Murazzi del Po',
    tag: '🌙 MURAZZI DI NOTTE',
    diff: '⭐⭐⭐⭐',
    nemici: 'Rider in monopattino, Nutrie giganti, Regina Nutria (BOSS)',
    x: 720,
    y: 400,
    neighbors: { up: 2, left: 3 },
  },
  5: {
    id: 5,
    title: 'Collina di Superga',
    subtitle: 'Basilica di Superga, Dentiera Sassi & Alpi',
    landmark: 'Basilica di Superga',
    tag: '🐗 COLLINA SUPERGA',
    diff: '⭐⭐⭐⭐⭐',
    nemici: 'Cinghiali feroci in carica, Dentiera a cremagliera',
    x: 1060,
    y: 190,
    neighbors: { left: 2 },
  },
  6: {
    id: 6,
    title: 'Lingotto & Pista 500',
    subtitle: 'Fabbrica Storica FIAT, Rampa Elicoidale & Bolla',
    landmark: 'Lingotto FIAT',
    tag: '🤖 LINGOTTO FIAT',
    diff: '⭐⭐⭐⭐⭐',
    nemici: 'Robot Saldatori Comau, Braccio Robotico Comau (BOSS)',
    x: 270,
    y: 600,
    neighbors: { right: 3, up: 3 },
  },
};

// Punti di passaggio (waypoint) tra i nodi per far camminare il personaggio lungo le strade
interface PathSegment {
  from: number;
  to: number;
  points: { x: number; y: number }[];
}

const MAP_PATHS: PathSegment[] = [
  // 1 <-> 2: Via Po (Piazza Castello <-> Mole Antonelliana)
  {
    from: 1,
    to: 2,
    points: [{ x: 380, y: 280 }, { x: 520, y: 260 }, { x: 670, y: 240 }],
  },
  // 1 <-> 3: Via Roma / Corso Vittorio (Centro <-> Parco Valentino)
  {
    from: 1,
    to: 3,
    points: [{ x: 380, y: 280 }, { x: 390, y: 400 }, { x: 480, y: 500 }],
  },
  // 2 <-> 4: Discesa verso il Fiume Po e Murazzi
  {
    from: 2,
    to: 4,
    points: [{ x: 670, y: 240 }, { x: 700, y: 310 }, { x: 720, y: 400 }],
  },
  // 2 <-> 5: Ponte Vittorio Emanuele I sul Po e salita alla Collina di Superga
  {
    from: 2,
    to: 5,
    points: [{ x: 670, y: 240 }, { x: 800, y: 220 }, { x: 930, y: 210 }, { x: 1060, y: 190 }],
  },
  // 3 <-> 4: Sentiero del Parco fluviale tra Valentino e Murazzi
  {
    from: 3,
    to: 4,
    points: [{ x: 480, y: 500 }, { x: 600, y: 460 }, { x: 720, y: 400 }],
  },
  // 3 <-> 6: Corso Massimo d'Azeglio verso il Lingotto
  {
    from: 3,
    to: 6,
    points: [{ x: 480, y: 500 }, { x: 370, y: 560 }, { x: 270, y: 600 }],
  },
];

// Helper per trovare i punti del percorso tra due nodi
function getPathPoints(fromId: number, toId: number): { x: number; y: number }[] | null {
  for (const seg of MAP_PATHS) {
    if (seg.from === fromId && seg.to === toId) {
      return [...seg.points];
    }
    if (seg.from === toId && seg.to === fromId) {
      return [...seg.points].reverse();
    }
  }
  return null;
}

// Breve effetto audio retrò per il passo del personaggio sulla mappa
function playMapHopSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch {
    // Ignora errori audio context non sbloccati
  }
}

export const TorinoWorldMap: React.FC<TorinoWorldMapProps> = ({
  initialLevelId = 1,
  bestScores,
  characterId = 'shhte',
  onSelectLevel,
  onSwitchToGallery,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stato navigazione
  const [currentNodeId, setCurrentNodeId] = useState<number>(initialLevelId);
  const [targetNodeId, setTargetNodeId] = useState<number | null>(null);

  // Stato animazione camminata
  const animRef = useRef<{
    isMoving: boolean;
    path: { x: number; y: number }[];
    pathIndex: number;
    subProgress: number; // 0..1 tra pathIndex e pathIndex + 1
    currentX: number;
    currentY: number;
    facingRight: boolean;
    hopOffset: number;
    tick: number;
  }>({
    isMoving: false,
    path: [],
    pathIndex: 0,
    subProgress: 0,
    currentX: MAP_NODES[initialLevelId]?.x ?? 380,
    currentY: MAP_NODES[initialLevelId]?.y ?? 280,
    facingRight: true,
    hopOffset: 0,
    tick: 0,
  });

  // Funzione per spostare l'eroe verso un nodo adiacente o tramite pathfinding
  const moveToNode = useCallback((nextId: number) => {
    if (animRef.current.isMoving) return;
    if (nextId === currentNodeId) return;

    // Controlla se c'è un sentiero diretto tra i due nodi
    const directPath = getPathPoints(currentNodeId, nextId);
    if (directPath) {
      animRef.current.isMoving = true;
      animRef.current.path = directPath;
      animRef.current.pathIndex = 0;
      animRef.current.subProgress = 0;
      animRef.current.facingRight = directPath[directPath.length - 1].x >= directPath[0].x;
      setTargetNodeId(nextId);
      playMapHopSound();
      return;
    }

    // Altrimenti cerca percorso via BFS per raggiungere qualsiasi nodo cliccato
    const queue: { node: number; path: number[] }[] = [{ node: currentNodeId, path: [currentNodeId] }];
    const visited = new Set<number>([currentNodeId]);
    let foundPath: number[] | null = null;

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;
      if (node === nextId) {
        foundPath = path;
        break;
      }
      const neighbors = Object.values(MAP_NODES[node]?.neighbors || {}).filter(Boolean) as number[];
      for (const n of neighbors) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push({ node: n, path: [...path, n] });
        }
      }
    }

    if (foundPath && foundPath.length >= 2) {
      // Costruisci i punti combinati dei segmenti
      const combinedPoints: { x: number; y: number }[] = [];
      for (let i = 0; i < foundPath.length - 1; i++) {
        const seg = getPathPoints(foundPath[i], foundPath[i + 1]);
        if (seg) {
          if (combinedPoints.length > 0) {
            combinedPoints.push(...seg.slice(1));
          } else {
            combinedPoints.push(...seg);
          }
        }
      }

      if (combinedPoints.length > 1) {
        animRef.current.isMoving = true;
        animRef.current.path = combinedPoints;
        animRef.current.pathIndex = 0;
        animRef.current.subProgress = 0;
        animRef.current.facingRight = combinedPoints[combinedPoints.length - 1].x >= combinedPoints[0].x;
        setTargetNodeId(nextId);
        playMapHopSound();
      }
    }
  }, [currentNodeId]);

  // Gestione tastiera direzionale (Frecce / WASD / Numeri 1-6 / Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avvio rapido con tasti 1-6
      if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6'].includes(e.code)) {
        e.preventDefault();
        const id = parseInt(e.code.replace('Digit', '').replace('Numpad', ''), 10);
        if (MAP_NODES[id]) {
          if (id === currentNodeId) {
            onSelectLevel(id);
          } else {
            moveToNode(id);
          }
        }
        return;
      }

      const current = MAP_NODES[currentNodeId];
      if (!current) return;

      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        if (current.neighbors.right) moveToNode(current.neighbors.right);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        if (current.neighbors.left) moveToNode(current.neighbors.left);
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (current.neighbors.up) moveToNode(current.neighbors.up);
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        if (current.neighbors.down) moveToNode(current.neighbors.down);
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onSelectLevel(currentNodeId);
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentNodeId, moveToNode, onSelectLevel, onClose]);

  // Gestione click/tap sul Canvas per muoversi verso il nodo cliccato
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 720 / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Trova se è stato cliccato un nodo entro 55px di raggio
    for (const node of Object.values(MAP_NODES)) {
      const dist = Math.hypot(clickX - node.x, clickY - node.y);
      if (dist <= 55) {
        if (node.id === currentNodeId && !animRef.current.isMoving) {
          // Secondo tap sullo stesso nodo: avvia subito il livello!
          onSelectLevel(node.id);
        } else {
          moveToNode(node.id);
        }
        return;
      }
    }
  };

  // LOOP DI RENDERING DELLA MAPPA DI TORINO (Super Mario World style)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const anim = animRef.current;
      anim.tick++;

      // 1. Aggiornamento posizione eroe lungo il sentiero se in movimento
      if (anim.isMoving && anim.path.length > 1) {
        const speed = 0.055; // Velocità di camminata
        anim.subProgress += speed;

        if (anim.subProgress >= 1) {
          anim.subProgress = 0;
          anim.pathIndex++;

          if (anim.pathIndex >= anim.path.length - 1) {
            // Arrivo al nodo di destinazione
            anim.isMoving = false;
            const finalPoint = anim.path[anim.path.length - 1];
            anim.currentX = finalPoint.x;
            anim.currentY = finalPoint.y;
            anim.hopOffset = 0;
            if (targetNodeId) {
              setCurrentNodeId(targetNodeId);
              setTargetNodeId(null);
            }
          } else {
            playMapHopSound();
          }
        }

        if (anim.isMoving) {
          const p1 = anim.path[anim.pathIndex];
          const p2 = anim.path[anim.pathIndex + 1];
          if (p1 && p2) {
            anim.currentX = p1.x + (p2.x - p1.x) * anim.subProgress;
            anim.currentY = p1.y + (p2.y - p1.y) * anim.subProgress;
            // Salto rimbalzante ad arco (hop) in stile Super Mario World
            anim.hopOffset = -Math.sin(anim.subProgress * Math.PI) * 14;
            anim.facingRight = p2.x >= p1.x;
          }
        }
      } else {
        // Respiro morbido idle sul nodo
        anim.hopOffset = Math.sin(anim.tick * 0.08) * 2;
      }

      // -------------------------------------------------------------
      // 2. RENDERING GRAFICO MAPPA DI TORINO STILE SUPER MARIO WORLD
      // -------------------------------------------------------------
      ctx.clearRect(0, 0, 1280, 720);

      // A. Prato torinese di base verde brillante con griglia collinare
      const grassGrad = ctx.createLinearGradient(0, 0, 1280, 720);
      grassGrad.addColorStop(0, '#84cc16');
      grassGrad.addColorStop(0.4, '#65a30d');
      grassGrad.addColorStop(1, '#4d7c0f');
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, 0, 1280, 720);

      // Micro-texture a scacchi / zolle d'erba Mario World
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      for (let gx = 0; gx < 1280; gx += 40) {
        for (let gy = 0; gy < 720; gy += 40) {
          if ((gx / 40 + gy / 40) % 2 === 0) {
            ctx.fillRect(gx, gy, 40, 40);
          }
        }
      }

      // B. Catena Alpina e Vette Innevate all'orizzonte nord (sullo sfondo in alto)
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.moveTo(0, 70);
      ctx.lineTo(120, 20);
      ctx.lineTo(260, 65);
      ctx.lineTo(390, 15);
      ctx.lineTo(540, 70);
      ctx.lineTo(680, 25);
      ctx.lineTo(840, 65);
      ctx.lineTo(980, 20);
      ctx.lineTo(1120, 70);
      ctx.lineTo(1280, 30);
      ctx.lineTo(1280, 90);
      ctx.lineTo(0, 90);
      ctx.closePath();
      ctx.fill();

      // Cime innevate bianche
      ctx.fillStyle = '#f8fafc';
      const peaks = [120, 390, 680, 980, 1280];
      peaks.forEach((px) => {
        ctx.beginPath();
        ctx.moveTo(px - 28, 42);
        ctx.lineTo(px, px === 390 ? 15 : 20);
        ctx.lineTo(px + 28, 42);
        ctx.closePath();
        ctx.fill();
      });

      // C. Collina Torinese a est (zona Superga e Monte dei Cappuccini a destra)
      ctx.fillStyle = '#3f6212';
      ctx.beginPath();
      ctx.moveTo(860, 720);
      ctx.quadraticCurveTo(920, 340, 1020, 170);
      ctx.quadraticCurveTo(1160, 90, 1280, 100);
      ctx.lineTo(1280, 720);
      ctx.closePath();
      ctx.fill();

      // Terrazzamento collinare superiore più chiaro
      ctx.fillStyle = '#4d7c0f';
      ctx.beginPath();
      ctx.moveTo(980, 270);
      ctx.quadraticCurveTo(1060, 130, 1280, 130);
      ctx.lineTo(1280, 350);
      ctx.quadraticCurveTo(1090, 320, 980, 270);
      ctx.closePath();
      ctx.fill();

      // D. FIUME PO: Nastro azzurro sinuoso con onde animate
      ctx.save();
      ctx.lineWidth = 54;
      ctx.strokeStyle = '#0284c7';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(590, 740);
      ctx.bezierCurveTo(620, 560, 680, 440, 740, 360);
      ctx.bezierCurveTo(790, 290, 850, 240, 940, 180);
      ctx.bezierCurveTo(1010, 140, 1100, 90, 1200, 0);
      ctx.stroke();

      // Riflesso interno chiaro del Po
      ctx.lineWidth = 38;
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // Onde animate nel fiume
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#e0f2fe';
      const waveWave = (anim.tick * 0.04) % 1;
      for (let i = 0; i < 7; i++) {
        const t = (i / 7 + waveWave) % 1;
        // Calcolo punto approssimato lungo il fiume Po
        const wx = 590 + t * 580;
        const wy = 720 - t * 700;
        ctx.beginPath();
        ctx.arc(wx, wy, 8, 0, Math.PI);
        ctx.stroke();
      }
      ctx.restore();

      // Ponti storici in pietra sopra il Po
      // 1. Ponte Vittorio Emanuele I (Murazzi / Piazza Vittorio)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(735, 335, 48, 14);
      ctx.fillStyle = '#475569';
      ctx.fillRect(735, 333, 48, 3);
      ctx.fillRect(735, 347, 48, 3);

      // 2. Ponte Umberto I (Parco del Valentino)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(630, 485, 46, 14);
      ctx.fillStyle = '#475569';
      ctx.fillRect(630, 483, 46, 3);
      ctx.fillRect(630, 497, 46, 3);

      // E. Disegno dei Sentieri Lastricati (Dotted Paths in stile Mario World)
      ctx.save();
      for (const seg of MAP_PATHS) {
        // Linea sentiero interna dorata / sabbia
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 8;
        ctx.setLineDash([8, 10]);
        ctx.beginPath();
        for (let i = 0; i < seg.points.length; i++) {
          const pt = seg.points[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Bordo scuro dei ciottoli
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      // F. MONUMENTI MINIATURA DISEGNATI SULLA MAPPA (Ispirati alla Foto di Torino)
      // 1. Palazzo Madama e Piazza Castello (Nodo 1)
      ctx.save();
      const pmX = 380;
      const pmY = 210;
      // Facciata juvarriana Palazzo Madama
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(pmX - 44, pmY - 18, 88, 32);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(pmX - 46, pmY - 22, 92, 5);
      // Colonne e finestroni classici
      ctx.fillStyle = '#1e293b';
      for (let cx = pmX - 36; cx <= pmX + 36; cx += 14) {
        ctx.fillRect(cx, pmY - 12, 6, 18);
      }
      // Statua equestre Caval 'd Brôns
      ctx.fillStyle = '#78350f';
      ctx.fillRect(pmX + 36, pmY + 22, 12, 10);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(pmX + 38, pmY + 16, 8, 8);
      ctx.restore();

      // 2. La Mole Antonelliana (Nodo 2)
      ctx.save();
      const moleX = 670;
      const moleY = 160;
      // Basamento e colonnato classico
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(moleX - 22, moleY + 10, 44, 30);
      ctx.fillStyle = '#f8fafc';
      for (let mx = moleX - 18; mx <= moleX + 18; mx += 8) {
        ctx.fillRect(mx, moleY + 14, 4, 22);
      }
      // Cupola a pagoda sabauda quadrata
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.moveTo(moleX - 22, moleY + 10);
      ctx.quadraticCurveTo(moleX - 10, moleY - 30, moleX - 6, moleY - 45);
      ctx.lineTo(moleX + 6, moleY - 45);
      ctx.quadraticCurveTo(moleX + 10, moleY - 30, moleX + 22, moleY + 10);
      ctx.closePath();
      ctx.fill();
      // Tempietto superiore e Guglia acuminata con stella
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(moleX - 6, moleY - 55, 12, 10);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(moleX - 2, moleY - 95, 4, 40);
      // Stella dorata in cima che brilla
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(moleX, moleY - 98, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Parco del Valentino e Borgo Medievale (Nodo 3)
      ctx.save();
      const valX = 480;
      const valY = 440;
      // Alberi del parco
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(valX - 35, valY + 15, 14, 0, Math.PI * 2);
      ctx.arc(valX + 35, valY + 15, 12, 0, Math.PI * 2);
      ctx.fill();
      // Rocca medievale con merli e torrette
      ctx.fillStyle = '#78350f';
      ctx.fillRect(valX - 22, valY, 44, 26);
      // Torrette laterali con tetto a cono rosso
      ctx.fillRect(valX - 26, valY - 10, 10, 36);
      ctx.fillRect(valX + 16, valY - 10, 10, 36);
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(valX - 30, valY - 10);
      ctx.lineTo(valX - 21, valY - 24);
      ctx.lineTo(valX - 12, valY - 10);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(valX + 12, valY - 10);
      ctx.lineTo(valX + 21, valY - 24);
      ctx.lineTo(valX + 30, valY - 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 4. Murazzi del Po con Arcate in Pietra (Nodo 4)
      ctx.save();
      const murX = 720;
      const murY = 370;
      ctx.fillStyle = '#334155';
      ctx.fillRect(murX - 26, murY - 8, 52, 16);
      // Arcate con luci al neon calde
      for (let ax = murX - 18; ax <= murX + 18; ax += 14) {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(ax, murY + 4, 5, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(ax - 2, murY, 4, 3);
      }
      ctx.restore();

      // 5. Basilica di Superga e Dentiera sulla Collina (Nodo 5)
      ctx.save();
      const supX = 1060;
      const supY = 120;
      // Basilica Juvarriana con pronao classico e cupola
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(supX - 26, supY, 52, 28);
      // Colonne pronao
      ctx.fillStyle = '#ea580c';
      for (let bx = supX - 18; bx <= supX + 18; bx += 9) {
        ctx.fillRect(bx, supY + 4, 3, 20);
      }
      // Cupola maestosa
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(supX, supY - 2, 16, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#ffedd5';
      ctx.fillRect(supX - 3, supY - 24, 6, 8);
      // Campanili gemelli
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(supX - 30, supY - 14, 8, 38);
      ctx.fillRect(supX + 22, supY - 14, 8, 38);
      // Vagoncino rosso della Dentiera di Sassi in salita
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(supX - 48, supY + 36, 16, 8);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(supX - 48, supY + 34, 16, 3);
      ctx.restore();

      // 6. Lingotto Fiat con Pista 500 sul tetto e Bolla (Nodo 6)
      ctx.save();
      const lingX = 270;
      const lingY = 540;
      // Fabbrica storica in mattoni rossi
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(lingX - 40, lingY - 12, 80, 24);
      // Griglia finestre industriali continue
      ctx.fillStyle = '#93c5fd';
      for (let lx = lingX - 34; lx <= lingX + 34; lx += 10) {
        ctx.fillRect(lx, lingY - 8, 6, 8);
        ctx.fillRect(lx, lingY + 2, 6, 7);
      }
      // Pista 500 sul tetto con curve paraboliche
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(lingX, lingY - 16, 36, 8, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Bolla di Renzo Piano (eliporto in cristallo azzurro)
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(lingX + 18, lingY - 26, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Dettagli ambientali carini (fontanelle Tôret torinesi sparse)
      const toretsx = [310, 540, 870, 420];
      const toretsy = [340, 310, 480, 620];
      ctx.fillStyle = '#1b4332';
      for (let i = 0; i < toretsx.length; i++) {
        ctx.fillRect(toretsx[i], toretsy[i], 5, 9);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(toretsx[i] - 1, toretsy[i] + 2, 2, 2);
        ctx.fillStyle = '#1b4332';
      }

      // G. RENDERING DEI NODI DI LIVELLO (Super Mario World Stage Pads)
      for (const node of Object.values(MAP_NODES)) {
        const isCurrent = node.id === currentNodeId;
        const isTarget = node.id === targetNodeId;
        const score = bestScores[node.id] || 0;

        ctx.save();
        ctx.translate(node.x, node.y);

        // 1. Cerchio pulsante dorato per il livello attualmente selezionato
        if (isCurrent || isTarget) {
          const haloSize = 26 + Math.sin(anim.tick * 0.1) * 4;
          const haloAlpha = 0.45 + Math.sin(anim.tick * 0.1) * 0.25;
          ctx.strokeStyle = `rgba(255, 183, 3, ${haloAlpha})`;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(0, 0, haloSize, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 2. Pad del livello in pietra / Mario World Button
        ctx.fillStyle = isCurrent ? '#ffb703' : '#334155';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isCurrent ? '#fff' : '#cbd5e1';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 3. Numero del Livello
        ctx.fillStyle = isCurrent ? '#0f172a' : '#f8fafc';
        ctx.font = 'bold 15px "Outfit", "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(node.id), 0, 1);

        // 4. Stella record se già completato con punteggio
        if (score > 0) {
          ctx.font = '10px monospace';
          ctx.fillText('⭐', 14, -14);
        }

        // 5. Etichetta del monumento fluttuante sotto al nodo
        ctx.font = 'bold 11px "Outfit", system-ui, sans-serif';
        ctx.fillStyle = isCurrent ? '#fde047' : '#f8fafc';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 4;
        ctx.fillText(node.landmark, 0, 32);
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      // H. RENDERING DEL PERSONAGGIO GIOCABILE SULLA MAPPA (Sprite Animato)
      ctx.save();
      const heroX = anim.currentX;
      const heroY = anim.currentY + anim.hopOffset;

      // Ombra sotto i piedi dell'eroe
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(heroX, anim.currentY + 12, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Disegna il personaggio con le sue caratteristiche e sprite fedele
      Sprites.drawPlayerCombined(
        ctx,
        heroX - 16,
        heroY - 42,
        32,
        48,
        anim.facingRight,
        !anim.isMoving,
        anim.isMoving ? 80 : 0,
        anim.isMoving ? -20 : 0,
        0,
        new Map(),
        false,
        characterId
      );

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [currentNodeId, targetNodeId, bestScores, characterId]);

  const currentNode = MAP_NODES[currentNodeId] || MAP_NODES[1];
  const currentBestScore = bestScores[currentNode.id] || 0;

  return (
    <div className="worldmap-backdrop">
      <div className="worldmap-wrapper">
        {/* Canvas Mappa Interattiva 16:9 */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="worldmap-canvas"
          onClick={handleCanvasClick}
          title="Clicca su un monumento o usa le frecce per muoverti"
        />

        {/* Barra Superiore Mappa */}
        <div className="worldmap-top-bar">
          <div className="worldmap-title-badge">
            <span className="worldmap-mario-coin">⭐</span>
            <div className="worldmap-title-text">
              <span>MAPPA DI TORINO</span>
              <span className="worldmap-sub-text">SUPER MARIO WORLD EDITION</span>
            </div>
          </div>

          <div className="worldmap-top-actions">
            <button
              className="btn-map-switch"
              onClick={onSwitchToGallery}
              title="Passa alla vista a quadri / griglia classica"
            >
              🖼️ QUADRI
            </button>
            <button
              className="btn-map-close"
              onClick={onClose}
              title="Torna al menu principale (ESC)"
            >
              ◀ MENU
            </button>
          </div>
        </div>

        {/* Guida Rapida Comandi Tastiera */}
        <div className="worldmap-hints-bar">
          Frecce <kbd>◀</kbd><kbd>▲</kbd><kbd>▶</kbd><kbd>▼</kbd> o <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> per muoverti | <kbd>1</kbd>-<kbd>6</kbd> rapido | <kbd>INVIO</kbd> per giocare
        </div>

        {/* Scheda Fluttuante del Livello Selezionato */}
        <div className="worldmap-level-card">
          <div className="map-card-left">
            <div className="map-card-badge">{currentNode.id}</div>
            <div className="map-card-info">
              <div className="map-card-title">{currentNode.title}</div>
              <div className="map-card-sub">{currentNode.subtitle}</div>
              <div className="map-card-meta">
                <span className="map-card-diff">Difficoltà: {currentNode.diff}</span>
                <span className="map-card-score">
                  {currentBestScore > 0 ? `Record: ⭐ ${currentBestScore}` : 'Nessun record'}
                </span>
              </div>
            </div>
          </div>

          <button
            className="map-card-play-btn"
            onClick={() => onSelectLevel(currentNode.id)}
            title={`Avvia ${currentNode.title} (INVIO / SPAZIO)`}
          >
            GIOCA ORA ▶
          </button>
        </div>

        {/* Mini D-Pad Touch di supporto per chi preferisce i tasti a schermo */}
        <div className="worldmap-touch-controls">
          <div className="map-touch-dpad">
            {currentNode.neighbors.up && (
              <button
                className="btn-map-dir dir-up"
                onClick={() => moveToNode(currentNode.neighbors.up!)}
                title="Spostati in alto"
              >
                ▲
              </button>
            )}
            {currentNode.neighbors.left && (
              <button
                className="btn-map-dir dir-left"
                onClick={() => moveToNode(currentNode.neighbors.left!)}
                title="Spostati a sinistra"
              >
                ◀
              </button>
            )}
            {currentNode.neighbors.right && (
              <button
                className="btn-map-dir dir-right"
                onClick={() => moveToNode(currentNode.neighbors.right!)}
                title="Spostati a destra"
              >
                ▶
              </button>
            )}
            {currentNode.neighbors.down && (
              <button
                className="btn-map-dir dir-down"
                onClick={() => moveToNode(currentNode.neighbors.down!)}
                title="Spostati in basso"
              >
                ▼
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
