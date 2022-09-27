const request = require('supertest');
const httpStatus = require('http-status');
const { ethers } = require('ethers');
const app = require('../../src/app');
const { tokenService } = require('../../src/services');
const { usersModel } = require('../../src/models');
// const app = 'http://localhost:3000';

const privateKey = '010257ecd6d7b79b49df775a7ad8af8789387c8f504a421902e9d8ab5249b2f5';
const wallet = new ethers.Wallet(privateKey);

describe('Minting routes', () => {
  const testSuiteData = {};

  describe('GET /v1/minting/7d', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/minting/7d').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const address = await wallet.getAddress();
      const user = await usersModel.getByAddress(address.toLowerCase());
      const token = await tokenService.generateAuthTokens(user);
      testSuiteData.token = token.access.token;
      const res = await request(app)
        .get('/v1/minting/7d')
        .set('Authorization', `bearer ${token.access.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/minting/3d', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/minting/7d').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/minting/3d')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/minting/1d', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/minting/7d').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/minting/1d')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/minting/12h', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/minting/7d').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/minting/12h')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/minting/1h', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/minting/7d').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/minting/1h')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/minting/30m', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/minting/7d').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/minting/30m')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/minting/15m', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/minting/7d').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/minting/15m')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/minting/1m', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/minting/7d').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/minting/1m')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });
});
