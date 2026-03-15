const CHARACTERS = [
  { key: 'husband',     name: 'The Husband',    sprite: '/assets/sprites/husband.png' },
  { key: 'wife',        name: 'The Wife',        sprite: '/assets/sprites/wife.png' },
  { key: 'poltergeist', name: 'The Poltergeist', sprite: '/assets/sprites/poltergeist.png' },
];

function createModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'character-modal';

  const box = document.createElement('div');
  box.className = 'modal-box';

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
  document.getElementById('modal-body').textContent = bodyText;
  overlay.classList.add('open');
}

export function createBottomBar() {
  const bar = document.createElement('div');
  bar.id = 'bottom-bar';

  createModal();

  CHARACTERS.forEach(({ key, name, sprite }) => {
    const card = document.createElement('div');
    card.className = 'character-card';

    const img = document.createElement('img');
    img.className = 'card-sprite';
    img.src = sprite;
    img.alt = name;

    const nameEl = document.createElement('div');
    nameEl.className = 'card-name';
    nameEl.textContent = name;

    const buttons = document.createElement('div');
    buttons.className = 'card-buttons';

    const personalityBtn = document.createElement('button');
    personalityBtn.className = 'card-btn';
    personalityBtn.textContent = 'Personality';
    personalityBtn.addEventListener('click', () => {
      openModal(`${name} — Personality`, `[${name} personality will load here]`);
    });

    const memoryBtn = document.createElement('button');
    memoryBtn.className = 'card-btn';
    memoryBtn.textContent = 'Memory';
    memoryBtn.addEventListener('click', () => {
      openModal(`${name} — Memory`, `[${name} memory will load here]`);
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
