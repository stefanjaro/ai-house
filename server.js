import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Only start listening when run directly (not when imported by tests)
if (process.argv[1] === new URL(import.meta.url).pathname) {
  app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
}

export { app };
