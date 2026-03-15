import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { writeFileSync, existsSync, unlinkSync, readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { app } from '../../server.js';
import { fileService } from '../../src/services/fileService.js';

const CONFIG_PATH = resolve(process.cwd(), 'config.json');
const HUSBAND_MEMORY_PATH = resolve(process.cwd(), 'data/memory/husband-memory.md');
const TEST_CONFIG = {
  husband: { name: 'Arthur', model: 'test', endpoint: 'http://test', apiKey: 'key' },
  wife: { name: 'Eleanor', model: 'test', endpoint: 'http://test', apiKey: 'key' },
  poltergeist: { name: 'Mischief', model: 'test', endpoint: 'http://test', apiKey: 'key' },
};

let server;
let port;
let originalConfig;
let createdLogFiles = [];

beforeAll(async () => {
  // Back up real config.json if it exists
  if (existsSync(CONFIG_PATH)) {
    originalConfig = readFileSync(CONFIG_PATH, 'utf-8');
  }
  writeFileSync(CONFIG_PATH, JSON.stringify(TEST_CONFIG));

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      port = server.address().port;
      resolve();
    });
  });

  fileService._base = `http://localhost:${port}`;
});

afterAll(() => {
  // Restore config
  if (originalConfig !== undefined) {
    writeFileSync(CONFIG_PATH, originalConfig);
  } else if (existsSync(CONFIG_PATH)) {
    unlinkSync(CONFIG_PATH);
  }

  // Clean up any memory files written during tests
  if (existsSync(HUSBAND_MEMORY_PATH)) unlinkSync(HUSBAND_MEMORY_PATH);

  // Clean up any conversation log files created during tests
  for (const filePath of createdLogFiles) {
    if (existsSync(filePath)) unlinkSync(filePath);
  }

  server.close();
});

describe('fileService.getConfig', () => {
  it('returns an object with husband, wife, and poltergeist keys', async () => {
    const config = await fileService.getConfig();
    expect(config).toHaveProperty('husband');
    expect(config).toHaveProperty('wife');
    expect(config).toHaveProperty('poltergeist');
  });
});

describe('fileService.getMemory / setMemory', () => {
  it('getMemory returns a string even when file does not exist', async () => {
    const content = await fileService.getMemory('husband');
    expect(typeof content).toBe('string');
  });

  it('setMemory then getMemory returns the same content', async () => {
    const text = 'She laughed at my joke about the harvest.\nI felt seen today.';
    await fileService.setMemory('husband', text);
    const retrieved = await fileService.getMemory('husband');
    expect(retrieved).toBe(text);
  });
});

describe('fileService.getPersonality / setPersonality', () => {
  it('getPersonality returns the personality file content', async () => {
    const content = await fileService.getPersonality('husband');
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
  });

  it('setPersonality rejects writing to poltergeist with 403', async () => {
    await expect(fileService.setPersonality('poltergeist', 'new text')).rejects.toThrow('403');
  });
});

describe('fileService.saveConversationLog / listConversationLogs', () => {
  it('saveConversationLog creates a file and listConversationLogs includes it', async () => {
    const content = 'Husband: Good morning.\nWife: Good morning to you.';
    const filename = await fileService.saveConversationLog('couple', 1, content);

    // Track for cleanup
    createdLogFiles.push(
      resolve(process.cwd(), 'data/husband-wife-conversations', filename)
    );

    const list = await fileService.listConversationLogs('couple');
    expect(list).toContain(filename);
  });

  it('saveConversationLog works for poltergeist type', async () => {
    const content = 'Poltergeist: Heh heh heh.\nWife: What was that noise?';
    const filename = await fileService.saveConversationLog('poltergeist', 1, content);

    createdLogFiles.push(
      resolve(process.cwd(), 'data/poltergeist-conversations', filename)
    );

    const list = await fileService.listConversationLogs('poltergeist');
    expect(list).toContain(filename);
  });
});

describe('fileService.getRoomInfluence', () => {
  it('returns the bedroom room influence text', async () => {
    const content = await fileService.getRoomInfluence('bedroom');
    expect(typeof content).toBe('string');
    expect(content).toMatch(/bedroom/i);
  });
});
