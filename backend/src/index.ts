import express from 'express';
import tokenRoutes from './routes/tokens'

const app = express();
app.use(express.json());

app.use('/api/tokens', tokenRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('AlignUI backend running on port 3000');
});
