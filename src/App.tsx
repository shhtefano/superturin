import React from 'react';
import { GameView } from './components/GameView';
import './styles/index.css';
import './styles/ui.css';
import './styles/hud.css';
import './styles/mobile.css';
import './styles/worldmap.css';

export const App: React.FC = () => {
  return <GameView />;
};

export default App;
