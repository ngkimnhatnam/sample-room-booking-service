// Dependencies import
import request from 'supertest';
import express from 'express';

// Initiate Express app
import loaders from '../loaders/index';
const application = express();

// Helper import
import * as authenticationHelper from '../helpers/authentication';

describe('Testing Auth Helper functions: Create Hash Password', () => {
  it('Should return a hashed string', async () => {
    const password = 'Password to be hashed';
    const result = await authenticationHelper.createPasswordHash(password);
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect(result).not.toEqual(password);
  });
});

describe('Testing Auth Helper functions: Validate passwords', () => {
  it('Should return true when same password', async () => {
    const password = 'Password to be hashed';
    const hashed_pass = await authenticationHelper.createPasswordHash(password);
    const validationResult = await authenticationHelper.validatePasswordHash(password, hashed_pass);
    expect(validationResult).toBeDefined();
    expect(validationResult).not.toBeNull();
    expect(validationResult).toBeTruthy();
  });

  it('Should return false when different password', async () => {
    const password = 'Password to be hashed';
    const wrong_pass = 'This is the wrong pass';
    const hashed_pass = await authenticationHelper.createPasswordHash(password);
    const validationResult = await authenticationHelper.validatePasswordHash(wrong_pass, hashed_pass);
    expect(validationResult).toBeDefined();
    expect(validationResult).not.toBeNull();
    expect(validationResult).toBeFalsy();
  });
});

describe('Testing login route endpoint', () => {
  it('Should return a response', async (done) => {
    const app = await loaders({ expressApp: application });
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'wrong@mail.com',
        password: 'whateverpassword',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    expect(res.status).toEqual(401);
    expect(res.body.message).toBeDefined();
    expect(res.body.message).not.toBeNull();
    expect(res.body.message).toEqual('Email or password incorrect');
    done();
  });

  it('Should return a response with success message and JWT', async (done) => {
    const app = await loaders({ expressApp: application });
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'random@mail.com',
        password: 'randomPass',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    expect(res.status).toEqual(200);
    expect(res.body.message).toBeDefined();
    expect(res.body.message).not.toBeNull();
    expect(res.body.message).toEqual('User logged in successfully');
    expect(res.body.access_token).toBeDefined();
    done();
  });
});
