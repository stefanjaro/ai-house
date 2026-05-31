import { characters, getCharacterById, getRoomById, rooms } from './gameData.js';
import { getCharacterArtPath, getRoomArtPath } from './sceneArt.js';
import { countWords } from './topic.js';

const SETUP_STEPS = ['characters', 'room', 'speaker', 'topic', 'confirm'];

export function renderLayout(state) {
  const room = currentRoom(state);
  const shellClass = state.step === 'conversation' ? 'is-conversation' : `is-step-${state.step}`;
  return `
    <div class="app-shell room-${room.id} ${shellClass}">
      <div class="backdrop-canopy" aria-hidden="true">
        <span class="canopy canopy-one"></span>
        <span class="canopy canopy-two"></span>
        <span class="canopy canopy-three"></span>
      </div>
      <main class="scene-frame">
        ${state.step === 'conversation' ? renderConversationScene(state, room) : renderSetupScene(state, room)}
      </main>
    </div>
  `;
}

function renderSetupScene(state, room) {
  const stepConfig = getStepConfig(state);
  return `
    <section class="scene scene-setup">
      ${renderTopBar(state, room, false)}
      <article class="choice-stage">
        <div class="stage-heading">
          <p class="stage-label">${escapeHtml(stepConfig.label)}</p>
          <h2>${escapeHtml(stepConfig.title)}</h2>
          <p>${escapeHtml(stepConfig.description)}</p>
        </div>
        <div class="step-content">${stepConfig.content}</div>
        <div class="stage-actions">
          ${state.step !== 'characters' ? '<button type="button" class="secondary-action" data-action="back-step">Back</button>' : '<span class="action-spacer"></span>'}
          ${state.step === 'confirm'
            ? '<button type="button" class="primary-action" data-action="start-conversation">Generate conversation</button>'
            : `<button type="button" class="primary-action" data-action="next-step">${escapeHtml(stepConfig.nextLabel)}</button>`}
        </div>
        <p class="error" data-role="topic-error" ${state.error ? '' : 'hidden'}>${escapeHtml(state.error)}</p>
      </article>
    </section>
  `;
}
function renderConversationScene(state, room) {
  return `
    <section class="scene scene-conversation">
      ${renderTopBar(state, room, true)}
      <article class="conversation-stage">
        <div class="conversation-stage__header">
          <div>
            <p class="scene-kicker">Conversation Loaded</p>
            <h1>${escapeHtml(currentCharacterLabel(state))}</h1>
            <p class="scene-copy">${escapeHtml(room.name)} · ${escapeHtml(currentTopicLabel(state))}</p>
          </div>
          <div class="conversation-actions">
            <button type="button" class="secondary-action" data-action="return-to-confirmation" ${state.isGeneratingTurn ? 'disabled' : ''}>Edit setup</button>
            <button type="button" class="primary-action" data-action="replay-duel" ${!state.lastRun || state.isGeneratingTurn ? 'disabled' : ''}>Regenerate</button>
          </div>
        </div>
        <div class="versus-strip">${state.selectedCharacterIds.map((characterId) => renderFighter(state, characterId)).join('')}</div>
        <div class="transcript-shell">
          <ol class="transcript">${renderTranscript(state)}</ol>
        </div>
        ${renderRevealPanel(state)}
      </article>
    </section>
  `;
}

function renderTopBar(state, room, isConversation) {
  const metaLabel = isConversation || state.step === 'confirm' ? room.name : 'Setup In Progress';

  return `
    <header class="top-bar">
      <div class="brand-mark">
        <span class="brand-mark__crest" aria-hidden="true">${renderGlyph('leaf')}</span>
        <div>
          <p class="brand-mark__name">AI House</p>
          <p class="brand-mark__detail">${isConversation ? 'Forest Clearing Conversation' : 'Cabin Table Setup'}</p>
        </div>
      </div>
      <div class="top-bar__meta">
        <p>${escapeHtml(metaLabel)}</p>
        <ol class="progress-strip">
          ${SETUP_STEPS.map((step, index) => {
            const status = state.step === 'conversation'
              ? 'is-complete'
              : index < SETUP_STEPS.indexOf(state.step)
                ? 'is-complete'
                : step === state.step
                  ? 'is-current'
                  : '';

            return `<li class="progress-step ${status}"><span>${escapeHtml(progressLabel(step))}</span></li>`;
          }).join('')}
        </ol>
      </div>
    </header>
  `;
}

