import { createTopBar } from '../components/topBar.js';
import { createCenterScreen } from '../components/centerScreen.js';
import { createHistoryPanel } from '../components/historyPanel.js';
import { createBottomBar } from '../components/bottomBar.js';

export function createGameScreen() {
  const screen = document.createElement('div');
  screen.id = 'game-screen';
  screen.className = 'screen';

  screen.appendChild(createTopBar());

  // Body row: left column (center + bottom bar) + right panel
  const body = document.createElement('div');
  body.className = 'game-body';

  const left = document.createElement('div');
  left.className = 'game-left';
  left.appendChild(createCenterScreen());
  left.appendChild(createBottomBar());

  body.appendChild(left);
  body.appendChild(createHistoryPanel());

  screen.appendChild(body);

  return screen;
}
