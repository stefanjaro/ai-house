import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/config', (req, res) => {
  const configPath = resolve(process.cwd(), 'config.json');
  if (!existsSync(configPath)) {
    return res.status(500).json({
      error: 'config.json not found. Copy config.template.json to config.json and fill in your API details.',
    });
  }
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  res.json(config);
});

const ALLOWED_CONTENT_TYPES = ['personalities', 'room-influence', 'memory'];

app.get('/api/content/:type/:filename', (req, res) => {
  const { type, filename } = req.params;
  if (!ALLOWED_CONTENT_TYPES.includes(type)) {
    return res.status(400).json({ error: `Invalid content type: ${type}` });
  }
  const filePath = resolve(process.cwd(), 'data', type, filename);
  if (!existsSync(filePath)) {
    return res.status(404).json({ error: `File not found: ${type}/${filename}` });
  }
  res.type('text/plain').send(readFileSync(filePath, 'utf-8'));
});

// ── Memory ────────────────────────────────────────────────────────────────────

const VALID_CHARACTERS = ['husband', 'wife', 'poltergeist'];

app.get('/api/memory/:character', (req, res) => {
  const { character } = req.params;
  if (!VALID_CHARACTERS.includes(character)) {
    return res.status(400).json({ error: `Invalid character: ${character}` });
  }
  const filePath = resolve(process.cwd(), 'data/memory', `${character}-memory.md`);
  const content = existsSync(filePath) ? readFileSync(filePath, 'utf-8') : '';
  res.type('text/plain').send(content);
});

app.put('/api/memory/:character', (req, res) => {
  const { character } = req.params;
  if (!VALID_CHARACTERS.includes(character)) {
    return res.status(400).json({ error: `Invalid character: ${character}` });
  }
  const dirPath = resolve(process.cwd(), 'data/memory');
  const filePath = resolve(dirPath, `${character}-memory.md`);
  mkdirSync(dirPath, { recursive: true });
  writeFileSync(filePath, req.body.content ?? '');
  res.json({ ok: true });
});

// ── Personalities ─────────────────────────────────────────────────────────────

app.get('/api/personality/:character', (req, res) => {
  const { character } = req.params;
  if (!VALID_CHARACTERS.includes(character)) {
    return res.status(400).json({ error: `Invalid character: ${character}` });
  }
  const filePath = resolve(process.cwd(), 'data/personalities', `${character}-personality.md`);
  if (!existsSync(filePath)) {
    return res.status(404).json({ error: `Personality file not found for: ${character}` });
  }
  res.type('text/plain').send(readFileSync(filePath, 'utf-8'));
});

app.put('/api/personality/:character', (req, res) => {
  const { character } = req.params;
  if (character === 'poltergeist') {
    return res.status(403).json({ error: 'The poltergeist personality cannot be edited.' });
  }
  if (!VALID_CHARACTERS.includes(character)) {
    return res.status(400).json({ error: `Invalid character: ${character}` });
  }
  const filePath = resolve(process.cwd(), 'data/personalities', `${character}-personality.md`);
  writeFileSync(filePath, req.body.content ?? '');
  res.json({ ok: true });
});

// ── Conversation logs ─────────────────────────────────────────────────────────

const CONVERSATION_DIRS = {
  couple: 'data/husband-wife-conversations',
  poltergeist: 'data/poltergeist-conversations',
  'end-game': 'data/end-of-game-conversations',
};

app.post('/api/conversations/:type', (req, res) => {
  const { type } = req.params;
  const dir = CONVERSATION_DIRS[type];
  if (!dir) {
    return res.status(400).json({ error: `Invalid conversation type: ${type}` });
  }
  const { day, content } = req.body;
  const filename = `day-${day}-${Date.now()}.md`;
  const filePath = resolve(process.cwd(), dir, filename);
  mkdirSync(resolve(process.cwd(), dir), { recursive: true });
  writeFileSync(filePath, content ?? '');
  res.json({ ok: true, filename });
});

app.get('/api/conversations/:type', (req, res) => {
  const { type } = req.params;
  const dir = CONVERSATION_DIRS[type];
  if (!dir) {
    return res.status(400).json({ error: `Invalid conversation type: ${type}` });
  }
  const dirPath = resolve(process.cwd(), dir);
  const files = existsSync(dirPath)
    ? readdirSync(dirPath).filter((f) => f.endsWith('.md'))
    : [];
  res.json(files);
});

// ── LLM proxy (avoids CORS when calling external endpoints) ──────────────────

app.post('/api/llm/stream', async (req, res) => {
  const { endpoint, apiKey, model, messages } = req.body;
  if (!endpoint || !apiKey || !model || !messages) {
    return res.status(400).json({ error: 'Missing required fields: endpoint, apiKey, model, messages' });
  }

  const base = endpoint.replace(/\/chat\/completions\/?$/, '').replace(/\/$/, '');
  const url = `${base}/chat/completions`;

  let upstream;
  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, stream: true }),
    });
  } catch (err) {
    return res.status(502).json({ error: `LLM proxy fetch failed: ${err.message}` });
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    return res.status(upstream.status).json({ error: text });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
  } finally {
    res.end();
  }
});

// ── Room influence ────────────────────────────────────────────────────────────

app.get('/api/room-influence/:room', (req, res) => {
  const { room } = req.params;
  const filePath = resolve(process.cwd(), 'data/room-influence', `${room}.md`);
  if (!existsSync(filePath)) {
    return res.status(404).json({ error: `Room influence file not found: ${room}` });
  }
  res.type('text/plain').send(readFileSync(filePath, 'utf-8'));
});

// Only start listening when run directly (not when imported by tests)
if (process.argv[1] === new URL(import.meta.url).pathname) {
  app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
}

export { app };
