// Dependencies import
import request from 'supertest';
import express from 'express';

// Models import
import * as userModel from '../models/user';

// Initiate Express app
import loaders from '../loaders/index';
const application = express();

describe('Testing User functionality: Create New User', () => {
  it('Should return error', async (done) => {
    const app = await loaders({ expressApp: application });
    const res = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'random@mail.com',
        password: 'randomPass',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Email existed');
    done();
  });

  it('Should return newly created user ID', async (done) => {
    const app = await loaders({ expressApp: application });
    const res = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'randomm@mail.com',
        password: 'randomPass',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    expect(res.status).toEqual(201);
    expect(res.body.message).toEqual('User signup success');
    expect(res.body.user_id).toBeDefined();
    await userModel.deleteUserRecord(res.body.user_id);
    done();
  });
});

describe('Testing User functionality: Create New Booking Error Cases', () => {
  it('Should return error for too short duration', async (done) => {
    const app = await loaders({ expressApp: application });
    const login = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'random@mail.com',
        password: 'randomPass',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    const res = await request(app)
      .post(`/api/v1/users/${login.body.user_id}/bookings`)
      .send({
        room_id: 1,
        booking_start: '2021-04-28T11:00:00',
        booking_end: '2021-04-28T11:05:00',
      })
      .set({ Authorization: `Bearer ${login.body.access_token}`, Accept: 'application/json' })
      .expect('Content-Type', /json/);
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Booking must last at least 15 minutes');
    done();
  });

  it('Should return error for a booking in the past', async (done) => {
    const app = await loaders({ expressApp: application });
    const login = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'random@mail.com',
        password: 'randomPass',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    const res = await request(app)
      .post(`/api/v1/users/${login.body.user_id}/bookings`)
      .send({
        room_id: 1,
        booking_start: '2021-04-25T11:00:00',
        booking_end: '2021-04-25T14:05:00',
      })
      .set({ Authorization: `Bearer ${login.body.access_token}`, Accept: 'application/json' })
      .expect('Content-Type', /json/);
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Booking must not be in the past');
    done();
  });

  it('Should return error for a booking outside opening hours', async (done) => {
    const app = await loaders({ expressApp: application });
    const login = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'random@mail.com',
        password: 'randomPass',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    const res = await request(app)
      .post(`/api/v1/users/${login.body.user_id}/bookings`)
      .send({
        room_id: 1,
        booking_start: '2021-04-28T11:00:00',
        booking_end: '2021-04-28T19:00:00',
      })
      .set({ Authorization: `Bearer ${login.body.access_token}`, Accept: 'application/json' })
      .expect('Content-Type', /json/);
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Booking must be within opening hours');
    done();
  });

  it('Should return error for a booking being overlapped', async (done) => {
    const app = await loaders({ expressApp: application });
    const login = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'random@mail.com',
        password: 'randomPass',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    const overlapped_booking = await request(app)
      .post(`/api/v1/users/${login.body.user_id}/bookings`)
      .send({
        room_id: 1,
        booking_start: '2021-12-24T10:00:00',
        booking_end: '2021-12-24T14:00:00',
      })
      .set({ Authorization: `Bearer ${login.body.access_token}`, Accept: 'application/json' })
      .expect('Content-Type', /json/);
    expect(overlapped_booking.status).toEqual(400);
    expect(overlapped_booking.body.message).toEqual('Booking has overlapping reservations');
    done();
  });
});

describe('Testing User functionality: Create New Booking', () => {
  it('Should return new booking id', async (done) => {
    const app = await loaders({ expressApp: application });
    const login = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'random@mail.com',
        password: 'randomPass',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    const res = await request(app)
      .post(`/api/v1/users/${login.body.user_id}/bookings`)
      .send({
        room_id: 1,
        booking_start: '2021-10-30T12:00:00',
        booking_end: '2021-10-30T15:00:00',
      })
      .set({ Authorization: `Bearer ${login.body.access_token}`, Accept: 'application/json' })
      .expect('Content-Type', /json/);
    expect(res.status).toEqual(201);
    expect(res.body.message).toEqual('Booking created successfully');
    expect(res.body.booking_id).toBeDefined();
    await userModel.deleteUserBooking(res.body.booking_id);
    done();
  });
});

describe('Testing User functionality: Get Bookings', () => {
  it('Should return user bookings', async (done) => {
    const app = await loaders({ expressApp: application });
    const login = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'random@mail.com',
        password: 'randomPass',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    const res = await request(app)
      .get(`/api/v1/users/${login.body.user_id}/bookings`)
      .set({ Authorization: `Bearer ${login.body.access_token}`, Accept: 'application/json' })
      .expect('Content-Type', /json/);
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('User bookings listed successfully');
    expect(res.body.data).toBeDefined();
    expect(res.body.data).toBeInstanceOf(Array);
    if (res.body.data.length > 0) {
      expect(res.body.data[0].booking_id).not.toBeNaN();
      expect(res.body.data[0].start).toBeDefined();
      expect(res.body.data[0].timezone).toBeDefined();
    }
    done();
  });
});
