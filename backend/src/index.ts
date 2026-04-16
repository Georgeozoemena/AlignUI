import 'dotenv/config';
import { connectDB } from './db/connection';
import { createApp } from './app';

async function start() {
  await connectDB();
  const app = createApp();
  app.listen(3000, () => {
    console.log('AlignUI backend running on port 3000');
  });
}

start().catch((err) => {
  console.error('[startup] Failed to start:', err.message);
  process.exit(1);
});
