const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const PORT = 8804;
const User = require('../models/User');

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
    let testUserCredentials;
    let testUser;

    beforeEach(async () => {
        // Generate unique credentials for each test
        testUserCredentials = {
            username: `testuser_${Date.now()}`,
            email: `testuser_${Date.now()}@example.com`,
            password: 'testpassword',
        };

        // Create a new user for each test
        testUser = await User.create(testUserCredentials);
    });

    afterEach(async () => {
        if (testUser && testUser._id) {
            await User.findByIdAndDelete(testUser._id);
        }
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete the user if authorized', async () => {
            const response = await request(app)
                .delete(`/api/users/${testUser._id}`)
                .send({ userId: testUser._id, isAdmin: true });

            expect(response.statusCode).toBe(204);

            // Verify that the user is deleted
            const deletedUser = await User.findById(testUser._id);
            expect(deletedUser).toBeNull();
        });

        it('should return a 403 status if not authorized', async () => {
            const response = await request(app)
                .delete(`/api/users/${testUser._id}`)
                .send({ userId: 'someotheruserid' });

            expect(response.statusCode).toBe(403);
        });

        it('should return a 500 status on server error', async () => {
            const response = await request(app)
                .delete('/api/users/invaliduserid')
                .send({ userId: 'invaliduserid' });

            expect(response.statusCode).toBe(500);
        });
    });
});
