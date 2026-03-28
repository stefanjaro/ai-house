// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/services/conversationOrchestrator.js', () => ({
  conversationOrchestrator: {
    runConversation: vi.fn(),
  },
}));
vi.mock('../../src/services/memoryService.js', () => ({
  memoryService: {
    reflectAndUpdate: vi.fn(),
  },
}));
vi.mock('../../src/services/diabolicalPlanner.js', () => ({
  diabolicalPlanner: {
    runMonologue: vi.fn(),
  },
}));
vi.mock('../../src/services/fileService.js', () => ({
  fileService: {
    getMemory: vi.fn(),
    setMemory: vi.fn(),
    saveConversationLog: vi.fn(),
    getPersonality: vi.fn(),
    getRoomInfluence: vi.fn(),
    listConversationLogs: vi.fn(),
  },
}));

import { runDayLoop } from '../../src/services/gameOrchestrator.js';
import { createGameState } from '../../src/engine/dayManager.js';
import { conversationOrchestrator } from '../../src/services/conversationOrchestrator.js';
import { memoryService } from '../../src/services/memoryService.js';
import { diabolicalPlanner } from '../../src/services/diabolicalPlanner.js';

function makeConfig() {
  const charConfig = { endpoint: 'http://x', apiKey: 'k', model: 'm', name: 'X' };
  return {
    husband: { ...charConfig, name: 'Husband' },
    wife: { ...charConfig, name: 'Wife' },
    poltergeist: { ...charConfig, name: 'Poltergeist' },
  };
}

function makeMemories() {
  return { husband: '', wife: '', poltergeist: '' };
}

function makePersonalities() {
  return { husband: 'H', wife: 'W', poltergeist: 'P' };
}

function makeRoomInfluences() {
  return {
    bedroom: 'bedroom text',
    kitchen: 'kitchen text',
    'living-room': 'living room text',
    'mystery-room': 'mystery room text',
  };
}

