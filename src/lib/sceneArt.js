export function getRoomArtPath(roomId) {
  return {
    'couple-bedroom': '/room-scenes/generated/couple-bedroom.png',
    'guest-bedroom': '/room-scenes/generated/guest-bedroom.png',
    'living-room': '/room-scenes/generated/living-room.png',
    'sacrificial-altar': '/room-scenes/generated/sacrificial-altar.png',
  }[roomId] ?? '/room-scenes/generated/living-room.png';
}

export function getCharacterArtPath(characterId) {
  return {
    husband: '/character-portraits/generated/elias.png',
    wife: '/character-portraits/generated/mara.png',
    friend: '/character-portraits/generated/jonah.png',
  }[characterId] ?? '/character-portraits/generated/elias.png';
}
