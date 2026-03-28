import './styles/main.css';
import { createStartScreen } from './ui/screens/startScreen.js';
import { createCharacterCreationScreen } from './ui/screens/characterCreationScreen.js';
import { createGameScreen } from './ui/screens/gameScreen.js';
import { createEndScreen } from './ui/screens/endScreen.js';
import { fileService } from './services/fileService.js';
import { updateCardName } from './ui/components/bottomBar.js';

const app = document.getElementById('app');

function showScreen(screenEl) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  screenEl.classList.add('active');
}

const { el: gameScreenEl, init: initGame } = createGameScreen();
const endScreen = createEndScreen();

let characterCreationScreen = null;

async function loadCharacterCreation() {
  const [config, husbandPersonality, wifePersonality, poltergeistPersonality] = await Promise.all([
    fileService.getConfig(),
    fileService.getPersonality('husband'),
    fileService.getPersonality('wife'),
    fileService.getPersonality('poltergeist'),
  ]);

  if (characterCreationScreen) {
    characterCreationScreen.remove();
  }

  characterCreationScreen = createCharacterCreationScreen({
    config,
    personalities: {
      husband: husbandPersonality,
      wife: wifePersonality,
      poltergeist: poltergeistPersonality,
    },
    setPersonality: fileService.setPersonality.bind(fileService),
    async onBegin(names) {
      // Update bottom bar card names to match the user's custom names
      updateCardName('husband', names.husband);
      updateCardName('wife', names.wife);
      updateCardName('poltergeist', names.poltergeist);

      showScreen(gameScreenEl);

      await initGame(config, names, () => {
        showScreen(endScreen);
      });
    },
  });

  app.appendChild(characterCreationScreen);
  showScreen(characterCreationScreen);
}

const startScreen = createStartScreen(loadCharacterCreation);

app.appendChild(startScreen);
app.appendChild(gameScreenEl);
app.appendChild(endScreen);

showScreen(startScreen);
