import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

beforeAll(() => {
  process.env.API_KEY = 'test-key';
});

describe('Auth middleware', () => {
  it('returns 401 when no API key is provided', async () => {
    const res = await request(app).get('/api/tokens');
    expect(res.status).toBe(401);
  });

  it('returns 401 when wrong API key is provided', async () => {
    const res = await request(app)
      .get('/api/tokens')
      .set('x-api-key', 'wrong-key');
    expect(res.status).toBe(401);
  });

  it('passes through with correct API key and reaches the route', async () => {
    const res = await request(app)
      .post('/api/tokens')
      .set('x-api-key', 'test-key')
      .send({ tokens: [] }); // will fail validation, not auth — that's the point
    expect(res.status).toBe(400); // validation error, not 401
    expect(res.body.error).toBe('Invalid token payload');
  });

  it('health endpoint requires no auth', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
