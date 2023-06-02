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

describe('Alerts Routes', () => {
  const testSuiteData = {};

  describe('POST /v1/alerts', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .post('/v1/alerts')
        .send({
          data: {
            name: 'test alert',
            type: 0,
            arguments: { address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' },
            delivery_type: 0,
            delivery_arguments: { id: 'test' },
            active: true,
            user: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
          },
        })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const address = await wallet.getAddress();
      const user = await usersRepository.getByAddress(address.toLowerCase());
      const token = await tokenService.generateAuthTokens(user);
      testSuiteData.token = token.access.token;
      const res = await request(app)
        .post('/v1/alerts')
        .send({
          data: {
            name: 'test alert',
            network: 'ethereum',
            type_id: 0,
            arguments: { address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' },
            delivery_channel_id: 0,
            delivery_arguments: { id: 'test' },
            active: true,
          },
        })
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
      testSuiteData.alert = res.body;
    });
  });

  describe('GET /v1/alerts', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/alerts').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/alerts')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('PUT /v1/alerts', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .put('/v1/alerts')
        .send({
          data: { id: testSuiteData.alert.id, name: 'test alert updated' },
        })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .put('/v1/alerts')
        .send({
          data: { id: testSuiteData.alert.id, name: 'test alert updated' },
        })
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('DELETE /v1/alerts', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).delete(`/v1/alerts/${testSuiteData.alert.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .delete(`/v1/alerts/${testSuiteData.alert.id}`)
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/alerts/types', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/alerts/types').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/alerts/types')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/alerts/deliver_channel_types', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/alerts/deliver_channel_types').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/alerts/deliver_channel_types')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });
});
