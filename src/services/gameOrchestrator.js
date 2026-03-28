import { conversationOrchestrator } from './conversationOrchestrator.js';
import { memoryService } from './memoryService.js';
import { diabolicalPlanner } from './diabolicalPlanner.js';
import { startDay, completeActivity } from '../engine/dayManager.js';
import { getMemoryItems } from '../engine/memoryEngine.js';

/**
 * Runs a full day loop for the game.
 *
 * @param {object} opts
 * @param {object} opts.gameState        - Current game state (from dayManager)
 * @param {object} opts.config           - Per-character API config { husband, wife, poltergeist }
 * @param {object} opts.personalities    - { husband, wife, poltergeist } personality strings
 * @param {object} opts.memories         - { husband, wife, poltergeist } current memory strings
 * @param {object} opts.roomInfluences   - { bedroom, kitchen, 'living-room', 'mystery-room' }
 * @param {string|null} opts.previousPlan - Poltergeist's previous monologue (for continuity)
 *
 * UI hooks (called at key moments):
 * @param {function} opts.onShowSelections  - (today) called with today's selections
 * @param {function} opts.onShowRoom        - (roomName, sprites[]) room + character setup
 * @param {function} opts.onTurnStart       - (speaker) before each LLM turn
 * @param {function} opts.onChunk           - (speaker, chunk) streaming text chunk
 * @param {function} opts.onTurnComplete    - (speaker, text) after each turn
 * @param {function} opts.onConversationComplete - (type, transcript)
 * @param {function} opts.onMemoryThought   - (character, chunk) streaming memory reflection
 * @param {function} opts.onMemoryComplete  - (character, updatedMemoryText)
 * @param {function} opts.onDiabolicalChunk - (chunk) streaming poltergeist monologue
 * @param {function} opts.onDiabolicalComplete - (text)
 * @param {function} opts.onSleep           - () sleep transition
 * @param {function} opts.onDayAdvance      - (newDay) day incremented
 * @param {function} opts.awaitClick        - () => Promise<void> — waits for user input
 *
 * @returns {Promise<object>} Updated game state after the day completes
 */
export async function runDayLoop({
  gameState,
  config,
  personalities,
  memories,
  roomInfluences,
  previousPlan,
  onShowSelections,
  onShowRoom,
  onTurnStart,
  onChunk,
  onTurnComplete,
  onConversationComplete,
  onMemoryThought,
  onMemoryComplete,
  onDiabolicalChunk,
  onDiabolicalComplete,
  onSleep,
  onDayAdvance,
  awaitClick,
}) {
  // Initialise the day
  let state = startDay(gameState);
  const { coupleRoom, poltergeistRoom, poltergeistTarget } = state.today;

  // ── Step 1: Show today's random selections ────────────────────────────────
  onShowSelections(state.today);
  await awaitClick();

  // ── Step 2: Couple conversation ───────────────────────────────────────────
  onShowRoom(coupleRoom, ['husband', 'wife']);

  const coupleTranscript = await conversationOrchestrator.runConversation({
    participants: ['husband', 'wife'],
    room: coupleRoom,
    config,
    personalities,
    memories,
    roomInfluence: roomInfluences[coupleRoom] ?? '',
    maxTurns: 6,
    day: state.currentDay,
    logType: 'couple',
    onTurnStart,
    onChunk,
    onTurnComplete,
    onConversationComplete: (transcript) => onConversationComplete('husband-wife', transcript),
    awaitClick,
  });

  state = completeActivity(state, 'couple-conversation');
  await awaitClick();

  // ── Step 3: Poltergeist conversation ──────────────────────────────────────
  onShowRoom(poltergeistRoom, ['poltergeist', poltergeistTarget]);

  const poltergeistTranscript = await conversationOrchestrator.runConversation({
    participants: [poltergeistTarget, 'poltergeist'],
    room: poltergeistRoom,
    config,
    personalities,
    memories,
    roomInfluence: roomInfluences[poltergeistRoom] ?? '',
    maxTurns: 6,
    day: state.currentDay,
    logType: 'poltergeist',
    onTurnStart,
    onChunk,
    onTurnComplete,
    onConversationComplete: (transcript) => onConversationComplete('poltergeist', transcript),
    awaitClick,
  });

  state = completeActivity(state, 'poltergeist-conversation');
  await awaitClick();

  // Conversations available for memory reflection
  const coupleConvos = [coupleTranscript, poltergeistTranscript];
  const poltergeistConvos = [poltergeistTranscript];

  // ── Step 4: Wife memory reflection ───────────────────────────────────────
  onShowRoom('bedroom', ['wife']);
  onTurnStart('wife');

  await memoryService.reflectAndUpdate({
    character: 'wife',
    dayConversations: coupleConvos,
    config: config.wife,
    personality: personalities.wife,
    currentMemory: getMemoryItems(memories.wife),
    maxNewItems: 3,
    maxTotalItems: 10,
    onThought: (chunk) => onMemoryThought('wife', chunk),
    onComplete: (updatedText) => {
      memories.wife = updatedText;
      onMemoryComplete('wife', updatedText);
    },
  });

  await awaitClick();

  // ── Step 5: Husband memory reflection ────────────────────────────────────
  onShowRoom('bedroom', ['husband']);
  onTurnStart('husband');

  await memoryService.reflectAndUpdate({
    character: 'husband',
    dayConversations: coupleConvos,
    config: config.husband,
    personality: personalities.husband,
    currentMemory: getMemoryItems(memories.husband),
    maxNewItems: 3,
    maxTotalItems: 10,
    onThought: (chunk) => onMemoryThought('husband', chunk),
    onComplete: (updatedText) => {
      memories.husband = updatedText;
      onMemoryComplete('husband', updatedText);
    },
  });

  await awaitClick();

  // ── Step 6: Poltergeist memory reflection + diabolical monologue ──────────
  onShowRoom('mystery-room', ['poltergeist']);
  onTurnStart('poltergeist');

  await memoryService.reflectAndUpdate({
    character: 'poltergeist',
    dayConversations: poltergeistConvos,
    config: config.poltergeist,
    personality: personalities.poltergeist,
    currentMemory: getMemoryItems(memories.poltergeist),
    maxNewItems: 3,
    maxTotalItems: 10,
    onThought: (chunk) => onMemoryThought('poltergeist', chunk),
    onComplete: (updatedText) => {
      memories.poltergeist = updatedText;
      onMemoryComplete('poltergeist', updatedText);
    },
  });

  onTurnStart('poltergeist');
  await diabolicalPlanner.runMonologue({
    config,
    personality: personalities.poltergeist,
    memory: memories.poltergeist,
    previousPlan,
    onChunk: onDiabolicalChunk,
    onComplete: onDiabolicalComplete,
  });

  await awaitClick();

  // ── Step 7: Sleep transition ──────────────────────────────────────────────
  onSleep();
  await awaitClick();

  // ── Advance day ───────────────────────────────────────────────────────────
  state = completeActivity(state, 'sleep');
  onDayAdvance(state.currentDay);

  return state;
}
