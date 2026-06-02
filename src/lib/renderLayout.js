import { getCharacterProfile, getSelectedCharacterProfiles } from './characterProfiles.js';
import { rooms, getRoomById } from './gameData.js';
import { getRoomEffect } from './roomEffects.js';
import { renderCharacterPanel, renderEditableCharacterCard, renderFighter, renderReviewPortrait, renderSpeakerOption } from './renderCharacters.js';
import { getCharacterArtPath, getRoomArtPath } from './sceneArt.js';
import { countWords } from './topic.js';

const SETUP_STEPS = ['characters', 'room', 'speaker', 'topic', 'confirm'];

export function renderLayout(state) {
  const room = currentRoom(state);
  const shellClass = ['conversation', 'memory-candidates'].includes(state.step) ? `is-${state.step}` : `is-step-${state.step}`;
  const panelCharacter = state.characterPanel ? getCharacterProfile(state.characterProfiles, state.characterPanel.characterId) : null;

  return `
    <div class="app-shell room-${room.id} ${shellClass}">
      <div class="backdrop-canopy" aria-hidden="true">
        <span class="canopy canopy-one"></span>
        <span class="canopy canopy-two"></span>
        <span class="canopy canopy-three"></span>
      </div>
      <main class="scene-frame">
        ${renderScene(state, room)}
      </main>
      ${renderCharacterPanel({
        character: panelCharacter,
        mode: state.characterPanel?.mode,
        draft: state.characterDraft,
        error: state.characterError,
      })}
      ${renderRoomPanel(room, state.roomPanelOpen)}
    </div>
  `;
}

function renderScene(state, room) {
  if (state.step === 'conversation') {
    return renderConversationScene(state, room);
  }

  if (state.step === 'memory-candidates') {
    return renderMemoryCandidateScene(state, room);
  }

  return renderSetupScene(state, room);
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
  const selectedCharacters = getSelectedCharacterProfiles(state.characterProfiles, state.selectedCharacterIds);
  return `
    <section class="scene scene-conversation">
      ${renderTopBar(state, room, true)}
      <article class="conversation-stage">
        <div class="conversation-stage__header">
          <div>
            <p class="scene-kicker">Conversation Loaded</p>
            <h1>${escapeHtml(currentCharacterLabel(state))}</h1>
            <p class="scene-copy"><button type="button" class="room-link" data-action="inspect-room">${escapeHtml(room.name)}</button> · ${escapeHtml(currentTopicLabel(state))}</p>
          </div>
          <div class="conversation-actions">
            <button type="button" class="secondary-action" data-action="return-to-confirmation" ${state.isGeneratingTurn ? 'disabled' : ''}>Edit setup</button>
            <button type="button" class="primary-action" data-action="replay-duel" ${!state.lastRun || state.isGeneratingTurn ? 'disabled' : ''}>Regenerate</button>
          </div>
        </div>
        <div class="versus-strip">${selectedCharacters
          .map((character) => renderFighter({ character, isOpening: state.startingSpeakerId === character.id }))
          .join('')}</div>
        <div class="transcript-shell">
          <ol class="transcript">${renderTranscript(state)}</ol>
        </div>
        ${renderRevealPanel(state)}
      </article>
    </section>
  `;
}

function renderMemoryCandidateScene(state, room) {
  const selectedCharacters = getSelectedCharacterProfiles(state.characterProfiles, state.selectedCharacterIds);

  return `
    <section class="scene scene-memory-candidates">
      ${renderTopBar(state, room, true)}
      <article class="conversation-stage memory-stage">
        <div class="conversation-stage__header">
          <div>
            <p class="scene-kicker">Post-Conversation Journal Pass</p>
            <h1 data-role="memory-scene-title">Memory candidates</h1>
            <p class="scene-copy">The conversation is over. These are the first journal rewrites each character might carry forward.</p>
          </div>
          <div class="conversation-actions">
            <button type="button" class="secondary-action" data-action="return-to-confirmation" ${state.isGeneratingMemories ? 'disabled' : ''}>Edit setup</button>
            <button type="button" class="primary-action" data-action="replay-duel" ${!state.lastRun || state.isGeneratingMemories ? 'disabled' : ''}>Regenerate</button>
          </div>
        </div>
        <div class="memory-grid">
          ${selectedCharacters.map((character) => renderMemoryCharacterColumn(state, character.id)).join('')}
        </div>
      </article>
    </section>
  `;
}

