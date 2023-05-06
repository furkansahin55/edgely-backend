const request = require('supertest');
const httpStatus = require('http-status');
const { ethers } = require('ethers');
const { tokenService } = require('../../src/services');
const { usersRepository } = require('../../src/repositories');
const testConstants = require('./testConstants');

const app = 'http://localhost:3000';
// const app = require('../../src/app');

const { privateKey } = testConstants;
const wallet = new ethers.Wallet(privateKey);

describe('Collection routes', () => {
  const testSuiteData = {};

  beforeAll(async () => {
    const address = await wallet.getAddress();
    const user = await usersRepository.getByAddress(address.toLowerCase());
    const token = await tokenService.generateAuthTokens(user);
    testSuiteData.token = token.access.token;
  });

  describe('GET /v1/collection/info/:address', () => {
    test('should return unauthorized without token', async () => {
      await request(app)
        .get('/v1/collection/info/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d?network=ethereum')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      await request(app)
        .get('/v1/collection/info/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d?network=ethereum')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/collection/24h/:address', () => {
    test('should return unauthorized without token', async () => {
      await request(app)
        .get('/v1/collection/24h/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      await request(app)
        .get('/v1/collection/24h/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/collection/vps/7d/:address', () => {
    test('should return unauthorized without token', async () => {
      await request(app)
        .get('/v1/collection/vps/1d/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      await request(app)
        .get('/v1/collection/vps/1d/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/collection/txs/:address', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .get('/v1/collection/txs/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/collection/txs/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/collection/feed/:address', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .get('/v1/collection/feed/0x8b44b715004020773e8da1cd730de2f47c7d88b8?take=10&logIndexCursor=0&blockNumberCursor=0&network=ethereum')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/collection/feed/0x8b44b715004020773e8da1cd730de2f47c7d88b8?take=10&logIndexCursor=0&blockNumberCursor=0&network=ethereum')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/collection/mints/chart/:address', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .get('/v1/collection/mints/chart/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/collection/mints/chart/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/collection/mints/table/:address', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .get('/v1/collection/mints/table/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/collection/mints/table/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/collection/holders/chart/count/:address', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .get('/v1/collection/holders/chart/count/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/collection/holders/chart/count/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/collection/holders/chart/days/:address', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .get('/v1/collection/holders/chart/days/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/collection/holders/chart/days/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/collection/relations/collection/:address', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .get('/v1/collection/relations/collection/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/collection/relations/collection/0x8b44b715004020773e8da1cd730de2f47c7d88b8?network=ethereum')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });
});
