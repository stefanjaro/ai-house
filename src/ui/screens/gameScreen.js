import { createTopBar, updateDayDisplay } from '../components/topBar.js';
import { createCenterScreen } from '../components/centerScreen.js';
import { createHistoryPanel } from '../components/historyPanel.js';
import { createBottomBar } from '../components/bottomBar.js';
import { runDayLoop } from '../../services/gameOrchestrator.js';
import { createGameState, isGameOver } from '../../engine/dayManager.js';
import { fileService } from '../../services/fileService.js';
import { getMemoryItems } from '../../engine/memoryEngine.js';

/**
 * Creates the game screen element and returns { el, init }.
 * Call init(config, names, onGameOver) to start the game loop.
 */
export function createGameScreen() {
  const screen = document.createElement('div');
  screen.id = 'game-screen';
  screen.className = 'screen';

  screen.appendChild(createTopBar());

  const body = document.createElement('div');
  body.className = 'game-body';

  const left = document.createElement('div');
  left.className = 'game-left';

  const { el: centerEl, controller: center } = createCenterScreen();
  const bottomBar = createBottomBar();

  left.appendChild(centerEl);
  left.appendChild(bottomBar);

  body.appendChild(left);
  body.appendChild(createHistoryPanel());
  screen.appendChild(body);

  /**
   * Starts the full game loop.
   * @param {object} config  - API config from fileService.getConfig()
   * @param {object} names   - { husband, wife, poltergeist } display names
   * @param {function} onGameOver - called when all 10 days are done
   */
  async function init(config, names, onGameOver) {
    // Load initial personalities and memories
    const [
      husbandPersonality, wifePersonality, poltergeistPersonality,
      husbandMemory, wifeMemory, poltergeistMemory,
      bedroomInfluence, kitchenInfluence, livingRoomInfluence, mysteryRoomInfluence,
    ] = await Promise.all([
      fileService.getPersonality('husband'),
      fileService.getPersonality('wife'),
      fileService.getPersonality('poltergeist'),
      fileService.getMemory('husband'),
      fileService.getMemory('wife'),
      fileService.getMemory('poltergeist'),
      fileService.getRoomInfluence('bedroom'),
      fileService.getRoomInfluence('kitchen'),
      fileService.getRoomInfluence('living-room'),
      fileService.getRoomInfluence('mystery-room'),
    ]);

    const personalities = {
      husband: husbandPersonality,
      wife: wifePersonality,
      poltergeist: poltergeistPersonality,
    };

    const memories = {
      husband: husbandMemory,
      wife: wifeMemory,
      poltergeist: poltergeistMemory,
    };

    const roomInfluences = {
      bedroom: bedroomInfluence,
      kitchen: kitchenInfluence,
      'living-room': livingRoomInfluence,
      'mystery-room': mysteryRoomInfluence,
    };

    // Merge display names into config for orchestrator's name formatting
    const configWithNames = {
      husband: { ...config.husband, name: names.husband },
      wife: { ...config.wife, name: names.wife },
      poltergeist: { ...config.poltergeist, name: names.poltergeist },
    };

    let gameState = createGameState(configWithNames);
    let previousPlan = null;

    updateDayDisplay(gameState.currentDay);
    center.showDayTransition(gameState.currentDay);

    while (!isGameOver(gameState)) {
      // awaitClick is the center screen's click-to-proceed
      const awaitClick = () => center.awaitClick();

      gameState = await runDayLoop({
        gameState,
        config: configWithNames,
        personalities,
        memories,
        roomInfluences,
        previousPlan,

        onShowSelections: (today) => {
          center.showSelections(today, names);
        },

        onShowRoom: (roomName, sprites) => {
          center.showRoom(roomName, sprites);
        },

        onTurnStart: (speaker) => {
          center.onTurnStart(speaker, names);
        },

        onChunk: (speaker, chunk) => {
          center.onChunk(speaker, chunk);
        },

        onTurnComplete: () => {
          center.onTurnComplete();
        },

        onConversationComplete: (_type, _transcript) => {
          // History panel could be updated here in Phase 10
        },

        onMemoryThought: (character, chunk) => {
          center.onChunk(character, chunk);
        },

        onMemoryComplete: (character, updatedText) => {
          // Memory updated — keep in-memory copy current
          memories[character] = updatedText;
          center.onTurnComplete();
        },

        onDiabolicalChunk: (chunk) => {
          center.onChunk('poltergeist', chunk);
        },

        onDiabolicalComplete: (text) => {
          previousPlan = text;
          center.onTurnComplete();
        },

        onSleep: () => {
          center.showSleep();
        },

        onDayAdvance: (newDay) => {
          updateDayDisplay(newDay);
          if (!isGameOver(gameState)) {
            center.showDayTransition(newDay);
          }
        },

        awaitClick,
      });
    }

    onGameOver();
  }

  return { el: screen, init };
}
