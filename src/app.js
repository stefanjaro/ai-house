import { characters, getCharacterById, getRoomById, rooms } from './lib/gameData.js';
import { validateTopic, countWords } from './lib/topic.js';
import { TRANSCRIPT_STEP_DELAY_MS } from './lib/transcript.js';

export function createApp(mountNode, options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const wait = options.wait ?? ((duration) => new Promise((resolve) => window.setTimeout(resolve, duration)));

  const state = createInitialState();

  mountNode.addEventListener('click', (event) => handleClick(event, state, renderApp, runConversation));
  mountNode.addEventListener('input', (event) => handleInput(event, state, mountNode));
  mountNode.addEventListener('submit', (event) => handleSubmit(event, state, renderApp, runConversation));

  renderApp();

  return {
    getState: () => structuredClone(state),
  };

  function renderApp() {
    mountNode.innerHTML = renderLayout(state);
    syncTopicFeedback(mountNode, state.topic, state.error);
  }

  async function runConversation() {
    const topicCheck = validateTopic(state.topic);
    if (state.selectedCharacterIds.length !== 2) {
      state.error = 'Choose exactly two characters.';
      renderApp();
      return;
    }

    if (!topicCheck.ok) {
      state.error = topicCheck.error;
      renderApp();
      return;
    }

    state.isRequesting = true;
    state.isPlaying = false;
    state.error = '';
    state.transcript = [];
    state.pendingTurn = null;
    renderApp();

    try {
      const transcript = await requestTranscript(fetchImpl, state, topicCheck.normalizedTopic);
      state.lastRun = buildLastRun(state, topicCheck.normalizedTopic);
      await playTranscript(state, transcript, renderApp, wait);
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Conversation generation failed.';
    } finally {
      state.isRequesting = false;
      state.pendingTurn = null;
      renderApp();
    }
  }
}

function createInitialState() {
  return {
    selectedCharacterIds: ['husband', 'wife'],
    roomId: 'living-room',
    startingSpeakerId: 'husband',
    topic: '',
    transcript: [],
    pendingTurn: null,
    isRequesting: false,
    isPlaying: false,
    error: '',
    lastRun: null,
  };
}

function handleClick(event, state, renderApp, runConversation) {
  const actionTarget = event.target.closest('[data-action]');
  if (!actionTarget) {
    return;
  }

  const { action, value } = actionTarget.dataset;

  if (action === 'toggle-character') {
    toggleCharacter(state, value);
    renderApp();
    return;
  }

  if (action === 'pick-room') {
    state.roomId = value;
    renderApp();
    return;
  }

  if (action === 'pick-speaker') {
    if (state.selectedCharacterIds.includes(value)) {
      state.startingSpeakerId = value;
      renderApp();
    }
    return;
  }

  if (action === 'replay-duel' && !state.isRequesting && !state.isPlaying) {
    runConversation();
    return;
  }

  if (action === 'clear-transcript' && !state.isRequesting && !state.isPlaying) {
    state.transcript = [];
    state.pendingTurn = null;
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

function handleSubmit(event, state, renderApp, runConversation) {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== 'setup-form') {
    return;
  }

  event.preventDefault();
  if (state.isRequesting || state.isPlaying) {
    return;
  }

  renderApp();
  runConversation();
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

async function requestTranscript(fetchImpl, state, normalizedTopic) {
  const response = await fetchImpl('/api/conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      selectedCharacterIds: state.selectedCharacterIds,
      roomId: state.roomId,
      startingSpeakerId: state.startingSpeakerId,
      topic: normalizedTopic,
    }),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || 'Conversation generation failed.');
  }

  return body.transcript;
}

function buildLastRun(state, topic) {
  return {
    selectedCharacterIds: [...state.selectedCharacterIds],
    roomId: state.roomId,
    startingSpeakerId: state.startingSpeakerId,
    topic,
  };
}

