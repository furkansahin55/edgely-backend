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

describe('Labels Routes', () => {
  const testSuiteData = {};

  describe('POST /v1/labels', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app)
        .post('/v1/labels')
        .send({
          data: [
            { network: 'ethereum', address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', type: 0 },
            { network: 'ethereum', address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', type: 1 },
          ],
        })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const address = await wallet.getAddress();
      const user = await usersRepository.getByAddress(address.toLowerCase());
      const token = await tokenService.generateAuthTokens(user);
      testSuiteData.token = token.access.token;
      const res = await request(app)
        .post('/v1/labels')
        .send({
          data: [
            { network: 'ethereum', address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', type: 0 },
            { network: 'ethereum', address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', type: 1 },
          ],
        })
        .set('Authorization', `bearer ${token.access.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/labels', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/labels').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/labels')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });
});
