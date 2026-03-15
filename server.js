import express from 'express';
import cors from 'cors';
import { readFileSync, existsSync } from 'fs';
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

// Only start listening when run directly (not when imported by tests)
if (process.argv[1] === new URL(import.meta.url).pathname) {
  app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
}

export { app };
