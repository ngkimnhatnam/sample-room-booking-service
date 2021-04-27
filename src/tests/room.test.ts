// Dependencies import
import request from 'supertest';
import express from 'express';

// Models import
import * as roomModel from '../models/room';

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

describe('Testing POST /rooms endpoint', () => {
  it('Should return newly created room id', async (done) => {
    const app = await loaders({ expressApp: application });
    const res = await request(app)
      .post('/api/v1/rooms')
      .send({
        room_name: 'Casablanca',
        opening_hour: '11:00:00',
        closing_hour: '19:00:00',
        timezone: 'Africa/Casablanca',
        base_price: 2000,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    expect(res.status).toEqual(201);
    expect(res.body.message).toEqual('New room added successfully');
    expect(res.body.new_room_id).toBeDefined();
    await roomModel.deleteOne(res.body.new_room_id);
    done();
  });
});
