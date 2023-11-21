const request = require('supertest');
const mongoose = require("mongoose");
const app = require('./index');

require("dotenv").config();


beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });
  

afterEach(async () => {
    await mongoose.connection.close();
  });

describe('GET /', () => {
  it('It should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Welcome to homepage');
  });
});

describe('GET /users', () => {
  it('It should return "Users Page"', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Users Page');
  });
});