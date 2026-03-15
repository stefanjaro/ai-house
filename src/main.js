import './styles/main.css';
import { createStartScreen } from './ui/screens/startScreen.js';
import { createGameScreen } from './ui/screens/gameScreen.js';
import { createEndScreen } from './ui/screens/endScreen.js';

const app = document.getElementById('app');

function showScreen(screenEl) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  screenEl.classList.add('active');
}

const gameScreen = createGameScreen();
const endScreen = createEndScreen();
const startScreen = createStartScreen(() => showScreen(gameScreen));

app.appendChild(startScreen);
app.appendChild(gameScreen);
app.appendChild(endScreen);

showScreen(startScreen);
