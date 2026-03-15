import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../server.js';
import { writeFileSync, unlinkSync, existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const CONFIG_PATH = resolve(process.cwd(), 'config.json');
const TEST_CONFIG = {
  husband: { name: 'Arthur', model: 'gpt-4o', endpoint: 'https://api.openai.com/v1', apiKey: 'test-key' },
  wife: { name: 'Eleanor', model: 'gpt-4o', endpoint: 'https://api.openai.com/v1', apiKey: 'test-key' },
  poltergeist: { name: 'Mischief', model: 'gpt-4o', endpoint: 'https://api.openai.com/v1', apiKey: 'test-key' },
};

let server;
let port;
let originalConfig;

beforeAll(async () => {
  // Back up real config.json if it exists
  if (existsSync(CONFIG_PATH)) {
    originalConfig = readFileSync(CONFIG_PATH, 'utf-8');
  }

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      port = server.address().port;
      resolve();
    });
  });
});

afterAll(() => {
  // Restore original config.json or clean up test file
  if (originalConfig !== undefined) {
    writeFileSync(CONFIG_PATH, originalConfig);
  } else if (existsSync(CONFIG_PATH)) {
    unlinkSync(CONFIG_PATH);
  }
  server.close();
});

describe('GET /api/config', () => {
  it('returns parsed config JSON when config.json exists', async () => {
    writeFileSync(CONFIG_PATH, JSON.stringify(TEST_CONFIG));

    const res = await fetch(`http://localhost:${port}/api/config`);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty('husband');
    expect(data).toHaveProperty('wife');
    expect(data).toHaveProperty('poltergeist');
    expect(data.husband.name).toBe('Arthur');
  });

  it('returns 500 with a helpful message when config.json is missing', async () => {
    if (existsSync(CONFIG_PATH)) unlinkSync(CONFIG_PATH);

    const res = await fetch(`http://localhost:${port}/api/config`);
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.error).toMatch(/config\.json/i);
  });
});