async function playTranscript(state, transcript, renderApp, wait) {
  state.transcript = [];
  state.pendingTurn = null;
  state.isPlaying = true;
  renderApp();

  for (const [index, turn] of transcript.entries()) {
    if (index > 0) {
      state.pendingTurn = {
        number: index + 1,
        speakerId: turn.speakerId,
      };
      renderApp();
      await wait(TRANSCRIPT_STEP_DELAY_MS);
    }

    state.pendingTurn = null;
    state.transcript = [...state.transcript, { ...turn, number: index + 1 }];
    renderApp();
  }

  state.isPlaying = false;
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

function renderLayout(state) {
  return `
    <div class="shell">
      <header class="masthead">
        <div>
          <p class="kicker">AI House</p>
          <h1>Stage the apartment duel.</h1>
          <p class="lede">Pick the pair, set the room, decide who speaks first, then watch the tension build turn by turn.</p>
        </div>
        <div class="status-card">
          <p class="status-label">Phase 1</p>
          <p class="status-value">Playable duel slice</p>
          <p class="status-detail">Built for fast local playtesting with live OpenCode Zen conversations.</p>
        </div>
      </header>
      <main class="arena-layout">
        <form class="command-panel" id="setup-form">
          ${renderSection('Choose Two Characters', 'Only two can enter the room.', characters.map((character) => renderCharacterButton(state, character)).join(''))}
          ${renderSection('Pick The Room', 'Rooms set the pressure before room mechanics deepen in later phases.', rooms.map((room) => renderRoomButton(state, room)).join(''))}
          ${renderSection('Choose The Opening Voice', 'The first line defines the tone of the duel.', characters.filter((character) => state.selectedCharacterIds.includes(character.id)).map((character) => renderSpeakerButton(state, character)).join(''))}
          <section class="form-section topic-section">
            <div class="section-copy">
              <h2>Set The Topic</h2>
              <p>Keep it concise so the exchange has room to turn.</p>
            </div>
            <label class="topic-field" for="topic">
              <span class="topic-label">Conversation topic</span>
              <textarea id="topic" name="topic" rows="4" maxlength="200" placeholder="Whether Jonah has overstayed his welcome">${escapeHtml(state.topic)}</textarea>
              <div class="topic-meta">
                <small data-role="topic-count">${countWords(state.topic)} / 25 words</small>
                <p class="error" data-role="topic-error" ${state.error ? '' : 'hidden'}>${escapeHtml(state.error)}</p>
              </div>
            </label>
          </section>
          <div class="form-actions">
            <button class="primary-action" type="submit" ${state.isRequesting || state.isPlaying ? 'disabled' : ''}>
              ${state.isRequesting ? 'Summoning duel...' : state.isPlaying ? 'Duel in progress...' : 'Start conversation'}
            </button>
            <p class="action-note">Ten turns, numbered, paced for readability.</p>
          </div>
        </form>
        <section class="duel-panel" aria-live="polite">
          <div class="duel-header">
            <div>
              <p class="kicker">Live Transcript</p>
              <h2>${escapeHtml(currentCharacterLabel(state))}</h2>
              <p class="duel-topic">${escapeHtml(currentRoom(state).name)} • ${escapeHtml(currentTopicLabel(state))}</p>
            </div>
            <div class="duel-actions">
              <button type="button" class="secondary-action" data-action="replay-duel" ${!state.lastRun || state.isRequesting || state.isPlaying ? 'disabled' : ''}>Replay duel</button>
              <button type="button" class="ghost-action" data-action="clear-transcript" ${(!state.transcript.length && !state.pendingTurn) || state.isRequesting || state.isPlaying ? 'disabled' : ''}>Clear log</button>
            </div>
          </div>
          <div class="duel-stage">
            <div class="versus-strip">
              ${state.selectedCharacterIds.map((characterId) => renderFighter(state, characterId)).join('')}
            </div>
            <ol class="transcript">
              ${renderTranscript(state)}
            </ol>
          </div>
        </section>
      </main>
    </div>
  `;
}

function renderSection(title, description, content) {
  return `
    <section class="form-section">
      <div class="section-copy">
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
      <div class="option-grid">
        ${content}
      </div>
    </section>
  `;
}

function renderCharacterButton(state, character) {
  const isSelected = state.selectedCharacterIds.includes(character.id);
  return renderOptionButton({
    action: 'toggle-character',
    value: character.id,
    title: character.name,
    subtitle: character.role,
    detail: truncatePersonality(character.personality),
    selected: isSelected,
  });
}

function renderRoomButton(state, room) {
  return renderOptionButton({
    action: 'pick-room',
    value: room.id,
    title: room.name,
    subtitle: room.mood,
    detail: room.promptNote,
    selected: state.roomId === room.id,
  });
}

function renderSpeakerButton(state, character) {
  return renderOptionButton({
    action: 'pick-speaker',
    value: character.id,
    title: character.name,
    subtitle: state.startingSpeakerId === character.id ? 'Current opener' : 'Set as opener',
    detail: character.id === state.startingSpeakerId ? 'This voice launches the exchange.' : 'Use this character for turn one.',
    selected: state.startingSpeakerId === character.id,
  });
}

function renderOptionButton({ action, value, title, subtitle, detail, selected }) {
  return `
    <button
      type="button"
      class="option-tile ${selected ? 'is-selected' : ''}"
      data-action="${action}"
      data-value="${value}"
      aria-pressed="${selected}"
    >
      <span class="tile-title">${escapeHtml(title)}</span>
      <span class="tile-subtitle">${escapeHtml(subtitle)}</span>
      <span class="tile-detail">${escapeHtml(detail)}</span>
    </button>
  `;
}

function renderFighter(state, characterId) {
  const character = getCharacterById(characterId);
  const isOpening = state.startingSpeakerId === characterId;

  return `
    <div class="fighter ${isOpening ? 'fighter-opening' : ''}">
      <span class="fighter-name">${escapeHtml(character.name)}</span>
      <span class="fighter-role">${escapeHtml(character.role)}</span>
      <span class="fighter-badge">${isOpening ? 'Opens the duel' : 'Answers next'}</span>
    </div>
  `;
}

function renderTranscript(state) {
  if (!state.transcript.length && !state.pendingTurn && !state.isRequesting) {
    return '<li class="empty-state">The room is waiting. Start a conversation to fill the log.</li>';
  }

  const turnsMarkup = state.transcript.map((turn) => renderTurn(turn)).join('');
  const loaderMarkup = state.pendingTurn ? renderPendingTurn(state.pendingTurn) : '';
  const requestMarkup = state.isRequesting && !state.transcript.length ? '<li class="loader-turn boot-loader"><span class="loader-copy">Contacting OpenCode Zen…</span></li>' : '';

  return `${turnsMarkup}${loaderMarkup}${requestMarkup}`;
}

function renderTurn(turn) {
  const speaker = getCharacterById(turn.speakerId);

  return `
    <li class="turn">
      <div class="turn-index">${String(turn.number).padStart(2, '0')}</div>
      <div class="turn-body">
        <div class="turn-header">
          <p class="speaker">${escapeHtml(speaker?.name || turn.speakerId)}</p>
          <p class="speaker-role">${escapeHtml(speaker?.role || 'Unknown')}</p>
        </div>
        <p class="bubble">${escapeHtml(turn.text)}</p>
      </div>
    </li>
  `;
}

function renderPendingTurn(pendingTurn) {
  const speaker = getCharacterById(pendingTurn.speakerId);

  return `
    <li class="loader-turn">
      <div class="turn-index">${String(pendingTurn.number).padStart(2, '0')}</div>
      <div class="loader-body">
        <p class="loader-speaker">${escapeHtml(speaker?.name || pendingTurn.speakerId)} is thinking</p>
        <div class="thinking-dots" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </li>
  `;
}

function currentCharacterLabel(state) {
  return state.selectedCharacterIds
    .map((characterId) => getCharacterById(characterId)?.name)
    .filter(Boolean)
    .join(' vs ');
}

function currentRoom(state) {
  return getRoomById(state.roomId) ?? rooms[0];
}

function currentTopicLabel(state) {
  if (state.topic.trim()) {
    return state.topic.trim();
  }

  return 'Topic not set yet';
}

function truncatePersonality(personality) {
  return `${personality.split('. ')[0]}.`;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
