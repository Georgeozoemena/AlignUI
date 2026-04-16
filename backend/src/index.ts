import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import tokenRoutes from './routes/tokens';
import analyzeRoutes from './routes/analyze';

const app = express();

// Security: only allow requests from Figma plugin origin
app.use(cors({ origin: ['https://www.figma.com', 'http://localhost:*'] }));

// Security: limit to 50 requests per minute per IP
app.use(rateLimit({ windowMs: 60_000, max: 50 }));

app.use(express.json({ limit: '1mb' }));

app.use('/api/tokens', tokenRoutes);
app.use('/api/analyze', analyzeRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Catch-all for unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(3000, () => {
  console.log('AlignUI backend running on port 3000');
});
