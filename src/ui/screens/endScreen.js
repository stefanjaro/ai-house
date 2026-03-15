export function createEndScreen() {
  const screen = document.createElement('div');
  screen.id = 'end-screen';
  screen.className = 'screen';

  const title = document.createElement('h1');
  title.className = 'end-title';
  title.textContent = 'The Story Ends';

  screen.appendChild(title);
  return screen;
}
