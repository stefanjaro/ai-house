import {
  selectPoltergeistTarget,
  selectConversationRooms,
  selectConversationStarter,
} from './randomSelector.js';

export function createGameState(config) {
  return {
    currentDay: 1,
    totalDays: 10,
    characters: {
      husband: { ...config.husband },
      wife: { ...config.wife },
      poltergeist: { ...config.poltergeist },
    },
    today: null,
    previousDayRooms: null,
  };
}

export function startDay(gameState) {
  if (gameState.currentDay > gameState.totalDays + 1) {
    throw new Error(`Cannot start day ${gameState.currentDay} — game is over.`);
  }

  const { coupleRoom, poltergeistRoom } = selectConversationRooms(gameState.previousDayRooms);

  return {
    ...gameState,
    today: {
      poltergeistTarget: selectPoltergeistTarget(),
      coupleRoom,
      poltergeistRoom,
      conversationStarter: selectConversationStarter(),
      completedActivities: [],
    },
  };
}

export function completeActivity(gameState, activity) {
  const updatedActivities = [...gameState.today.completedActivities, activity];

  if (activity === 'sleep') {
    return {
      ...gameState,
      currentDay: gameState.currentDay + 1,
      previousDayRooms: [gameState.today.coupleRoom, gameState.today.poltergeistRoom],
      today: null,
    };
  }

  return {
    ...gameState,
    today: { ...gameState.today, completedActivities: updatedActivities },
  };
}

export function isGameOver(gameState) {
  return gameState.currentDay > gameState.totalDays;
}

export function getCurrentDay(gameState) {
  return gameState.currentDay;
}
