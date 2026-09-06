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
    nemici: 'Gabbiani ad alta quota, Vigili Urbani, Concettina A Pilusa (BOSS)',
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
    nemici: 'Rider in monopattino, Nutrie giganti, PinoFicaFica (BOSS)',
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
    nemici: 'Robot Saldatori Comau, Pietro Nutella (BOSS)',
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

      // ============================================================
      // MAPPA TOPOGRAFICA REALISTICA DI TORINO — Vista dall'alto
      // Stile: Nintendo city map / carta geografica stilizzata
      // ============================================================

      // A. SFONDO BASE: Tessuto urbano — colore crema/sabbia carta geografica
      const cityBg = ctx.createLinearGradient(0, 0, 1280, 720);
      cityBg.addColorStop(0, '#f5f0e8');
      cityBg.addColorStop(0.5, '#ede8dc');
      cityBg.addColorStop(1, '#e8e0d0');
      ctx.fillStyle = cityBg;
      ctx.fillRect(0, 0, 1280, 720);

      // B. COLLINA TORINESE — a est, verde scuro (Superga, Monte dei Cappuccini)
      const hillGrad = ctx.createLinearGradient(800, 0, 1280, 720);
      hillGrad.addColorStop(0, '#7fb069');
      hillGrad.addColorStop(0.4, '#5a8a45');
      hillGrad.addColorStop(1, '#3d6b2e');
      ctx.fillStyle = hillGrad;
      ctx.beginPath();
      ctx.moveTo(820, 0);
      ctx.bezierCurveTo(870, 80, 900, 200, 860, 380);
      ctx.bezierCurveTo(840, 480, 870, 600, 900, 720);
      ctx.lineTo(1280, 720);
      ctx.lineTo(1280, 0);
      ctx.closePath();
      ctx.fill();

      // Texture collinare: curve di livello leggerissime
      ctx.save();
      ctx.strokeStyle = 'rgba(60,100,40,0.18)';
      ctx.lineWidth = 1.5;
      [[850,50,1200,50],[840,120,1250,140],[835,200,1260,230],
       [840,310,1250,330],[850,420,1240,440],[860,530,1230,555],[870,640,1220,660]].forEach(([x1,y1,x2,y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1+80, y1-10, x2-80, y2+10, x2, y2);
        ctx.stroke();
      });
      ctx.restore();

      // C. PARCO DEL VALENTINO — verde chiaro lungo il Po (sinistra del fiume)
      const parkGrad = ctx.createLinearGradient(420, 380, 640, 620);
      parkGrad.addColorStop(0, '#86c968');
      parkGrad.addColorStop(1, '#5da84a');
      ctx.fillStyle = parkGrad;
      ctx.beginPath();
      ctx.moveTo(430, 380);
      ctx.bezierCurveTo(460, 360, 560, 370, 610, 410);
      ctx.bezierCurveTo(640, 440, 650, 490, 630, 530);
      ctx.bezierCurveTo(610, 570, 560, 600, 500, 610);
      ctx.bezierCurveTo(450, 620, 400, 590, 400, 540);
      ctx.bezierCurveTo(390, 490, 410, 420, 430, 380);
      ctx.closePath();
      ctx.fill();
      // Texture punteggiata alberi nel parco
      ctx.save();
      ctx.fillStyle = 'rgba(50, 120, 30, 0.28)';
      const treePos = [[445,420],[475,450],[510,430],[490,480],[540,460],[510,510],[465,500],[555,500],[480,540],[530,540]];
      treePos.forEach(([tx, ty]) => {
        ctx.beginPath();
        ctx.arc(tx, ty, 10, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // D. FIUME PO — azzurro realistico, scorre N→S poi curva verso NE sulla collina
      // Sponda ovest (sinistra)
      ctx.save();
      ctx.fillStyle = '#5bb8e8';
      ctx.beginPath();
      // Sponda ovest
      ctx.moveTo(570, 760);
      ctx.bezierCurveTo(600, 580, 650, 450, 695, 360);
      ctx.bezierCurveTo(730, 290, 785, 235, 840, 185);
      ctx.bezierCurveTo(890, 145, 960, 105, 1050, 55);
      ctx.lineTo(1090, 0);
      // Sponda est (riva collina)
      ctx.lineTo(1130, 0);
      ctx.bezierCurveTo(1000, 90, 940, 130, 895, 165);
      ctx.bezierCurveTo(840, 210, 790, 265, 755, 330);
      ctx.bezierCurveTo(720, 400, 680, 510, 655, 660);
      ctx.lineTo(640, 760);
      ctx.closePath();
      ctx.fill();
      // Riflesso acqua (riga chiara animata)
      ctx.strokeStyle = 'rgba(180,230,255,0.6)';
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 18]);
      ctx.lineDashOffset = -(anim.tick * 1.2) % 30;
      ctx.beginPath();
      ctx.moveTo(610, 680);
      ctx.bezierCurveTo(640, 520, 690, 400, 730, 320);
      ctx.bezierCurveTo(770, 250, 820, 200, 870, 170);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
      ctx.restore();

      // Rive del Po — bordo sottile più scuro
      ctx.save();
      ctx.strokeStyle = '#2a8fc0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(570, 760);
      ctx.bezierCurveTo(600, 580, 650, 450, 695, 360);
      ctx.bezierCurveTo(730, 290, 785, 235, 840, 185);
      ctx.bezierCurveTo(890, 145, 960, 105, 1050, 55);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(640, 760);
      ctx.bezierCurveTo(655, 660, 680, 510, 720, 400);
      ctx.bezierCurveTo(755, 310, 808, 248, 870, 200);
      ctx.bezierCurveTo(920, 160, 990, 120, 1080, 70);
      ctx.stroke();
      ctx.restore();

      // E. RETICOLO STRADALE DI TORINO — il famoso impianto a scacchiera romano/sabaudo
      // Strade principali: linee grigio-chiaro con bordo bianco (viali)
      ctx.save();

      // Helper: disegna una strada con bordi
      const drawRoad = (pts: number[][], width: number, color: string, borderColor: string) => {
        if (pts.length < 2) return;
        // Bordo
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = width + 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke();
        // Carreggiata
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke();
      };

      // ── GRANDI VIALI / CORSI (larghezza 9px) ──────────────────────────
      const mainRoads: number[][][] = [
        // Corso Francia (O→E, nord)
        [[0,118],[820,118]],
        // Corso Regina Margherita (O→E)
        [[0,195],[300,195],[640,250],[820,280]],
        // Corso Vittorio Emanuele II (O→E, centro)
        [[0,340],[200,330],[500,310],[700,330]],
        // Corso Massimo d'Azeglio (verso Lingotto)
        [[200,310],[220,400],[260,500],[270,600],[270,720]],
        // Corso Bramante → Lingotto (verticale S)
        [[310,310],[310,430],[300,530],[290,640],[290,720]],
        // Corso Re Umberto (verticale centro)
        [[370,120],[370,340]],
        // Corso Palestro / Galileo Ferraris
        [[430,110],[430,340]],
        // Via Nizza → Lingotto (verticale)
        [[260,310],[250,430],[240,540],[240,660],[240,720]],
        // Corso Casale (riva sinistra del Po, verso collina)
        [[700,350],[730,300],[780,250],[840,200]],
        // Corso Moncalieri (viale alberato, riva destra collina)
        [[760,380],[800,330],[850,280],[900,230],[950,180]],
        // Via Po (Piazza Castello → Piazza Vittorio sul Po)
        [[380,280],[480,285],[600,300],[695,340]],
        // Corso Galileo Ferraris → nord
        [[490,100],[490,310]],
        // Corso Duca degli Abruzzi / Einaudi
        [[540,120],[540,300]],
        // Viale del Valentino (dentro il parco, curva sul Po)
        [[480,380],[500,420],[520,470],[545,515],[570,560]],
        // Corso Unità d'Italia (Sud, verso Lingotto)
        [[350,340],[340,450],[330,560],[320,660],[320,720]],
        // Corso Turati (verticale)
        [[600,100],[600,280]],
        // Corso S. Maurizio (Mole → Po)
        [[640,220],[680,260],[710,310],[730,340]],
        // Via Mazzini / Carlo Alberto
        [[380,280],[500,280],[620,278]],
        // Corso Cairoli (nord)
        [[660,110],[660,240]],
      ];

      mainRoads.forEach(pts => drawRoad(pts, 6, '#e8e0cc', '#c8bfa8'));

      // ── STRADE SECONDARIE (larghezza 3.5px) ─────────────────────────
      const minorRoads: number[][][] = [
        // Griglia centro: strade orizzontali ogni ~30px
        [[0,150],[820,150]],[[0,170],[820,170]],
        [[0,220],[820,220]],[[0,240],[820,240]],[[0,260],[820,260]],
        [[0,300],[700,310]],[[0,320],[700,330]],
        [[0,360],[700,360]],[[0,380],[700,370]],
        // Griglia verticali
        [[150,100],[150,400]],[[200,100],[200,400]],
        [[250,100],[250,380]],[[300,100],[300,380]],
        [[350,100],[350,380]],[[400,100],[400,380]],
        [[450,100],[450,380]],[[500,100],[500,380]],
        [[550,100],[550,310]],
        // Strade verso il Po
        [[630,270],[660,320],[680,360]],
        [[590,260],[610,300],[640,340]],
      ];
      minorRoads.forEach(pts => drawRoad(pts, 3, '#ddd6c4', '#cac4b4'));
      ctx.restore();

      // F. PIAZZE PRINCIPALI — aree chiare rettangolari/circolari
      ctx.save();
      // Piazza Castello (centro, grande)
      ctx.fillStyle = '#d6ceb8';
      ctx.strokeStyle = '#b8af9e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(340, 255, 80, 55, 6);
      ctx.fill(); ctx.stroke();
      // Piazza Vittorio Veneto (rettangolare, verso il Po)
      ctx.fillStyle = '#d6ceb8';
      ctx.beginPath();
      ctx.roundRect(615, 295, 90, 50, 5);
      ctx.fill(); ctx.stroke();
      // Piazza San Carlo (quadrata elegante)
      ctx.fillStyle = '#cdc5ae';
      ctx.beginPath();
      ctx.roundRect(280, 295, 55, 40, 4);
      ctx.fill(); ctx.stroke();
      // Piazza della Repubblica (Porta Palazzo)
      ctx.fillStyle = '#d2cbb5';
      ctx.beginPath();
      ctx.roundRect(320, 148, 65, 42, 5);
      ctx.fill(); ctx.stroke();
      // Piazza Carlo Felice (di fronte Porta Nuova)
      ctx.fillStyle = '#cdc5ae';
      ctx.beginPath();
      ctx.arc(375, 358, 22, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      // Piazza Statuto (ovest)
      ctx.fillStyle = '#d2cbb5';
      ctx.beginPath();
      ctx.arc(152, 195, 18, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      // Piazza Bodoni / Cln
      ctx.fillStyle = '#d6ceb8';
      ctx.beginPath();
      ctx.arc(485, 318, 14, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.restore();

      // G. STAZIONE PORTA NUOVA — rettangolo con tetto a shed
      ctx.save();
      ctx.fillStyle = '#c4b99e';
      ctx.strokeStyle = '#9e9080';
      ctx.lineWidth = 2;
      ctx.fillRect(320, 348, 110, 28);
      ctx.strokeRect(320, 348, 110, 28);
      // Tettoie binari
      ctx.fillStyle = '#b0a890';
      for (let sx = 330; sx < 420; sx += 15) {
        ctx.fillRect(sx, 350, 10, 24);
      }
      // Label
      ctx.fillStyle = '#6b5e4a';
      ctx.font = 'bold 8px "Outfit", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PORTA NUOVA', 375, 344);
      ctx.restore();

      // H. STAZIONE PORTA SUSA (ovest)
      ctx.save();
      ctx.fillStyle = '#c4b99e';
      ctx.strokeStyle = '#9e9080';
      ctx.lineWidth = 1.5;
      ctx.fillRect(100, 275, 80, 22);
      ctx.strokeRect(100, 275, 80, 22);
      ctx.fillStyle = '#6b5e4a';
      ctx.font = 'bold 7px "Outfit", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PORTA SUSA', 140, 272);
      ctx.restore();

      // I. BLOCCHI DI ISOLATI URBANI — la griglia di edifici torinesi
      ctx.save();
      ctx.fillStyle = 'rgba(180,168,148,0.55)';
      ctx.strokeStyle = 'rgba(150,138,120,0.4)';
      ctx.lineWidth = 0.8;
      // Genera automaticamente una griglia di isolati nella zona centro
      for (let bx = 120; bx < 660; bx += 50) {
        for (let by = 110; by < 380; by += 38) {
          // Salta le piazze principali e il Po
          if (bx > 590 && by > 280) continue;
          if (bx > 330 && bx < 430 && by > 245 && by < 320) continue;
          ctx.fillRect(bx + 3, by + 3, 42, 30);
          ctx.strokeRect(bx + 3, by + 3, 42, 30);
        }
      }
      // Isolati a sud (verso Lingotto)
      for (let bx = 150; bx < 380; bx += 48) {
        for (let by = 380; bx < 660 && by < 580; by += 36) {
          if (bx > 380 && by > 350) continue;
          ctx.fillRect(bx + 3, by + 3, 40, 28);
          ctx.strokeRect(bx + 3, by + 3, 40, 28);
        }
      }
      ctx.restore();

      // J. PONTI SUL FIUME PO — raffigurati dall'alto come listelli grigi
      ctx.save();
      const bridges = [
        { x1: 640, y1: 298, x2: 710, y2: 345, w: 10, label: 'P.te Vittorio' },
        { x1: 570, y1: 480, x2: 640, y2: 510, w: 8, label: 'P.te Umberto' },
        { x1: 685, y1: 180, x2: 745, y2: 210, w: 8, label: 'P.te Isabella' },
        { x1: 720, y1: 390, x2: 790, y2: 420, w: 8, label: 'P.te Balbis' },
      ];
      bridges.forEach(b => {
        const angle = Math.atan2(b.y2 - b.y1, b.x2 - b.x1);
        const len = Math.hypot(b.x2 - b.x1, b.y2 - b.y1);
        ctx.save();
        ctx.translate((b.x1 + b.x2) / 2, (b.y1 + b.y2) / 2);
        ctx.rotate(angle);
        ctx.fillStyle = '#c8bfa8';
        ctx.strokeStyle = '#8a8070';
        ctx.lineWidth = 1;
        ctx.fillRect(-len / 2, -b.w / 2, len, b.w);
        ctx.strokeRect(-len / 2, -b.w / 2, len, b.w);
        // Spallette del ponte
        ctx.fillStyle = '#a8a090';
        ctx.fillRect(-len / 2, -b.w / 2 - 2, 5, b.w + 4);
        ctx.fillRect(len / 2 - 5, -b.w / 2 - 2, 5, b.w + 4);
        ctx.restore();
        // Label ponte
        ctx.fillStyle = 'rgba(60,50,35,0.7)';
        ctx.font = '7px "Outfit", system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(b.label, (b.x1 + b.x2) / 2, (b.y1 + b.y2) / 2 - 8);
      });
      ctx.restore();

      // K. LINEE FERROVIARIE — tratteggio scuro stile carta geografica
      ctx.save();
      ctx.strokeStyle = '#8a7a6a';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      // Linea Torino-Milano (verso nord)
      ctx.beginPath(); ctx.moveTo(375, 348); ctx.lineTo(340, 100); ctx.lineTo(300, 0); ctx.stroke();
      // Linea Torino-Genova (verso sud)
      ctx.beginPath(); ctx.moveTo(375, 376); ctx.lineTo(310, 500); ctx.lineTo(280, 720); ctx.stroke();
      // Linea verso Porta Susa / est-ovest
      ctx.beginPath(); ctx.moveTo(180, 286); ctx.lineTo(320, 286); ctx.lineTo(375, 348); ctx.stroke();
      // Tranvia dentiera Sassi-Superga (verso collina)
      ctx.strokeStyle = '#9a6040';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.moveTo(760, 285); ctx.bezierCurveTo(820, 250, 900, 200, 990, 165); ctx.lineTo(1060, 140); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // L. NOME DELLE STRADE PRINCIPALI
      ctx.save();
      ctx.font = '8px "Outfit", system-ui, sans-serif';
      ctx.fillStyle = 'rgba(80, 65, 45, 0.85)';
      ctx.textAlign = 'center';
      const streetLabels = [
        { text: 'C.so Francia', x: 400, y: 113, angle: 0 },
        { text: 'C.so Regina M.ta', x: 320, y: 190, angle: 0 },
        { text: 'C.so Vittorio E. II', x: 290, y: 344, angle: 0 },
        { text: 'Via Po', x: 540, y: 277, angle: 0 },
        { text: 'C.so Casale', x: 800, y: 278, angle: -22 },
        { text: 'C.so Moncalieri', x: 870, y: 310, angle: -28 },
        { text: 'C.so Massimo d\'Azeglio', x: 238, y: 420, angle: -85 },
      ];
      streetLabels.forEach(sl => {
        ctx.save();
        ctx.translate(sl.x, sl.y);
        ctx.rotate((sl.angle * Math.PI) / 180);
        ctx.fillText(sl.text, 0, 0);
        ctx.restore();
      });
      ctx.restore();

      // M. NOMI QUARTIERI / ZONE
      ctx.save();
      ctx.font = 'bold 11px "Outfit", system-ui, sans-serif';
      ctx.fillStyle = 'rgba(100, 80, 50, 0.4)';
      ctx.textAlign = 'center';
      [
        { text: 'CROCETTA', x: 215, y: 350 },
        { text: 'CENTRO', x: 380, y: 230 },
        { text: 'VANCHIGLIA', x: 620, y: 220 },
        { text: 'SAN SALVARIO', x: 260, y: 430 },
        { text: 'COLLINA', x: 970, y: 350 },
        { text: 'BORGO PO', x: 790, y: 430 },
        { text: 'FILADELFIA', x: 300, y: 580 },
      ].forEach(q => {
        ctx.fillText(q.text, q.x, q.y);
      });
      ctx.restore();

      // N. SENTIERI MAPPA (dotted paths stile Mario World sopra la mappa)
      ctx.save();
      for (const seg of MAP_PATHS) {
        // Ombra del sentiero
        ctx.strokeStyle = 'rgba(0,0,0,0.22)';
        ctx.lineWidth = 11;
        ctx.setLineDash([]);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        seg.points.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y + 2) : ctx.lineTo(pt.x, pt.y + 2));
        ctx.stroke();
        // Sentiero dorato tratteggiato
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 8;
        ctx.setLineDash([9, 11]);
        ctx.lineDashOffset = -(anim.tick * 0.8) % 20;
        ctx.beginPath();
        seg.points.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
        ctx.stroke();
        // Bordo bianco interno
        ctx.strokeStyle = 'rgba(255,255,255,0.55)';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 14]);
        ctx.beginPath();
        seg.points.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
      ctx.restore();

      // O. MONUMENTI / LANDMARKS ICONICI (miniature pittoriche)
      // 1. Palazzo Madama — Nodo 1 (x=380, y=280)
      ctx.save();
      {
        const px = 380, py = 220;
        ctx.fillStyle = '#e8dfc8'; ctx.strokeStyle = '#b0a070'; ctx.lineWidth = 1.5;
        ctx.fillRect(px - 38, py - 14, 76, 28); ctx.strokeRect(px - 38, py - 14, 76, 28);
        ctx.fillStyle = '#c8b888';
        for (let c = px - 28; c <= px + 28; c += 12) { ctx.fillRect(c, py - 8, 5, 16); }
        ctx.fillStyle = '#a08040';
        ctx.beginPath(); ctx.arc(px, py - 24, 14, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#d4b870'; ctx.fillRect(px - 2, py - 40, 4, 14);
      }
      ctx.restore();

      // 2. Mole Antonelliana — Nodo 2 (x=670, y=240)
      ctx.save();
      {
        const mx = 670, my = 170;
        ctx.fillStyle = '#d4c8a8'; ctx.strokeStyle = '#8a7a50'; ctx.lineWidth = 1.5;
        ctx.fillRect(mx - 18, my + 14, 36, 26); ctx.strokeRect(mx - 18, my + 14, 36, 26);
        ctx.fillStyle = '#c8b888';
        for (let c = mx - 14; c <= mx + 14; c += 8) { ctx.fillRect(c, my + 18, 4, 18); }
        ctx.fillStyle = '#8a6a20';
        ctx.beginPath();
        ctx.moveTo(mx - 18, my + 14); ctx.quadraticCurveTo(mx, my - 20, mx, my - 36);
        ctx.quadraticCurveTo(mx, my - 20, mx + 18, my + 14); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#c8a030'; ctx.fillRect(mx - 2, my - 74, 4, 38);
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(mx, my - 76, 3.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      // 3. Borgo Medievale — Nodo 3 (x=480, y=500) — già nel parco
      ctx.save();
      {
        const vx = 480, vy = 450;
        ctx.fillStyle = '#8a6040'; ctx.strokeStyle = '#5a4020'; ctx.lineWidth = 1.5;
        ctx.fillRect(vx - 18, vy, 36, 22); ctx.strokeRect(vx - 18, vy, 36, 22);
        ctx.fillRect(vx - 22, vy - 8, 9, 30); ctx.fillRect(vx + 13, vy - 8, 9, 30);
        ctx.fillStyle = '#b04040';
        ctx.beginPath(); ctx.moveTo(vx - 26, vy - 8); ctx.lineTo(vx - 17, vy - 20); ctx.lineTo(vx - 9, vy - 8); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(vx + 9, vy - 8); ctx.lineTo(vx + 17, vy - 20); ctx.lineTo(vx + 26, vy - 8); ctx.closePath(); ctx.fill();
      }
      ctx.restore();

      // 4. Murazzi — Nodo 4 (x=720, y=400) — sulle rive del Po
      ctx.save();
      {
        const mx2 = 720, my2 = 375;
        ctx.fillStyle = '#4a5a70'; ctx.strokeStyle = '#2a3a50'; ctx.lineWidth = 1;
        ctx.fillRect(mx2 - 28, my2, 56, 14); ctx.strokeRect(mx2 - 28, my2, 56, 14);
        for (let ax = mx2 - 20; ax <= mx2 + 18; ax += 14) {
          ctx.fillStyle = '#1a2a40';
          ctx.beginPath(); ctx.arc(ax, my2 + 8, 5, Math.PI, 0); ctx.fill();
          ctx.fillStyle = `rgba(245,158,11,${0.6 + Math.sin(anim.tick * 0.1 + ax) * 0.3})`;
          ctx.fillRect(ax - 2, my2 + 2, 4, 3);
        }
      }
      ctx.restore();

      // 5. Basilica di Superga — Nodo 5 (x=1060, y=190)
      ctx.save();
      {
        const sx = 1060, sy = 128;
        ctx.fillStyle = '#f0d8a0'; ctx.strokeStyle = '#c09040'; ctx.lineWidth = 1.5;
        ctx.fillRect(sx - 22, sy + 4, 44, 22); ctx.strokeRect(sx - 22, sy + 4, 44, 22);
        ctx.fillStyle = '#d09040';
        for (let c = sx - 16; c <= sx + 16; c += 8) { ctx.fillRect(c, sy + 7, 3, 16); }
        ctx.fillStyle = '#c07830';
        ctx.beginPath(); ctx.arc(sx, sy + 2, 14, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#f0d8a0'; ctx.fillRect(sx - 2, sy - 16, 4, 14);
        ctx.fillRect(sx - 26, sy - 10, 6, 34); ctx.fillRect(sx + 20, sy - 10, 6, 34);
      }
      ctx.restore();

      // 6. Lingotto FIAT — Nodo 6 (x=270, y=600)
      ctx.save();
      {
        const lx = 270, ly = 565;
        ctx.fillStyle = '#8a2020'; ctx.strokeStyle = '#5a1010'; ctx.lineWidth = 1.5;
        ctx.fillRect(lx - 42, ly - 10, 84, 20); ctx.strokeRect(lx - 42, ly - 10, 84, 20);
        ctx.fillStyle = '#7ab4e8';
        for (let wx = lx - 36; wx <= lx + 36; wx += 10) { ctx.fillRect(wx, ly - 7, 6, 6); ctx.fillRect(wx, ly + 1, 6, 5); }
        ctx.strokeStyle = '#1e2830'; ctx.lineWidth = 3.5; ctx.setLineDash([]);
        ctx.beginPath(); ctx.ellipse(lx, ly - 14, 38, 9, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(lx + 20, ly - 22, 6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      // Dettagli ambientali carini (fontanelle Tôret torinesi sparse)
      const toretsx = [310, 540, 420];
      const toretsy = [240, 230, 500];
      ctx.fillStyle = '#2a6040';
      for (let i = 0; i < toretsx.length; i++) {
        ctx.fillRect(toretsx[i], toretsy[i], 4, 8);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(toretsx[i] - 1, toretsy[i] + 2, 2, 2);
        ctx.fillStyle = '#2a6040';
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

        {/* ── BARRA NAVIGAZIONE LIVELLI MOBILE ─────────────────────────────
            Visibile solo su touch/mobile. Mostra le info del livello
            accanto ai bottoni per selezionare il livello e al tasto GIOCA.
        ──────────────────────────────────────────────────────────────────── */}
        <div className="map-mobile-nav">
          {/* Info del livello selezionato accanto ai controlli */}
          <div className="map-mobile-info-badge">
            <div className="map-mobile-info-main">
              <span className="map-mobile-info-num">{currentNode.id}</span>
              <span className="map-mobile-info-title">{currentNode.title}</span>
            </div>
            <div className="map-mobile-info-meta">
              <span className="map-mobile-info-diff">{currentNode.diff}</span>
              {currentBestScore > 0 ? (
                <span className="map-mobile-info-score">⭐ {currentBestScore}</span>
              ) : (
                <span className="map-mobile-info-sub">{currentNode.landmark}</span>
              )}
            </div>
          </div>

          {/* Freccia Precedente */}
          <button
            className="map-mobile-nav-arrow"
            onClick={() => {
              const ids = Object.keys(MAP_NODES).map(Number);
              const idx = ids.indexOf(currentNodeId);
              const prevId = ids[(idx - 1 + ids.length) % ids.length];
              moveToNode(prevId);
            }}
            aria-label="Livello precedente"
          >
            ◀
          </button>

          {/* Pillole livello */}
          <div className="map-mobile-nav-levels">
            {Object.values(MAP_NODES).map((node) => {
              const isCurrent = node.id === currentNodeId;
              const isTarget = node.id === targetNodeId;
              const levelEmojis: Record<number, string> = {
                1: '🏛️', 2: '🗼', 3: '🌳', 4: '🌙', 5: '🐗', 6: '🤖',
              };
              return (
                <button
                  key={node.id}
                  className={`map-mobile-level-pill${isCurrent ? ' is-current' : ''}${isTarget ? ' is-moving' : ''}`}
                  onClick={() => {
                    if (isCurrent && !animRef.current.isMoving) {
                      onSelectLevel(node.id);
                    } else {
                      moveToNode(node.id);
                    }
                  }}
                  title={node.title}
                >
                  <span className="map-pill-emoji">{levelEmojis[node.id] ?? '📍'}</span>
                  <span className="map-pill-num">{node.id}</span>
                  {(bestScores[node.id] ?? 0) > 0 && (
                    <span className="map-pill-star">⭐</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Freccia Successiva */}
          <button
            className="map-mobile-nav-arrow"
            onClick={() => {
              const ids = Object.keys(MAP_NODES).map(Number);
              const idx = ids.indexOf(currentNodeId);
              const nextId = ids[(idx + 1) % ids.length];
              moveToNode(nextId);
            }}
            aria-label="Livello successivo"
          >
            ▶
          </button>

          {/* Bottone GIOCA */}
          <button
            className="map-mobile-play-btn"
            onClick={() => onSelectLevel(targetNodeId ?? currentNodeId)}
            aria-label={`Gioca livello ${targetNodeId ?? currentNodeId}`}
          >
            ▶ GIOCA
          </button>
        </div>
      </div>
    </div>
  );
};
