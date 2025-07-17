const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Bug = require('../models/Bug');

// Mock MongoDB connection
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/bug-tracker-test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await Bug.deleteMany();
});

describe('Bug Routes', () => {
  const testBug = {
    title: 'Test Bug',
    description: 'This is a test bug',
    status: 'open',
    priority: 'medium'
  };

  let bugId;

  describe('GET /api/bugs', () => {
    it('should return all bugs', async () => {
      const bug = await Bug.create(testBug);
      const response = await request(app).get('/api/bugs');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]._id).toBe(bug._id.toString());
    });
  });

  describe('POST /api/bugs', () => {
    it('should create a new bug', async () => {
      const response = await request(app)
        .post('/api/bugs')
        .send(testBug);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(testBug.title);
      expect(response.body.description).toBe(testBug.description);
      bugId = response.body._id;
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/bugs')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/bugs/:id', () => {
    beforeEach(async () => {
      const bug = await Bug.create(testBug);
      bugId = bug._id;
    });

    it('should update a bug', async () => {
      const update = { status: 'in-progress' };
      const response = await request(app)
        .patch(`/api/bugs/${bugId}`)
        .send(update);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('in-progress');
    });

    it('should return 404 for non-existent bug', async () => {
      const response = await request(app)
        .patch('/api/bugs/1234')
        .send({ status: 'in-progress' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    beforeEach(async () => {
      const bug = await Bug.create(testBug);
      bugId = bug._id;
    });

    it('should delete a bug', async () => {
      const response = await request(app).delete(`/api/bugs/${bugId}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Bug deleted');

      const bug = await Bug.findById(bugId);
      expect(bug).toBeNull();
    });

    it('should return 404 for non-existent bug', async () => {
      const response = await request(app).delete('/api/bugs/1234');
      expect(response.status).toBe(404);
    });
  });
});
