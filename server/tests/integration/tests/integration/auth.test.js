// Polyfill for TextEncoder if not available
global.TextEncoder = require('util').TextEncoder;

const request = require('supertest');
const { setupMongo, cleanupMongo, clearCollections, createTestData } = require('./setup');
const app = require('../../src/app').app;

// Clear database before each test
describe('Authentication API', () => {
  jest.setTimeout(300000); // 5 minutes timeout for MongoDB setup
  beforeAll(async () => {
    await setupMongo();
  });

  afterAll(async () => {
    await cleanupMongo();
  });

  beforeEach(async () => {
    await clearCollections();
    await createTestData();
  });

  // Test cases for registration
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Existing User',
          email: 'test1@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test cases for login
  describe('POST /api/auth/login', () => {
    it('should login successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test1@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test1@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
