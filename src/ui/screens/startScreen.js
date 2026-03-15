export function createStartScreen(onStart) {
  const screen = document.createElement('div');
  screen.id = 'start-screen';
  screen.className = 'screen';

  const title = document.createElement('h1');
  title.className = 'start-title';
  title.textContent = 'AI House';

  const subtitle = document.createElement('p');
  subtitle.className = 'start-subtitle';
  subtitle.textContent = 'A tale of two AIs and something in between';

  const btn = document.createElement('button');
  btn.className = 'start-btn';
  btn.textContent = 'New Game';
  btn.addEventListener('click', onStart);

  screen.appendChild(title);
  screen.appendChild(subtitle);
  screen.appendChild(btn);

  return screen;
}
