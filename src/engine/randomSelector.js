const VALID_ROOMS = ['bedroom', 'kitchen', 'living-room'];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function selectPoltergeistTarget() {
  return pickRandom(['husband', 'wife']);
}

export function selectConversationStarter() {
  return pickRandom(['husband', 'wife']);
}

export function selectConversationRooms(previousDayRooms = null) {
  let available = previousDayRooms
    ? VALID_ROOMS.filter((r) => !previousDayRooms.includes(r))
    : [...VALID_ROOMS];

  // Fall back to all rooms if not enough alternatives remain
  if (available.length < 2) {
    available = [...VALID_ROOMS];
  }

  const [coupleRoom, poltergeistRoom] = shuffle(available);
  return { coupleRoom, poltergeistRoom };
}
