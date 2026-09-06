import { CharacterId } from '../types/game';

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  subtitle: string;
  description: string;
  skillName: string;
  skillKey: string;
  skillDescription: string;
  skillCooldown: number; // in secondi
  tag: string;
  color: string;
  accentColor: string;
}

export const CHARACTERS: Record<CharacterId, CharacterConfig> = {
  shhte: {
    id: 'shhte',
    name: 'Shhte',
    subtitle: 'Hacker Sabaudo & Cyber-Runner',
    description: 'Il creatore e programmatore di Super Turin. Maestro dell\'overclocking dei sistemi torinesi.',
    skillName: 'Matrix Overclock',
    skillKey: 'SPACE',
    skillDescription: 'Rallenta il tempo e i nemici al 35% per 4s, conferendo velocità supersonica 1.8x.',
    skillCooldown: 12.0,
    tag: '⚡ SPEED & TIME',
    color: '#06b6d4',
    accentColor: '#38bdf8',
  },
  ugo: {
    id: 'ugo',
    name: 'Ugo',
    subtitle: 'Il Brawler dei Murazzi',
    description: 'Veterano delle notti torinesi lungo il Po. Forza pura capace di scuotere il selciato.',
    skillName: 'Terremoto dei Murazzi',
    skillKey: 'SPACE',
    skillDescription: 'Schianto tellurico che stordisce ed elimina all\'istante tutti i nemici a terra nel raggio di 450px.',
    skillCooldown: 9.0,
    tag: '💥 TANK & STOMP',
    color: '#ef4444',
    accentColor: '#b91c1c',
  },
  jari: {
    id: 'jari',
    name: 'Jari',
    subtitle: 'L\'Acrobata Ninja del Valentino',
    description: 'Agilissimo acrobata urbano dei parchi torinesi. Raggiunge altezze inaccessibili a chiunque.',
    skillName: 'Salto Jet & Planata Reale',
    skillKey: 'SPACE',
    skillDescription: 'Spinta a razzo verticale aerea con scia infuocata, seguita da 3.5s di planata fluttuante.',
    skillCooldown: 8.0,
    tag: '🪂 AIR GLIDER',
    color: '#10b981',
    accentColor: '#059669',
  },
  jonson: {
    id: 'jonson',
    name: 'Jonson',
    subtitle: 'Il Guastatore Pesante',
    description: 'Tiratore scelto e collezionista di artiglieria pesante delle officine industriali.',
    skillName: 'Raffica a Ventaglio 5x',
    skillKey: 'SPACE',
    skillDescription: 'Spara una devastante salva di 5 colpi a cono che spazza via corridoi di nemici e blocchi ?.',
    skillCooldown: 7.0,
    tag: '🎯 HEAVY MARKS',
    color: '#f59e0b',
    accentColor: '#d97706',
  },
  krebs: {
    id: 'krebs',
    name: 'Krebs',
    subtitle: 'Il Biochimico delle Sostanze',
    description: 'Genio della chimica farmaceutica torinese. Manipola il ciclo biologico delle sostanze psichedeliche.',
    skillName: 'Aura Tossica & Bio-Cura',
    skillKey: 'SPACE',
    skillDescription: 'Genera un anello di bio-spore tossiche per 5s che scioglie i nemici e rigenera subito +1 Cuore!',
    skillCooldown: 15.0,
    tag: '🧪 HEAL & TOXIC',
    color: '#a855f7',
    accentColor: '#9333ea',
  },
  devis: {
    id: 'devis',
    name: 'Devis',
    subtitle: 'Il Demone Spettrale della Notte',
    description: 'Spirito enigmatico delle gallerie sotterranee di Pietro Micca. Inafferrabile e spietato.',
    skillName: 'Fase Spettrale (Incorporeo)',
    skillKey: 'SPACE',
    skillDescription: 'Diventa etereo per 4s: totale invulnerabilità ai danni, scatto +100% e attraversa nemici ed ostacoli.',
    skillCooldown: 10.0,
    tag: '👻 PHANTOM DASH',
    color: '#6366f1',
    accentColor: '#4f46e5',
  },
  willy: {
    id: 'willy',
    name: 'Willy',
    subtitle: 'Il Giocatore d\'Azzardo Reale',
    description: 'Nobile dandy torinese appassionato di scommesse e piogge dorate di cioccolato.',
    skillName: 'Jackpot Sabaudo',
    skillKey: 'SPACE',
    skillDescription: 'Evoca dal cielo una pioggia di 6 gianduiotti esplosivi, regala +500 punti e un power-up a sorpresa!',
    skillCooldown: 14.0,
    tag: '🎰 GOLD JACKPOT',
    color: '#ffd166',
    accentColor: '#ffb703',
  },
  benedetta: {
    id: 'benedetta',
    name: 'Bennipi',
    subtitle: 'La Duchessa Reale dei Portici',
    description: 'Elegante nobildonna dei salotti torinesi e campionessa sabauda. Unisce grazia aristocratica e tempestosi incanti magnetici.',
    skillName: 'Incanto Reale & Pioggia di Cuori',
    skillKey: 'SPACE',
    skillDescription: 'Onda d\'urto di cuori che sconfigge i nemici trasformandoli in gianduiotti (+250 pt), attira ogni moneta e conferisce scudo per 4s.',
    skillCooldown: 11.0,
    tag: '💖 CHARM & SHIELD',
    color: '#ec4899',
    accentColor: '#f43f5e',
  },
};

export const CHARACTER_LIST: CharacterConfig[] = Object.values(CHARACTERS);

export function getCharacterConfig(id: CharacterId): CharacterConfig {
  return CHARACTERS[id] || CHARACTERS.shhte;
}
