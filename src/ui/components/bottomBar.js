import { fileService } from '../../services/fileService.js';
import { CHARACTERS, UI_TEXTURES } from '../assets.js';

function createModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'character-modal';

  const box = document.createElement('div');
  box.className = 'modal-box';
  box.style.setProperty('--modal-parchment', `url('${UI_TEXTURES.parchment}')`);
  box.style.setProperty('--modal-border', `url('${UI_TEXTURES.border}')`);

  const header = document.createElement('div');
  header.className = 'modal-header';

  const title = document.createElement('div');
  title.className = 'modal-title';
  title.id = 'modal-title';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.addEventListener('click', () => overlay.classList.remove('open'));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  header.appendChild(title);
  header.appendChild(closeBtn);

  const body = document.createElement('div');
  body.className = 'modal-body';
  body.id = 'modal-body';

  box.appendChild(header);
  box.appendChild(body);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  return overlay;
}

function openModal(titleText, bodyText) {
  const overlay = document.getElementById('character-modal');
  document.getElementById('modal-title').textContent = titleText;
  // Preserve line breaks from markdown memory/personality files
  document.getElementById('modal-body').style.whiteSpace = 'pre-wrap';
  document.getElementById('modal-body').textContent = bodyText;
  overlay.classList.add('open');
}

export function createBottomBar() {
  const bar = document.createElement('div');
  bar.id = 'bottom-bar';

  createModal();

  CHARACTERS.forEach(({ key, label, sprite }) => {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.dataset.character = key;

    const img = document.createElement('img');
    img.className = 'card-sprite';
    img.src = sprite;
    img.alt = label;

    const nameEl = document.createElement('div');
    nameEl.className = 'card-name';
    // Will be updated by updateCardName() once game starts
    nameEl.textContent = label;

    const buttons = document.createElement('div');
    buttons.className = 'card-buttons';

    const personalityBtn = document.createElement('button');
    personalityBtn.className = 'card-btn';
    personalityBtn.textContent = 'Personality';
    personalityBtn.addEventListener('click', async () => {
      const displayName = nameEl.textContent;
      try {
        const content = await fileService.getPersonality(key);
        openModal(`${displayName} — Personality`, content);
      } catch {
        openModal(`${displayName} — Personality`, '(Could not load personality.)');
      }
    });

    const memoryBtn = document.createElement('button');
    memoryBtn.className = 'card-btn';
    memoryBtn.textContent = 'Memory';
    memoryBtn.addEventListener('click', async () => {
      const displayName = nameEl.textContent;
      try {
        const content = await fileService.getMemory(key);
        openModal(`${displayName} — Memory`, content || '(No memories yet.)');
      } catch {
        openModal(`${displayName} — Memory`, '(Could not load memory.)');
      }
    });

    buttons.appendChild(personalityBtn);
    buttons.appendChild(memoryBtn);

    card.appendChild(img);
    card.appendChild(nameEl);
    card.appendChild(buttons);
    bar.appendChild(card);
  });

  return bar;
}

/**
 * Updates the display name on a character card.
 * Call this after character creation so the bottom bar shows custom names.
 */
export function updateCardName(characterKey, displayName) {
  const card = document.querySelector(`.character-card[data-character="${characterKey}"]`);
  if (card) {
    const nameEl = card.querySelector('.card-name');
    if (nameEl) nameEl.textContent = displayName;
  }
}
