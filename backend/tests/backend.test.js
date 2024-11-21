const request = require('supertest');
const app = require('../index'); // Path to your server file

describe('API Endpoints', () => {
    it('should fetch all maintenance requests', async () => {
        const res = await request(app).get('/api/requests');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should submit a maintenance request', async () => {
        const res = await request(app)
            .post('/api/submit-request')
            .send({
                apartmentNumber: '103',
                problemArea: 'Living Room',
                description: 'Broken window',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Request submitted successfully');
    });

    it('should update the status of a request', async () => {
        const res = await request(app)
            .patch('/api/update-status/1')
            .send({ status: 'completed' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Status updated successfully');
    });
});
