const request = require('supertest');
const httpStatus = require('http-status');
const { ethers } = require('ethers');
const app = require('../../src/app');
const { tokenService } = require('../../src/services');
const { usersModel } = require('../../src/models');
// const app = 'http://localhost:3000';

const privateKey = '010257ecd6d7b79b49df775a7ad8af8789387c8f504a421902e9d8ab5249b2f5';
const wallet = new ethers.Wallet(privateKey);

describe('Alerts Routes', () => {
  const testSuiteData = {};

  describe('POST /v1/alerts/add', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .post('/v1/alerts/add')
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
      const user = await usersModel.getByAddress(address.toLowerCase());
      const token = await tokenService.generateAuthTokens(user);
      testSuiteData.token = token.access.token;
      const res = await request(app)
        .post('/v1/alerts/add')
        .send({
          data: {
            name: 'test alert',
            type_id: 0,
            arguments: { address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' },
            delivery_channel_id: 0,
            delivery_arguments: { id: 'test' },
            active: true,
          },
        })
        .set('Authorization', `bearer ${token.access.token}`)
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

  describe('POST /v1/alerts/update', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .post('/v1/alerts/update')
        .send({
          data: { id: testSuiteData.alert.id, name: 'test alert updated' },
        })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .post('/v1/alerts/update')
        .send({
          data: { id: testSuiteData.alert.id, name: 'test alert updated' },
        })
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('POST /v1/alerts/remove', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .post('/v1/alerts/remove')
        .send({
          id: testSuiteData.alert.id,
        })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .post('/v1/alerts/remove')
        .send({
          id: testSuiteData.alert.id,
        })
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
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
});
