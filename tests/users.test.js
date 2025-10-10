const request = require('supertest');
const app = require('../src/app');

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return API info', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('version');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('Users API', () => {
    describe('GET /api/users', () => {
      it('should return all users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
      });
    });

    describe('GET /api/users/:id', () => {
      it('should return a user by id', async () => {
        const res = await request(app).get('/api/users/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('email');
      });

      it('should return 404 for non-existent user', async () => {
        const res = await request(app).get('/api/users/999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
      });
    });

    describe('POST /api/users', () => {
      it('should create a new user', async () => {
        const newUser = {
          name: 'Test User',
          email: 'test@example.com'
        };

        const res = await request(app)
          .post('/api/users')
          .send(newUser);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(newUser.name);
        expect(res.body.email).toBe(newUser.email);
      });

      it('should return 400 if name or email is missing', async () => {
        const res = await request(app)
          .post('/api/users')
          .send({ name: 'Test' });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
      });
    });

    describe('PUT /api/users/:id', () => {
      it('should update a user', async () => {
        const updates = {
          name: 'Updated Name'
        };

        const res = await request(app)
          .put('/api/users/1')
          .send(updates);

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe(updates.name);
      });

      it('should return 404 for non-existent user', async () => {
        const res = await request(app)
          .put('/api/users/999')
          .send({ name: 'Test' });

        expect(res.statusCode).toBe(404);
      });
    });

    describe('DELETE /api/users/:id', () => {
      it('should delete a user', async () => {
        const res = await request(app).delete('/api/users/2');
        expect(res.statusCode).toBe(204);
      });

      it('should return 404 for non-existent user', async () => {
        const res = await request(app).delete('/api/users/999');
        expect(res.statusCode).toBe(404);
      });
    });
  });
});