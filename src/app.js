import { createCharacterProfiles, getCharacterProfile, validateCharacterProfile } from './lib/characterProfiles.js';
import { createSeedJournalEntries } from './lib/journalSeeds.js';
import { pickVisibleMemoryCandidates } from './lib/memoryCandidates.js';
import { renderLayout } from './lib/renderLayout.js';
import { countWords, validateTopic } from './lib/topic.js';
import { TRANSCRIPT_TURN_COUNT } from './lib/transcript.js';

const SETUP_STEPS = ['characters', 'room', 'speaker', 'topic', 'confirm'];

export function createApp(mountNode, options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const state = createInitialState();

  mountNode.addEventListener('click', (event) => handleClick(event, state, mountNode, renderApp, fetchImpl));
  mountNode.addEventListener('input', (event) => handleInput(event, state, mountNode));

  renderApp();

  return {
    getState: () => structuredClone(state),
  };

  function renderApp() {
    mountNode.innerHTML = renderLayout(state);
    syncTopicFeedback(mountNode, state.topic, state.error);
    syncCharacterEditorFeedback(mountNode, state.characterDraft, state.characterError);
  }
}

function createInitialState() {
  return {
    step: 'characters',
    selectedCharacterIds: ['husband', 'wife'],
    characterProfiles: createCharacterProfiles(),
    characterPanel: null,
    roomPanelOpen: false,
    characterDraft: null,
    characterError: '',
    roomId: 'living-room',
    startingSpeakerId: 'husband',
    topic: '',
    transcript: [],
    revealedTurnCount: 0,
    isGeneratingTurn: false,
    waitingForTurn: false,
    journalEntriesByCharacter: createSeedJournalEntries(),
    memoryCandidatesByCharacter: {},
    isGeneratingMemories: false,
    memoryError: '',
    error: '',
    lastRun: null,
    conversationRequestId: 0,
    memoryRequestId: 0,
  };
}

function handleClick(event, state, mountNode, renderApp, fetchImpl) {
  const actionTarget = event.target.closest('[data-action]');
  if (!actionTarget) {
    return;
  }

  const { action, value } = actionTarget.dataset;

  if (action === 'toggle-character') {
    toggleCharacter(state, value);
    state.error = '';
    renderApp();
    return;
  }

  if (action === 'open-character-editor') {
    openCharacterPanel(state, value, 'edit');
    renderApp();
    return;
  }

  if (action === 'inspect-character') {
    openCharacterPanel(state, value, 'inspect');
    renderApp();
    return;
  }

  if (action === 'close-character-panel') {
    closeCharacterPanel(state);
    renderApp();
    return;
  }

  if (action === 'inspect-room') {
    state.roomPanelOpen = true;
    renderApp();
    return;
  }

  if (action === 'close-room-panel') {
    state.roomPanelOpen = false;
    renderApp();
    return;
  }

  if (action === 'save-character') {
    saveCharacter(state, renderApp);
    return;
  }

  if (action === 'pick-room') {
    state.roomId = value;
    state.error = '';
    renderApp();
    return;
  }

  if (action === 'pick-speaker') {
    if (state.selectedCharacterIds.includes(value)) {
      state.startingSpeakerId = value;
      state.error = '';
      renderApp();
    }
    return;
  }

  if (action === 'next-step') {
    advanceStep(state, renderApp);
    return;
  }

  if (action === 'back-step') {
    retreatStep(state);
    renderApp();
    return;
  }

  if (action === 'start-conversation') {
    void startConversation(state, renderApp, fetchImpl);
    return;
  }

  if (action === 'reveal-next-turn') {
    revealNextTurn(state, renderApp);
    return;
  }

  if (action === 'replay-duel' && !state.isGeneratingTurn && state.lastRun) {
    void startConversation(state, renderApp, fetchImpl, state.lastRun);
    return;
  }

  if (action === 'review-memory-candidates') {
    void openMemoryCandidateScene(state, renderApp, fetchImpl);
    return;
  }

  if (action === 'return-to-confirmation' && !state.isGeneratingTurn && !state.isGeneratingMemories) {
    state.step = 'confirm';
    state.error = '';
    state.memoryError = '';
    closeCharacterPanel(state);
    renderApp();
    return;
  }

  syncTopicFeedback(mountNode, state.topic, state.error);
}

