import { MAX_PERSONALITY_WORDS } from './characterProfiles.js';
import { getCharacterArtPath } from './sceneArt.js';
import { countWords } from './topic.js';

export function renderEditableCharacterCard({ character, selected }) {
  return `
    <article class="character-choice ${selected ? 'is-selected' : ''}">
      ${renderOptionCard({
        action: 'toggle-character',
        value: character.id,
        selected,
        title: character.name,
        subtitle: character.role,
        detail: truncatePersonality(character.personality),
        badge: selected ? 'In the scene' : 'Cast option',
        media: renderPortraitMedia(character.id, character.name),
        embedded: true,
      })}
      <div class="character-choice__actions">
        <button type="button" class="character-mini-action" data-action="open-character-editor" data-value="${character.id}">Edit weirdness</button>
        <button type="button" class="character-mini-action is-quiet" data-action="inspect-character" data-value="${character.id}">Read full vibe</button>
      </div>
    </article>
  `;
}

export function renderSpeakerOption({ character, selected }) {
  return renderOptionCard({
    action: 'pick-speaker',
    value: character.id,
    selected,
    title: character.name,
    subtitle: selected ? 'Starts the mess' : 'Can kick things off',
    detail: selected ? 'This character says the first dumb thing.' : 'Pick this one to begin the scene.',
    badge: selected ? 'First yapper' : 'Speaker option',
    media: renderPortraitMedia(character.id, character.name),
  });
}

export function renderReviewPortrait(character) {
  return `
    <figure class="review-portrait">
      <button type="button" class="portrait-trigger" data-action="inspect-character" data-value="${character.id}" aria-label="Inspect ${escapeHtml(character.name)} personality">
        <img src="${escapeHtml(getCharacterArtPath(character.id))}" alt="${escapeHtml(character.name)} portrait" loading="lazy" />
      </button>
      <figcaption>${escapeHtml(character.name)}</figcaption>
    </figure>
  `;
}

export function renderFighter({ character, isOpening }) {
  return `
    <div class="fighter ${isOpening ? 'fighter-opening' : ''}">
      <button type="button" class="portrait-trigger fighter-portrait-trigger" data-action="inspect-character" data-value="${character.id}" aria-label="Inspect ${escapeHtml(character.name)} personality">
        <img class="fighter-avatar" src="${escapeHtml(getCharacterArtPath(character.id))}" alt="${escapeHtml(character.name)} portrait" loading="lazy" />
      </button>
      <span class="fighter-name">${escapeHtml(character.name)}</span>
      <span class="fighter-role">${escapeHtml(character.role)}</span>
      <span class="fighter-badge">${isOpening ? 'Opens' : 'Responds'}</span>
    </div>
  `;
}

export function renderCharacterPanel({ character, mode, draft, error }) {
  if (!character) {
    return '';
  }

  const personalityText = mode === 'edit' ? draft?.personality ?? character.personality : character.personality;
  const wordCount = countWords(personalityText);

  return `
    <div class="character-panel-backdrop">
      <aside class="character-panel" aria-live="polite">
        <div class="character-panel__header">
          <div>
            <p class="review-label">${mode === 'edit' ? 'Character Weirdness Editor' : 'Character Vibe Reference'}</p>
            <h3 data-role="character-panel-title">${escapeHtml(character.name)}</h3>
            <p class="review-copy">${escapeHtml(character.role)}</p>
          </div>
          <button type="button" class="secondary-action character-panel__close" data-action="close-character-panel">Close</button>
        </div>
        ${
          mode === 'edit'
            ? `
              <label class="character-field" for="character-name">
                <span class="topic-label">Character name</span>
                <input id="character-name" name="character-name" type="text" value="${escapeHtml(draft?.name ?? character.name)}" />
              </label>
              <label class="character-field" for="character-personality">
                <span class="topic-label">Default vibe</span>
                <textarea id="character-personality" name="character-personality" rows="8">${escapeHtml(
                  draft?.personality ?? character.personality,
                )}</textarea>
                <div class="topic-meta">
                  <small data-role="personality-count">${wordCount} / ${MAX_PERSONALITY_WORDS} words</small>
                </div>
              </label>
              <p class="error" data-role="character-error" ${error ? '' : 'hidden'}>${escapeHtml(error)}</p>
              <div class="character-panel__actions">
                <button type="button" class="secondary-action" data-action="close-character-panel">Cancel</button>
                <button type="button" class="primary-action" data-action="save-character">Save character</button>
              </div>
            `
            : `
              <div class="character-panel__body">
                <img class="character-panel__portrait" src="${escapeHtml(getCharacterArtPath(character.id))}" alt="${escapeHtml(character.name)} portrait" loading="lazy" />
                <p>${escapeHtml(character.personality)}</p>
              </div>
            `
        }
      </aside>
    </div>
  `;
}

function renderOptionCard({ action, value, selected, title, subtitle, detail, badge, media = '', embedded = false }) {
  return `
    <button type="button" class="option-card ${selected ? 'is-selected' : ''} ${embedded ? 'option-card--embedded' : ''}" data-action="${action}" data-value="${value}" aria-pressed="${selected}">
      <span class="card-badge">${escapeHtml(badge)}</span>
      ${media}
      <span class="card-title">${escapeHtml(title)}</span>
      <span class="card-subtitle">${escapeHtml(subtitle)}</span>
      <span class="card-detail">${escapeHtml(detail)}</span>
    </button>
  `;
}

function renderPortraitMedia(characterId, characterName) {
  return `<img class="card-portrait" src="${escapeHtml(getCharacterArtPath(characterId))}" alt="${escapeHtml(characterName)} portrait" loading="lazy" />`;
}

function truncatePersonality(personality) {
  return `${personality.split('. ')[0]}.`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
