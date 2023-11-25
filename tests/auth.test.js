const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');
const PORT = 8802;

require('dotenv').config();

let server;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    server = app.listen(PORT);
  });
  

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
  });

describe('User API Endpoints', () => {
  const testUserCredentials = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'testpassword',
  };


  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUserCredentials);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.username).toBe(testUserCredentials.username);
      expect(response.body.email).toBe(testUserCredentials.email);
    });

    it('should handle registration errors', async () => {
      const duplicateResponse = await request(app)
        .post('/api/auth/register')
        .send(testUserCredentials);

      expect(duplicateResponse.statusCode).toBe(500); 
    });
  });


  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      await request(app).post('/api/auth/register').send(testUserCredentials);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUserCredentials.email,
          password: testUserCredentials.password,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.username).toBe(testUserCredentials.username);
      expect(response.body.email).toBe(testUserCredentials.email);
    });

    it('should handle login errors', async () => {
      const incorrectPasswordResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUserCredentials.email,
          password: 'wrongpassword',
        });

      expect(incorrectPasswordResponse.statusCode).toBe(400);


      const nonExistingUserResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistinguser@example.com',
          password: 'testpassword',
        });

      expect(nonExistingUserResponse.statusCode).toBe(404);
    });
  });
});
