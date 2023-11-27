const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../index');
const User = require('../models/User');

require('dotenv').config();

let server;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    server = app.listen(8806); 
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});

describe('User API Endpoints', () => {
    let testUserCredentials;
    let testUser;

    beforeEach(async () => {
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

    describe('PUT /api/users/:id', () => {
        it('should update the user account if authorized', async () => {
            const updatedInfo = {
                username: 'newusername',
                email: 'newemail@example.com'
            };
        
            const response = await request(app)
                .put(`/api/users/${testUser._id}`)
                .send({ userId: testUser._id, ...updatedInfo });
        
            expect(response.statusCode).toBe(200);
            expect(response.body).toBe('Account has been updated');
        
            const updatedUser = await User.findById(testUser._id);
            expect(updatedUser.username).toBe(updatedInfo.username);
            expect(updatedUser.email).toBe(updatedInfo.email);
        
        });
        

        it('should return a 403 status if not authorized', async () => {
            const response = await request(app)
                .put(`/api/users/${testUser._id}`)
                .send({ userId: 'someotheruserid' });

            expect(response.statusCode).toBe(403);
        });

        it('should return a 500 status on server error', async () => {
            const response = await request(app)
                .put('/api/users/invaliduserid')
                .send({ userId: 'invaliduserid'});

            expect(response.statusCode).toBe(500);
        });
    });
});