function renderTopBar(state, room, isConversation) {
  const isResolvedScene = isConversation || state.step === 'confirm' || state.step === 'memory-candidates';
  const metaLabel = isResolvedScene ? room.name : 'Setup In Progress';
  return `
    <header class="top-bar">
      <div class="brand-mark">
        <span class="brand-mark__crest" aria-hidden="true">${renderGlyph('leaf')}</span>
        <div>
        <p class="brand-mark__name">AI House</p>
          <p class="brand-mark__detail">${state.step === 'memory-candidates' ? 'Journal Candidate Review' : isConversation ? 'Forest Clearing Conversation' : 'Cabin Table Setup'}</p>
        </div>
      </div>
      <div class="top-bar__meta">
        <p>${escapeHtml(metaLabel)}</p>
        <ol class="progress-strip">
          ${SETUP_STEPS.map((step, index) => {
            const status = ['conversation', 'memory-candidates'].includes(state.step)
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
      description: 'Pick the two people who will carry the room, then tune any name or personality before the scene begins.',
      nextLabel: 'Choose room',
      content: `<div class="card-grid card-grid-characters">${Object.values(state.characterProfiles)
        .map((character) => renderEditableCharacterCard({
          character,
          selected: state.selectedCharacterIds.includes(character.id),
        }))
        .join('')}</div>`,
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
      content: `<div class="card-grid">${getSelectedCharacterProfiles(state.characterProfiles, state.selectedCharacterIds)
        .map((character) => renderSpeakerOption({ character, selected: state.startingSpeakerId === character.id }))
        .join('')}</div>`,
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

function renderRoomCard(state, room) {
  const roomEffect = getRoomEffect(room.id);
  return `
    <button type="button" class="option-card ${state.roomId === room.id ? 'is-selected' : ''}" data-action="pick-room" data-value="${room.id}" aria-pressed="${state.roomId === room.id}">
      <span class="card-badge">${escapeHtml(state.roomId === room.id ? 'Chosen room' : 'Room card')}</span>
      <img class="card-scene" src="${escapeHtml(getRoomArtPath(room.id))}" alt="${escapeHtml(room.name)} scene artwork" loading="lazy" />
      <span class="card-title">${escapeHtml(room.name)}</span>
      <span class="card-subtitle">${escapeHtml(room.mood)}</span>
      <span class="card-effect">${escapeHtml(roomEffect.label)}</span>
      <span class="card-detail">${escapeHtml(room.promptNote)}</span>
    </button>
  `;
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
  const selectedCharacters = getSelectedCharacterProfiles(state.characterProfiles, state.selectedCharacterIds);
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
          <div class="review-cast" data-role="confirmation-cast">${selectedCharacters.map(renderReviewPortrait).join('')}</div>
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

function renderTranscript(state) {
  if (!state.transcript.length && !state.isGeneratingTurn) {
    return '<li class="empty-state">Start a conversation to begin the scene.</li>';
  }

  return state.transcript.slice(0, state.revealedTurnCount).map((turn) => renderTurn(state, turn)).join('');
}

function renderTurn(state, turn) {
  const speaker = getCharacterProfile(state.characterProfiles, turn.speakerId);
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
    return `
      <button type="button" class="reveal-panel reveal-button" data-action="review-memory-candidates">
        <span class="reveal-label">Conversation complete</span>
        <span data-role="reveal-copy">Review memory candidates</span>
      </button>
    `;
  }
  return `
    <button type="button" class="reveal-panel reveal-button" data-action="reveal-next-turn">
      <span class="reveal-label">Tap or click to continue</span>
      <span data-role="reveal-copy">Next turn</span>
    </button>
  `;
}

function renderRoomPanel(room, isOpen) {
  if (!isOpen) {
    return '';
  }

  const roomEffect = getRoomEffect(room.id);
  return `
    <div class="character-panel-backdrop">
      <aside class="character-panel" aria-live="polite">
        <div class="character-panel__header">
          <div>
            <p class="review-label">Room Reference</p>
            <h3 data-role="room-panel-title">${escapeHtml(room.name)}</h3>
            <p class="review-copy">${escapeHtml(room.mood)}</p>
          </div>
          <button type="button" class="secondary-action character-panel__close" data-action="close-room-panel">Close</button>
        </div>
        <div class="room-panel__body" data-role="room-panel-body">
          <img class="character-panel__portrait" src="${escapeHtml(getRoomArtPath(room.id))}" alt="${escapeHtml(room.name)} scene artwork" loading="lazy" />
          <p><strong>${escapeHtml(roomEffect.label)}</strong></p>
          <p>${escapeHtml(room.promptNote)}</p>
        </div>
      </aside>
    </div>
  `;
}

function currentCharacterLabel(state) {
  return state.selectedCharacterIds.map((characterId) => getCharacterProfile(state.characterProfiles, characterId)?.name).filter(Boolean).join(' vs ');
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
  return getCharacterProfile(state.characterProfiles, state.startingSpeakerId)?.name || state.startingSpeakerId;
}

function renderMemoryCharacterColumn(state, characterId) {
  const character = getCharacterProfile(state.characterProfiles, characterId);
  const candidates = state.memoryCandidatesByCharacter[characterId] ?? [];

  return `
    <section class="memory-column" data-role="memory-character-${characterId}">
      <div class="memory-column__header">
        <img class="memory-column__portrait" src="${escapeHtml(getCharacterArtPath(characterId))}" alt="${escapeHtml(character?.name || characterId)} portrait" loading="lazy" />
        <div>
          <p class="review-label">Memory pass</p>
          <h2>${escapeHtml(character?.name || characterId)}</h2>
          <p class="scene-copy">${escapeHtml(character?.role || '')}</p>
        </div>
      </div>
      ${renderMemoryCandidateList(state, characterId, candidates)}
    </section>
  `;
}

function renderMemoryCandidateList(state, characterId, candidates) {
  if (state.isGeneratingMemories) {
    return '<div class="memory-loading"><p>Generating candidate memories...</p></div>';
  }

  if (state.memoryError) {
    return `<div class="memory-loading"><p>${escapeHtml(state.memoryError)}</p></div>`;
  }

  if (!candidates.length) {
    return `<div class="memory-loading"><p>No candidates were generated for ${escapeHtml(characterId)}.</p></div>`;
  }

  return `
    <ol class="memory-list">
      ${candidates.map((candidate) => renderMemoryCandidate(candidate)).join('')}
    </ol>
  `;
}

function renderMemoryCandidate(candidate) {
  return `
    <li class="memory-card memory-card--${candidate.type.toLowerCase()}">
      <p class="memory-type">${escapeHtml(candidate.type)}</p>
      <p class="memory-text">${escapeHtml(candidate.text)}</p>
      ${candidate.type === 'UPDATE'
        ? `<p class="memory-previous"><strong>Replace:</strong> ${escapeHtml(candidate.previousText)}</p>`
        : '<p class="memory-previous"><strong>New entry.</strong></p>'}
    </li>
  `;
}

function renderGlyph(type) {
  if (type === 'leaf') {
    return '<svg viewBox="0 0 64 64" focusable="false"><path d="M49 15C33 16 19 25 14 40c-2 6 2 11 8 11 17 0 29-16 27-36z"/><path d="M21 43c4-9 13-16 24-20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>';
  }
  return '';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
