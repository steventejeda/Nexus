const request = require('supertest');
const mongoose = require("mongoose");
const app = require('../index');
const PORT = process.env.PORT || 8800;

require("dotenv").config();

let server;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    server = app.listen(PORT);
  });
  

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
  });

describe('GET /', () => {
  it('It should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Welcome to homepage');
  });
});

describe('GET /api/users', () => {
  it('It should return "This is the user route"', async () => {
    const response = await request(app).get('/api/users');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('This is the user route');
  });
});