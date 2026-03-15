/**
 * Character creation screen.
 *
 * @param {object} options
 * @param {object} options.config       - Config object from fileService.getConfig()
 * @param {object} options.personalities - { husband, wife, poltergeist } personality strings
 * @param {function} options.onBegin    - Called with { husband, wife, poltergeist } names on submit
 * @param {function} options.setPersonality - fileService.setPersonality(character, content)
 */
export function createCharacterCreationScreen({ config, personalities, onBegin, setPersonality }) {
  const screen = document.createElement('div');
  screen.id = 'character-creation-screen';
  screen.className = 'screen';

  const title = document.createElement('h2');
  title.className = 'creation-title';
  title.textContent = 'Meet Your Household';
  screen.appendChild(title);

  const cardsRow = document.createElement('div');
  cardsRow.className = 'creation-cards';
  screen.appendChild(cardsRow);

  const characters = ['husband', 'wife', 'poltergeist'];
  const nameInputs = {};
  const personalityAreas = {};

  for (const char of characters) {
    const card = document.createElement('div');
    card.className = 'creation-card';

    // Left column: sprite + name + model
    const left = document.createElement('div');
    left.className = 'creation-card-left';

    const sprite = document.createElement('img');
    sprite.className = 'creation-sprite';
    sprite.src = `/assets/sprites/${char}.png`;
    sprite.alt = char;
    left.appendChild(sprite);

    const nameLabel = document.createElement('label');
    nameLabel.className = 'creation-label';
    nameLabel.textContent = char.charAt(0).toUpperCase() + char.slice(1);
    left.appendChild(nameLabel);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'creation-name-input';
    nameInput.setAttribute('data-name', char);
    nameInput.value = config[char].name;
    nameInput.addEventListener('input', updateBeginState);
    nameInputs[char] = nameInput;
    left.appendChild(nameInput);

    const modelLabel = document.createElement('p');
    modelLabel.className = 'creation-model';
    modelLabel.textContent = config[char].model;
    left.appendChild(modelLabel);

    card.appendChild(left);

    // Right column: personality
    const right = document.createElement('div');
    right.className = 'creation-card-right';

    const personalityLabel = document.createElement('p');
    personalityLabel.className = 'creation-personality-label';
    personalityLabel.textContent = 'Personality';
    right.appendChild(personalityLabel);

    const personalityArea = document.createElement('textarea');
    personalityArea.className = 'creation-personality';
    personalityArea.setAttribute('data-personality', char);
    personalityArea.value = personalities[char] || '';
    if (char === 'poltergeist') {
      personalityArea.readOnly = true;
    }
    personalityAreas[char] = personalityArea;
    right.appendChild(personalityArea);

    card.appendChild(right);
    cardsRow.appendChild(card);
  }

  const beginBtn = document.createElement('button');
  beginBtn.className = 'begin-btn';
  beginBtn.textContent = 'Begin';
  screen.appendChild(beginBtn);

  function updateBeginState() {
    const allFilled = characters.every(c => nameInputs[c].value.trim() !== '');
    beginBtn.disabled = !allFilled;
  }

  updateBeginState();

  beginBtn.addEventListener('click', async () => {
    const names = {};
    for (const char of characters) {
      names[char] = nameInputs[char].value.trim();
    }

    await Promise.all([
      setPersonality('husband', personalityAreas.husband.value),
      setPersonality('wife', personalityAreas.wife.value),
    ]);

    onBegin(names);
  });

  return screen;
}
