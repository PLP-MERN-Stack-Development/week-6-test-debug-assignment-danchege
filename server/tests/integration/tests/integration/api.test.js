// Polyfill for TextEncoder if not available
global.TextEncoder = require('util').TextEncoder;

const request = require('supertest');
const { setupMongo, cleanupMongo, clearCollections, createTestData } = require('./setup');
const app = require('../../src/app').app;

describe('API Endpoints', () => {
  jest.setTimeout(300000); // 5 minutes timeout for MongoDB setup
  let server;
  const app = require('../../src/app').app;

  beforeAll(async () => {
    await setupMongo();
    server = app.listen(0); // Use random available port
    await new Promise(resolve => server.once('listening', resolve));
  });

  afterAll(async () => {
    server.close();
    await cleanupMongo();
  });

  beforeEach(async () => {
    await clearCollections();
    await createTestData();
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(server).get('/api/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(server)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
    });
  });
});
