export function createCenterScreen() {
  const section = document.createElement('div');
  section.id = 'center-screen';

  const bg = document.createElement('img');
  bg.className = 'room-background';
  bg.src = '/assets/rooms/living-room.png';
  bg.alt = 'Room';

  const spritesLayer = document.createElement('div');
  spritesLayer.className = 'sprites-layer';

  const characters = [
    { src: '/assets/sprites/husband.png', alt: 'Husband' },
    { src: '/assets/sprites/wife.png', alt: 'Wife' },
    { src: '/assets/sprites/poltergeist.png', alt: 'Poltergeist' },
  ];

  characters.forEach(({ src, alt }) => {
    const img = document.createElement('img');
    img.className = 'character-sprite';
    img.src = src;
    img.alt = alt;
    spritesLayer.appendChild(img);
  });

  const overlay = document.createElement('div');
  overlay.className = 'conversation-overlay';

  section.appendChild(bg);
  section.appendChild(spritesLayer);
  section.appendChild(overlay);

  return section;
}
