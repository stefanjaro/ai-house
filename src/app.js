import { renderLayout } from './lib/renderLayout.js';
import { countWords, validateTopic } from './lib/topic.js';
import { TRANSCRIPT_TURN_COUNT } from './lib/transcript.js';

const SETUP_STEPS = ['characters', 'room', 'speaker', 'topic', 'confirm'];

export function createApp(mountNode, options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const state = createInitialState();

  mountNode.addEventListener('click', (event) => handleClick(event, state, renderApp, fetchImpl));
  mountNode.addEventListener('input', (event) => handleInput(event, state, mountNode));

  renderApp();

  return {
    getState: () => structuredClone(state),
  };

  function renderApp() {
    mountNode.innerHTML = renderLayout(state);
    syncTopicFeedback(mountNode, state.topic, state.error);
  }
}

function createInitialState() {
  return {
    step: 'characters',
    selectedCharacterIds: ['husband', 'wife'],
    roomId: 'living-room',
    startingSpeakerId: 'husband',
    topic: '',
    transcript: [],
    revealedTurnCount: 0,
    isGeneratingTurn: false,
    waitingForTurn: false,
    error: '',
    lastRun: null,
    conversationRequestId: 0,
  };
}

function handleClick(event, state, renderApp, fetchImpl) {
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

  if (action === 'return-to-confirmation' && !state.isGeneratingTurn) {
    state.step = 'confirm';
    state.error = '';
    renderApp();
  }
}

function handleInput(event, state, mountNode) {
  if (event.target.id !== 'topic') {
    return;
  }

  state.topic = event.target.value;
  const topicCheck = validateTopic(state.topic);
  state.error = topicCheck.ok || !state.topic.trim() ? '' : topicCheck.error;
  syncTopicFeedback(mountNode, state.topic, state.error);
}

function advanceStep(state, renderApp) {
  const error = validateCurrentStep(state);
  if (error) {
    state.error = error;
    renderApp();
    return;
  }

  state.error = '';
  const currentIndex = SETUP_STEPS.indexOf(state.step);
  state.step = SETUP_STEPS[Math.min(currentIndex + 1, SETUP_STEPS.length - 1)];
  renderApp();
}

function retreatStep(state) {
  state.error = '';
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
    if (state.selectedCharacterIds.length === 2) {
      state.selectedCharacterIds = [state.selectedCharacterIds[1], characterId];
    } else {
      state.selectedCharacterIds = [...state.selectedCharacterIds, characterId];
    }
  }

  if (!state.selectedCharacterIds.includes(state.startingSpeakerId)) {
    state.startingSpeakerId = state.selectedCharacterIds[0];
  }
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
  state.error = '';
  state.lastRun = run;
  state.topic = run.topic;
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

function buildRunFromState(state) {
  return {
    selectedCharacterIds: [...state.selectedCharacterIds],
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