function getStepConfig(state) {
  if (state.step === 'characters') {
    return {
      label: 'Step 1 of 5',
      title: 'Choose the pair',
      description: 'Pick the two people who will carry the room. The selected pair stays on the table while everything else shifts around them.',
      nextLabel: 'Choose room',
      content: `<div class="card-grid card-grid-characters">${characters.map((character) => renderCharacterCard(state, character)).join('')}</div>`,
    };
  }

  if (state.step === 'room') {
    return {
      label: 'Step 2 of 5',
      title: 'Pick the room',
      description: 'Each room becomes a vignette. You are choosing the emotional air before anyone speaks.',
      nextLabel: 'Choose opener',
      content: `<div class="card-grid">${rooms.map((room) => renderRoomCard(state, room)).join('')}</div>`,
    };
  }

  if (state.step === 'speaker') {
    return {
      label: 'Step 3 of 5',
      title: 'Choose the opening voice',
      description: 'The first voice pushes the scene into motion. Pick the one that should strike the first note.',
      nextLabel: 'Write topic',
      content: `<div class="card-grid">${characters.filter((character) => state.selectedCharacterIds.includes(character.id)).map((character) => renderSpeakerCard(state, character)).join('')}</div>`,
    };
  }

  if (state.step === 'topic') {
    return {
      label: 'Step 4 of 5',
      title: 'Name the pressure point',
      description: 'Keep it tight. The game should have room to turn, not just restate the prompt.',
      nextLabel: 'Review setup',
      content: renderTopicField(state),
    };
  }

  return {
    label: 'Step 5 of 5',
    title: 'Confirm the setup',
    description: 'Check the scene, the pairing, and the pressure point before starting.',
    nextLabel: 'Generate conversation',
    content: renderConfirmation(state),
  };
}

function renderCharacterCard(state, character) {
  return renderOptionCard({
    action: 'toggle-character',
    value: character.id,
    selected: state.selectedCharacterIds.includes(character.id),
    title: character.name,
    subtitle: character.role,
    detail: truncatePersonality(character.personality),
    badge: state.selectedCharacterIds.includes(character.id) ? 'Selected' : 'Available',
    media: renderPortraitMedia(character.id, character.name),
  });
}

function renderRoomCard(state, room) {
  return renderOptionCard({
    action: 'pick-room',
    value: room.id,
    selected: state.roomId === room.id,
    title: room.name,
    subtitle: room.mood,
    detail: room.promptNote,
    badge: state.roomId === room.id ? 'Chosen room' : 'Room card',
    icon: renderGlyph('room'),
    media: `<img class="card-scene" src="${escapeHtml(getRoomArtPath(room.id))}" alt="${escapeHtml(room.name)} scene artwork" loading="lazy" />`,
  });
}

function renderSpeakerCard(state, character) {
  const isSelected = state.startingSpeakerId === character.id;
  return renderOptionCard({
    action: 'pick-speaker',
    value: character.id,
    selected: isSelected,
    title: character.name,
    subtitle: isSelected ? 'Current opener' : 'Can open the scene',
    detail: isSelected ? 'This character delivers the first line.' : 'Pick this voice to begin the exchange.',
    badge: isSelected ? 'Opening speaker' : 'Speaker option',
    media: renderPortraitMedia(character.id, character.name),
  });
}

function renderOptionCard({ action, value, selected, title, subtitle, detail, badge, icon, media = '' }) {
  return `
    <button type="button" class="option-card ${selected ? 'is-selected' : ''}" data-action="${action}" data-value="${value}" aria-pressed="${selected}">
      <span class="card-badge">${escapeHtml(badge)}</span>
      ${media || `<span class="card-icon" aria-hidden="true">${icon}</span>`}
      <span class="card-title">${escapeHtml(title)}</span>
      <span class="card-subtitle">${escapeHtml(subtitle)}</span>
      <span class="card-detail">${escapeHtml(detail)}</span>
    </button>
  `;
}

function renderPortraitMedia(characterId, characterName) {
  return `<img class="card-portrait" src="${escapeHtml(getCharacterArtPath(characterId))}" alt="${escapeHtml(characterName)} portrait" loading="lazy" />`;
}

function renderTopicField(state) {
  return `
    <label class="topic-field" for="topic">
      <span class="topic-label">Conversation topic</span>
      <textarea id="topic" name="topic" rows="5" maxlength="200" placeholder="Should Jonah leave by Thursday?">${escapeHtml(state.topic)}</textarea>
      <div class="topic-meta">
        <small data-role="topic-count">${countWords(state.topic)} / 25 words</small>
      </div>
    </label>
  `;
}

function renderConfirmation(state) {
  const room = currentRoom(state);
  return `
    <section class="review-stage">
      <article class="review-hero">
        <div class="review-hero__art">
          <img src="${escapeHtml(getRoomArtPath(room.id))}" alt="${escapeHtml(room.name)} scene artwork" loading="eager" />
        </div>
        <div class="review-hero__copy">
          <p class="review-label">Ready Scene</p>
          <h3 data-role="confirmation-room">${escapeHtml(room.name)}</h3>
          <p class="review-copy">${escapeHtml(room.promptNote)}</p>
          <div class="review-cast" data-role="confirmation-cast">${state.selectedCharacterIds.map((characterId) => renderReviewPortrait(characterId)).join('')}</div>
          <div class="review-pill-row">
            <span class="review-pill" data-role="confirmation-characters">${escapeHtml(currentCharacterLabel(state))}</span>
            <span class="review-pill" data-role="confirmation-speaker">Opener: ${escapeHtml(openingCharacterName(state))}</span>
          </div>
        </div>
      </article>
      <article class="review-topic-card">
        <p class="summary-label">Topic</p>
        <p class="review-topic-value" data-role="confirmation-topic">${escapeHtml(state.topic.trim() || 'No topic set')}</p>
      </article>
    </section>
  `;
}