describe('runDayLoop', () => {
  let callOrder;
  let clickCount;
  let awaitClick;

  beforeEach(() => {
    callOrder = [];
    clickCount = 0;

    conversationOrchestrator.runConversation.mockResolvedValue('transcript');
    memoryService.reflectAndUpdate.mockImplementation(async ({ onComplete }) => {
      onComplete('updated memory text');
    });
    diabolicalPlanner.runMonologue.mockImplementation(async ({ onComplete }) => {
      if (onComplete) onComplete('monologue text');
    });

    awaitClick = vi.fn(async () => {
      clickCount++;
    });
  });

  it('calls awaitClick exactly once between each activity step', async () => {
    const gameState = createGameState(makeConfig());

    await runDayLoop({
      gameState,
      config: makeConfig(),
      personalities: makePersonalities(),
      memories: makeMemories(),
      roomInfluences: makeRoomInfluences(),
      previousPlan: null,
      onShowSelections: () => {},
      onShowRoom: () => {},
      onTurnStart: () => {},
      onChunk: () => {},
      onTurnComplete: () => {},
      onConversationComplete: () => {},
      onMemoryThought: () => {},
      onMemoryComplete: () => {},
      onDiabolicalChunk: () => {},
      onDiabolicalComplete: () => {},
      onSleep: () => {},
      onDayAdvance: () => {},
      awaitClick,
    });

    // Steps: after selections, after couple convo, after poltergeist convo,
    // after wife memory, after husband memory, after poltergeist memory/monologue, after sleep
    expect(awaitClick).toHaveBeenCalledTimes(7);
  });

  it('calls onShowSelections before any conversation starts', async () => {
    const gameState = createGameState(makeConfig());
    const onShowSelections = vi.fn();

    conversationOrchestrator.runConversation.mockImplementation(async () => {
      expect(onShowSelections).toHaveBeenCalledTimes(1);
      return 'transcript';
    });

    await runDayLoop({
      gameState,
      config: makeConfig(),
      personalities: makePersonalities(),
      memories: makeMemories(),
      roomInfluences: makeRoomInfluences(),
      previousPlan: null,
      onShowSelections,
      onShowRoom: () => {},
      onTurnStart: () => {},
      onChunk: () => {},
      onTurnComplete: () => {},
      onConversationComplete: () => {},
      onMemoryThought: () => {},
      onMemoryComplete: () => {},
      onDiabolicalChunk: () => {},
      onDiabolicalComplete: () => {},
      onSleep: () => {},
      onDayAdvance: () => {},
      awaitClick,
    });

    expect(onShowSelections).toHaveBeenCalledTimes(1);
  });

  it('calls onShowRoom 5 times: couple convo, poltergeist convo, wife memory, husband memory, poltergeist memory', async () => {
    const gameState = createGameState(makeConfig());
    const onShowRoom = vi.fn();

    await runDayLoop({
      gameState,
      config: makeConfig(),
      personalities: makePersonalities(),
      memories: makeMemories(),
      roomInfluences: makeRoomInfluences(),
      previousPlan: null,
      onShowSelections: () => {},
      onShowRoom,
      onTurnStart: () => {},
      onChunk: () => {},
      onTurnComplete: () => {},
      onConversationComplete: () => {},
      onMemoryThought: () => {},
      onMemoryComplete: () => {},
      onDiabolicalChunk: () => {},
      onDiabolicalComplete: () => {},
      onSleep: () => {},
      onDayAdvance: () => {},
      awaitClick,
    });

    // couple convo + poltergeist convo + wife memory + husband memory + poltergeist memory
    expect(onShowRoom).toHaveBeenCalledTimes(5);
    // Memory reflections always use bedroom / mystery-room
    const calls = onShowRoom.mock.calls;
    expect(calls[2][0]).toBe('bedroom');   // wife
    expect(calls[3][0]).toBe('bedroom');   // husband
    expect(calls[4][0]).toBe('mystery-room'); // poltergeist
  });

  it('runs couple conversation before poltergeist conversation', async () => {
    const gameState = createGameState(makeConfig());
    const order = [];

    conversationOrchestrator.runConversation.mockImplementation(async ({ participants }) => {
      order.push(participants.includes('poltergeist') ? 'poltergeist' : 'couple');
      return 'transcript';
    });

    await runDayLoop({
      gameState,
      config: makeConfig(),
      personalities: makePersonalities(),
      memories: makeMemories(),
      roomInfluences: makeRoomInfluences(),
      previousPlan: null,
      onShowSelections: () => {},
      onShowRoom: () => {},
      onTurnStart: () => {},
      onChunk: () => {},
      onTurnComplete: () => {},
      onConversationComplete: () => {},
      onMemoryThought: () => {},
      onMemoryComplete: () => {},
      onDiabolicalChunk: () => {},
      onDiabolicalComplete: () => {},
      onSleep: () => {},
      onDayAdvance: () => {},
      awaitClick,
    });

    expect(order).toEqual(['couple', 'poltergeist']);
  });

  it('runs memory reflections for wife, husband, then poltergeist', async () => {
    const gameState = createGameState(makeConfig());
    const reflectOrder = [];

    memoryService.reflectAndUpdate.mockImplementation(async ({ character, onComplete }) => {
      reflectOrder.push(character);
      onComplete('updated');
    });

    await runDayLoop({
      gameState,
      config: makeConfig(),
      personalities: makePersonalities(),
      memories: makeMemories(),
      roomInfluences: makeRoomInfluences(),
      previousPlan: null,
      onShowSelections: () => {},
      onShowRoom: () => {},
      onTurnStart: () => {},
      onChunk: () => {},
      onTurnComplete: () => {},
      onConversationComplete: () => {},
      onMemoryThought: () => {},
      onMemoryComplete: () => {},
      onDiabolicalChunk: () => {},
      onDiabolicalComplete: () => {},
      onSleep: () => {},
      onDayAdvance: () => {},
      awaitClick,
    });

    expect(reflectOrder).toEqual(['wife', 'husband', 'poltergeist']);
  });

  it('calls onSleep after all activities', async () => {
    const gameState = createGameState(makeConfig());
    const onSleep = vi.fn();
    const onDayAdvance = vi.fn();

    await runDayLoop({
      gameState,
      config: makeConfig(),
      personalities: makePersonalities(),
      memories: makeMemories(),
      roomInfluences: makeRoomInfluences(),
      previousPlan: null,
      onShowSelections: () => {},
      onShowRoom: () => {},
      onTurnStart: () => {},
      onChunk: () => {},
      onTurnComplete: () => {},
      onConversationComplete: () => {},
      onMemoryThought: () => {},
      onMemoryComplete: () => {},
      onDiabolicalChunk: () => {},
      onDiabolicalComplete: () => {},
      onSleep,
      onDayAdvance,
      awaitClick,
    });

    expect(onSleep).toHaveBeenCalledTimes(1);
    expect(onDayAdvance).toHaveBeenCalledTimes(1);
  });

  it('passes transcripts from both conversations to memory reflection', async () => {
    const gameState = createGameState(makeConfig());

    conversationOrchestrator.runConversation
      .mockResolvedValueOnce('couple transcript')
      .mockResolvedValueOnce('poltergeist transcript');

    const reflectCalls = [];
    memoryService.reflectAndUpdate.mockImplementation(async ({ character, dayConversations, onComplete }) => {
      reflectCalls.push({ character, dayConversations });
      onComplete('updated');
    });

    await runDayLoop({
      gameState,
      config: makeConfig(),
      personalities: makePersonalities(),
      memories: makeMemories(),
      roomInfluences: makeRoomInfluences(),
      previousPlan: null,
      onShowSelections: () => {},
      onShowRoom: () => {},
      onTurnStart: () => {},
      onChunk: () => {},
      onTurnComplete: () => {},
      onConversationComplete: () => {},
      onMemoryThought: () => {},
      onMemoryComplete: () => {},
      onDiabolicalChunk: () => {},
      onDiabolicalComplete: () => {},
      onSleep: () => {},
      onDayAdvance: () => {},
      awaitClick,
    });

    // Couple and poltergeist transcripts should be passed to wife/husband memory
    expect(reflectCalls[0].dayConversations).toContain('couple transcript');
    expect(reflectCalls[1].dayConversations).toContain('couple transcript');
    // Poltergeist transcript should be passed to poltergeist memory
    expect(reflectCalls[2].dayConversations).toContain('poltergeist transcript');
  });

  it('returns updated game state with incremented day', async () => {
    const gameState = createGameState(makeConfig());
    expect(gameState.currentDay).toBe(1);

    const newState = await runDayLoop({
      gameState,
      config: makeConfig(),
      personalities: makePersonalities(),
      memories: makeMemories(),
      roomInfluences: makeRoomInfluences(),
      previousPlan: null,
      onShowSelections: () => {},
      onShowRoom: () => {},
      onTurnStart: () => {},
      onChunk: () => {},
      onTurnComplete: () => {},
      onConversationComplete: () => {},
      onMemoryThought: () => {},
      onMemoryComplete: () => {},
      onDiabolicalChunk: () => {},
      onDiabolicalComplete: () => {},
      onSleep: () => {},
      onDayAdvance: () => {},
      awaitClick,
    });

    expect(newState.currentDay).toBe(2);
  });

  it('awaitClick is not called mid-stream — only after each activity completes', async () => {
    const gameState = createGameState(makeConfig());
    let isStreaming = false;
    let clickDuringStream = false;

    conversationOrchestrator.runConversation.mockImplementation(async ({ onChunk, onConversationComplete }) => {
      isStreaming = true;
      if (onChunk) onChunk('speaker', 'chunk');
      isStreaming = false;
      if (onConversationComplete) onConversationComplete('transcript');
      return 'transcript';
    });

    const guardedClick = vi.fn(async () => {
      if (isStreaming) clickDuringStream = true;
    });

    await runDayLoop({
      gameState,
      config: makeConfig(),
      personalities: makePersonalities(),
      memories: makeMemories(),
      roomInfluences: makeRoomInfluences(),
      previousPlan: null,
      onShowSelections: () => {},
      onShowRoom: () => {},
      onTurnStart: () => {},
      onChunk: () => {},
      onTurnComplete: () => {},
      onConversationComplete: () => {},
      onMemoryThought: () => {},
      onMemoryComplete: () => {},
      onDiabolicalChunk: () => {},
      onDiabolicalComplete: () => {},
      onSleep: () => {},
      onDayAdvance: () => {},
      awaitClick: guardedClick,
    });

    expect(clickDuringStream).toBe(false);
  });
});
