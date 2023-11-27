const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

require('dotenv').config();

let server;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    server = app.listen(8805);
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});

describe('User API Endpoints', () => {
    let testUserCredentials;
    let testUser;

    beforeEach(async () => {
        // Move this line to after testUserCredentials is initialized
        // Clean up existing users with the same username
        await User.deleteMany({ username: testUserCredentials?.username });

        testUserCredentials = {
            username: `testuser_${Date.now()}`,
            email: `testuser_${Date.now()}@example.com`,
            password: 'testpassword',
        };

        testUser = await User.create(testUserCredentials);
    });

    afterEach(async () => {
        if (testUser && testUser._id) {
            await User.findByIdAndDelete(testUser._id);
        }
    });

    describe('PUT /api/users/:id/follow', () => {
        it('should follow the user if authorized', async () => {
            const anotherUser = await User.create({
                username: `anotheruser_${Date.now()}`,
                email: `anotheruser_${Date.now()}@example.com`,
                password: 'anotherpassword',
            });

            const response = await request(app)
                .put(`/api/users/${anotherUser._id}/follow`)
                .send({ userId: testUser._id });

            expect(response.statusCode).toBe(200);
            expect(response.body).toBe('User has been followed');

            // Verify that the user is now following
            const updatedUser = await User.findById(anotherUser._id);
            expect(updatedUser.following).toEqual(expect.arrayContaining([expect.stringContaining(testUser._id.toString())]));


            // Clean up
            await User.findByIdAndDelete(anotherUser._id);
        });

    });
});
