const request = require('supertest');
const httpStatus = require('http-status');
const { ethers } = require('ethers');
const app = require('../../src/app');
const { tokenService } = require('../../src/services');
const { usersModel } = require('../../src/models');
// const app = 'http://localhost:3000';

const privateKey = '010257ecd6d7b79b49df775a7ad8af8789387c8f504a421902e9d8ab5249b2f5';
const wallet = new ethers.Wallet(privateKey);

describe('Collection routes', () => {
  const testSuiteData = {};

  describe('GET /v1/collection/info/:address', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .get('/v1/collection/info/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const address = await wallet.getAddress();
      const user = await usersModel.getByAddress(address.toLowerCase());
      const token = await tokenService.generateAuthTokens(user);
      testSuiteData.token = token.access.token;

      const res = await request(app)
        .get('/v1/collection/info/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d')
        .set('Authorization', `bearer ${token.access.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/collection/24h/:address', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .get('/v1/collection/24h/0x8b44b715004020773e8da1cd730de2f47c7d88b8')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/collection/24h/0x8b44b715004020773e8da1cd730de2f47c7d88b8')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/collection/vps/7d/:address', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .get('/v1/collection/vps/1d/0x8b44b715004020773e8da1cd730de2f47c7d88b8')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/collection/vps/1d/0x8b44b715004020773e8da1cd730de2f47c7d88b8')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/collection/txs/:address', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .get('/v1/collection/txs/0x8b44b715004020773e8da1cd730de2f47c7d88b8')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/collection/txs/0x8b44b715004020773e8da1cd730de2f47c7d88b8')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });
});