function handleInput(event, state, mountNode) {
  if (event.target.id === 'topic') {
    state.topic = event.target.value;
    const topicCheck = validateTopic(state.topic);
    state.error = topicCheck.ok || !state.topic.trim() ? '' : topicCheck.error;
    syncTopicFeedback(mountNode, state.topic, state.error);
    return;
  }

  if (!state.characterPanel || state.characterPanel.mode !== 'edit' || !state.characterDraft) {
    return;
  }

  if (event.target.id === 'character-name') {
    state.characterDraft.name = event.target.value;
  }

  if (event.target.id === 'character-personality') {
    state.characterDraft.personality = event.target.value;
  }

  const validation = validateCharacterProfile(state.characterDraft);
  state.characterError = validation.ok ? '' : validation.error;
  syncCharacterEditorFeedback(mountNode, state.characterDraft, state.characterError);
}

function advanceStep(state, renderApp) {
  const error = validateCurrentStep(state);
  if (error) {
    state.error = error;
    renderApp();
    return;
  }

  state.error = '';
  closeCharacterPanel(state);
  state.roomPanelOpen = false;
  const currentIndex = SETUP_STEPS.indexOf(state.step);
  state.step = SETUP_STEPS[Math.min(currentIndex + 1, SETUP_STEPS.length - 1)];
  renderApp();
}

function retreatStep(state) {
  state.error = '';
  closeCharacterPanel(state);
  state.roomPanelOpen = false;
  const currentIndex = SETUP_STEPS.indexOf(state.step);
  state.step = SETUP_STEPS[Math.max(currentIndex - 1, 0)];
}

function validateCurrentStep(state) {
  if (state.step === 'characters' && state.selectedCharacterIds.length !== 2) {
    return 'Choose exactly two characters.';
  }

  if (state.step === 'topic') {
    const topicCheck = validateTopic(state.topic);
    return topicCheck.ok ? '' : topicCheck.error;
  }

  return '';
}

function toggleCharacter(state, characterId) {
  const isSelected = state.selectedCharacterIds.includes(characterId);

  if (isSelected && state.selectedCharacterIds.length > 1) {
    state.selectedCharacterIds = state.selectedCharacterIds.filter((id) => id !== characterId);
  } else if (!isSelected) {
    state.selectedCharacterIds =
      state.selectedCharacterIds.length === 2
        ? [state.selectedCharacterIds[1], characterId]
        : [...state.selectedCharacterIds, characterId];
  }

  if (!state.selectedCharacterIds.includes(state.startingSpeakerId)) {
    state.startingSpeakerId = state.selectedCharacterIds[0];
  }
}

function openCharacterPanel(state, characterId, mode) {
  const character = getCharacterProfile(state.characterProfiles, characterId);
  state.characterPanel = character ? { mode, characterId } : null;
  state.characterDraft = mode === 'edit' && character ? { name: character.name, personality: character.personality } : null;
  state.characterError = '';
}

function closeCharacterPanel(state) {
  state.characterPanel = null;
  state.characterDraft = null;
  state.characterError = '';
}

function saveCharacter(state, renderApp) {
  if (!state.characterPanel || state.characterPanel.mode !== 'edit' || !state.characterDraft) {
    return;
  }

  const validation = validateCharacterProfile(state.characterDraft);
  if (!validation.ok) {
    state.characterError = validation.error;
    renderApp();
    return;
  }

  const characterId = state.characterPanel.characterId;
  state.characterProfiles[characterId] = {
    ...state.characterProfiles[characterId],
    name: validation.name,
    personality: validation.personality,
  };
  closeCharacterPanel(state);
  renderApp();
}

async function startConversation(state, renderApp, fetchImpl, sourceRun = buildRunFromState(state)) {
  const topicCheck = validateTopic(sourceRun.topic);
  if (!topicCheck.ok) {
    state.error = topicCheck.error;
    state.step = 'topic';
    renderApp();
    return;
  }

  const run = {
    ...sourceRun,
    topic: topicCheck.normalizedTopic,
  };

  state.conversationRequestId += 1;
  state.step = 'conversation';
  state.transcript = [];
  state.revealedTurnCount = 0;
  state.isGeneratingTurn = false;
  state.waitingForTurn = false;
  resetMemoryCandidateState(state);
  state.error = '';
  state.lastRun = run;
  state.topic = run.topic;
  closeCharacterPanel(state);
  renderApp();

  void generateTurnsInBackground(state, renderApp, fetchImpl, run, state.conversationRequestId);
}

