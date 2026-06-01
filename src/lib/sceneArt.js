export function getRoomArtPath(roomId) {
  return {
    'couple-bedroom': '/room-scenes/generated/couple-bedroom.jpg',
    'guest-bedroom': '/room-scenes/generated/guest-bedroom.jpg',
    'living-room': '/room-scenes/generated/living-room.jpg',
    'sacrificial-altar': '/room-scenes/generated/sacrificial-altar.jpg',
  }[roomId] ?? '/room-scenes/generated/living-room.jpg';
}

export function getCharacterArtPath(characterId) {
  return {
    husband: '/character-portraits/generated/elias.jpg',
    wife: '/character-portraits/generated/mara.jpg',
    friend: '/character-portraits/generated/jonah.jpg',
  }[characterId] ?? '/character-portraits/generated/elias.jpg';
}
