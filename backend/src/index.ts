import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import { connectDB } from './db/connection';
import tokenRoutes from './routes/tokens';
import analyzeRoutes from './routes/analyze';

const app = express();

app.use(cors({ origin: ['https://www.figma.com', 'http://localhost:3000'] }));
app.use(rateLimit({ windowMs: 60_000, max: 50 }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/tokens', tokenRoutes);
app.use('/api/analyze', analyzeRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

async function start() {
  await connectDB();
  app.listen(3000, () => {
    console.log('AlignUI backend running on port 3000');
  });
}

start().catch((err) => {
  console.error('[startup] Failed to start:', err.message);
  process.exit(1);
});
