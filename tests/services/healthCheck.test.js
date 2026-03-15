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

describe('GET /api/health', () => {
  it('returns { status: "ok" }', async () => {
    const res = await fetch(`http://localhost:${port}/api/health`);
    const data = await res.json();
    expect(data).toEqual({ status: 'ok' });
  });
});