async function generateTurnsInBackground(state, renderApp, fetchImpl, run, requestId) {
  while (requestId === state.conversationRequestId && state.transcript.length < TRANSCRIPT_TURN_COUNT) {
    state.isGeneratingTurn = true;
    renderApp();

    try {
      const turn = await requestTurn(fetchImpl, run, state.transcript, state.transcript.length + 1);
      if (requestId !== state.conversationRequestId) {
        return;
      }

      state.transcript = [...state.transcript, { ...turn, number: state.transcript.length + 1 }];
      if (state.revealedTurnCount === 0 || state.waitingForTurn) {
        state.revealedTurnCount += 1;
        state.waitingForTurn = false;
      }
    } catch (error) {
      if (requestId !== state.conversationRequestId) {
        return;
      }

      state.error = error instanceof Error ? error.message : 'Conversation generation failed.';
      state.waitingForTurn = false;
      break;
    } finally {
      if (requestId !== state.conversationRequestId) {
        return;
      }

      state.isGeneratingTurn = false;
      renderApp();
    }
  }
}

function revealNextTurn(state, renderApp) {
  if (state.revealedTurnCount < state.transcript.length) {
    state.revealedTurnCount += 1;
    renderApp();
    return;
  }

  if (state.transcript.length < TRANSCRIPT_TURN_COUNT && !state.error) {
    state.waitingForTurn = true;
    renderApp();
  }
}

async function openMemoryCandidateScene(state, renderApp, fetchImpl) {
  state.step = 'memory-candidates';
  state.error = '';
  state.memoryError = '';
  closeCharacterPanel(state);
  renderApp();

  if (hasLoadedMemoryCandidates(state) || state.isGeneratingMemories) {
    return;
  }

  const requestId = state.memoryRequestId + 1;
  state.memoryRequestId = requestId;
  state.isGeneratingMemories = true;
  renderApp();

  try {
    const candidatesByCharacter = await requestMemoryCandidates(fetchImpl, state.lastRun, state);
    if (requestId !== state.memoryRequestId) {
      return;
    }

    state.memoryCandidatesByCharacter = Object.fromEntries(
      Object.entries(candidatesByCharacter).map(([characterId, candidates]) => [
        characterId,
        pickVisibleMemoryCandidates(candidates),
      ]),
    );
  } catch (error) {
    if (requestId !== state.memoryRequestId) {
      return;
    }

    state.memoryError = error instanceof Error ? error.message : 'Memory candidate generation failed.';
  } finally {
    if (requestId !== state.memoryRequestId) {
      return;
    }

    state.isGeneratingMemories = false;
    renderApp();
  }
}

function buildRunFromState(state) {
  return {
    selectedCharacterIds: [...state.selectedCharacterIds],
    characters: state.selectedCharacterIds.map((characterId) => ({ ...state.characterProfiles[characterId] })),
    roomId: state.roomId,
    startingSpeakerId: state.startingSpeakerId,
    topic: state.topic,
  };
}

async function requestTurn(fetchImpl, run, transcriptSoFar, turnNumber) {
  const response = await fetchImpl('/api/conversation-turn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...run,
      transcriptSoFar: transcriptSoFar.map(({ speakerId, text }) => ({ speakerId, text })),
      turnNumber,
    }),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || 'Conversation generation failed.');
  }

  return body.turn;
}

async function requestMemoryCandidates(fetchImpl, run, state) {
  const response = await fetchImpl('/api/memory-candidates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...run,
      transcript: state.transcript.map(({ speakerId, text }) => ({ speakerId, text })),
      existingJournalByCharacter: Object.fromEntries(
        run.selectedCharacterIds.map((characterId) => [characterId, state.journalEntriesByCharacter[characterId] ?? []]),
      ),
    }),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || 'Memory candidate generation failed.');
  }

  return body.candidatesByCharacter;
}

function resetMemoryCandidateState(state) {
  state.memoryRequestId += 1;
  state.memoryCandidatesByCharacter = {};
  state.isGeneratingMemories = false;
  state.memoryError = '';
}

function hasLoadedMemoryCandidates(state) {
  return state.selectedCharacterIds.every((characterId) => Array.isArray(state.memoryCandidatesByCharacter[characterId]));
}

function syncTopicFeedback(mountNode, topic, error) {
  const wordCounter = mountNode.querySelector('[data-role="topic-count"]');
  const errorNode = mountNode.querySelector('[data-role="topic-error"]');

  if (wordCounter) {
    wordCounter.textContent = `${countWords(topic)} / 25 words`;
  }

  if (errorNode) {
    errorNode.textContent = error;
    errorNode.hidden = !error;
  }
}

function syncCharacterEditorFeedback(mountNode, draft, error) {
  const wordCounter = mountNode.querySelector('[data-role="personality-count"]');
  const errorNode = mountNode.querySelector('[data-role="character-error"]');

  if (wordCounter && draft) {
    wordCounter.textContent = `${countWords(draft.personality)} / 250 words`;
  }

  if (errorNode) {
    errorNode.textContent = error;
    errorNode.hidden = !error;
  }
}