function renderFighter(state, characterId) {
  const character = getCharacterById(characterId);
  const isOpening = state.startingSpeakerId === characterId;

  return `
    <div class="fighter ${isOpening ? 'fighter-opening' : ''}">
      <img class="fighter-avatar" src="${escapeHtml(getCharacterArtPath(characterId))}" alt="${escapeHtml(character?.name || characterId)} portrait" loading="lazy" />
      <span class="fighter-name">${escapeHtml(character?.name || characterId)}</span>
      <span class="fighter-role">${escapeHtml(character?.role || 'Unknown')}</span>
      <span class="fighter-badge">${isOpening ? 'Opens' : 'Responds'}</span>
    </div>
  `;
}

function renderTranscript(state) {
  if (!state.transcript.length && !state.isGeneratingTurn) {
    return '<li class="empty-state">Start a conversation to begin the scene.</li>';
  }

  return state.transcript
    .slice(0, state.revealedTurnCount)
    .map((turn) => renderTurn(turn))
    .join('');
}

function renderTurn(turn) {
  const speaker = getCharacterById(turn.speakerId);

  return `
    <li class="turn">
      <div class="turn-index">${String(turn.number).padStart(2, '0')}</div>
      <div class="turn-body">
        <div class="turn-header">
          <img class="turn-avatar" src="${escapeHtml(getCharacterArtPath(turn.speakerId))}" alt="${escapeHtml(speaker?.name || turn.speakerId)} portrait" loading="lazy" />
          <p class="speaker">${escapeHtml(speaker?.name || turn.speakerId)}</p>
          <p class="speaker-role">${escapeHtml(speaker?.role || 'Unknown')}</p>
        </div>
        <p class="bubble">${escapeHtml(turn.text)}</p>
      </div>
    </li>
  `;
}

function renderReviewPortrait(characterId) {
  const character = getCharacterById(characterId);
  return `
    <figure class="review-portrait">
      <img src="${escapeHtml(getCharacterArtPath(characterId))}" alt="${escapeHtml(character?.name || characterId)} portrait" loading="lazy" />
      <figcaption>${escapeHtml(character?.name || characterId)}</figcaption>
    </figure>
  `;
}

function renderRevealPanel(state) {
  if (!state.transcript.length && state.isGeneratingTurn) {
    return '<div class="reveal-panel is-loading"><p data-role="reveal-copy">Loading opening line…</p></div>';
  }

  if (!state.transcript.length) {
    return '<div class="reveal-panel"><p data-role="reveal-copy">No conversation loaded yet.</p></div>';
  }

  if (state.waitingForTurn) {
    return '<div class="reveal-panel is-loading"><p data-role="reveal-copy">Loading…</p></div>';
  }

  if (state.error) {
    return `<div class="reveal-panel is-loading"><p data-role="reveal-copy">${escapeHtml(state.error)}</p></div>`;
  }

  if (state.revealedTurnCount >= 10 && state.transcript.length >= 10) {
    return '<div class="reveal-panel"><p data-role="reveal-copy">Conversation complete. Use regenerate if you want a new version.</p></div>';
  }

  return `
    <button type="button" class="reveal-panel reveal-button" data-action="reveal-next-turn">
      <span class="reveal-label">Tap or click to continue</span>
      <span data-role="reveal-copy">Next turn</span>
    </button>
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
  return state.topic.trim() || 'Topic not set yet';
}

function progressLabel(step) {
  return {
    characters: 'Pair',
    room: 'Room',
    speaker: 'Opener',
    topic: 'Topic',
    confirm: 'Review',
  }[step];
}

function openingCharacterName(state) {
  return getCharacterById(state.startingSpeakerId)?.name || state.startingSpeakerId;
}

function truncatePersonality(personality) {
  return `${personality.split('. ')[0]}.`;
}

function renderGlyph(type) {
  if (type === 'room') {
    return '<svg viewBox="0 0 64 64" focusable="false"><path d="M10 49h44v5H10zM16 46V24l16-10 16 10v22h-6V28H22v18z"/><path d="M27 34h10v12H27z"/></svg>';
  }

  if (type === 'spark') {
    return '<svg viewBox="0 0 64 64" focusable="false"><path d="M31 9l4 16 16 4-16 4-4 16-4-16-16-4 16-4z"/><circle cx="47" cy="17" r="5"/><circle cx="18" cy="46" r="4"/></svg>';
  }

  if (type === 'leaf') {
    return '<svg viewBox="0 0 64 64" focusable="false"><path d="M49 15C33 16 19 25 14 40c-2 6 2 11 8 11 17 0 29-16 27-36z"/><path d="M21 43c4-9 13-16 24-20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>';
  }

  return '<svg viewBox="0 0 64 64" focusable="false"><path d="M32 10c9 0 16 7 16 16 0 6-3 11-8 14v6H24v-6c-5-3-8-8-8-14 0-9 7-16 16-16z"/><path d="M22 52h20v4H22z"/></svg>';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
