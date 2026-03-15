import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../server.js';

let server;
let port;

beforeAll(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      port = server.address().port;
      resolve();
    });
  });
});

afterAll(() => {
  server.close();
});

describe('GET /api/content/:type/:filename', () => {
  it('returns the bedroom room influence file', async () => {
    const res = await fetch(`http://localhost:${port}/api/content/room-influence/bedroom.md`);
    expect(res.status).toBe(200);

    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
    expect(text).toMatch(/bedroom/i);
  });

  it('returns 404 for a file that does not exist', async () => {
    const res = await fetch(`http://localhost:${port}/api/content/room-influence/nonexistent.md`);
    expect(res.status).toBe(404);
  });

  it('returns a personality file', async () => {
    const res = await fetch(`http://localhost:${port}/api/content/personalities/husband-personality.md`);
    expect(res.status).toBe(200);

    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
  });
});
