// Dependencies import
import request from 'supertest';
import express from 'express';

// Initiate Express app
import loaders from '../loaders/index';
const application = express();

describe('Testing GET /rooms endpoint', () => {
  it('Should return response', async (done) => {
    const app = await loaders({ expressApp: application });
    const res = await request(app)
      .get('/api/v1/rooms')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Rooms data retrieved successfully');
    expect(res.body.total_records).toBeGreaterThanOrEqual(0);
    expect(res.body.data).toBeInstanceOf(Array);
    done();
  });
});

describe('Testing GET /rooms/:room_id endpoint', () => {
  it('Should return data for room 1', async (done) => {
    const app = await loaders({ expressApp: application });
    const res = await request(app)
      .get('/api/v1/rooms/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Room data retrieved successfully');
    expect(res.body.data.room_id).toEqual(1);
    expect(res.body.data.room_name).toEqual('Sauna');
    expect(res.body.data.bookings_timestamps).toBeInstanceOf(Array);
    expect(res.body.data.bookings_formatted).toBeInstanceOf(Array);
    done();
  });
});
