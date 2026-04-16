import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { requireApiKey } from './middleware/auth';
import tokenRoutes from './routes/tokens';
import analyzeRoutes from './routes/analyze';
import issueRoutes from './routes/issues';

export function createApp() {
  const app = express();

  app.use(cors({ origin: ['https://www.figma.com', 'http://localhost:3000'] }));
  app.use(rateLimit({ windowMs: 60_000, max: 50 }));
  app.use(express.json({ limit: '1mb' }));

  app.use('/api/tokens', requireApiKey, tokenRoutes);
  app.use('/api/analyze', requireApiKey, analyzeRoutes);
  app.use('/api/issues', requireApiKey, issueRoutes);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
