const request = require('supertest');
const httpStatus = require('http-status');
const { ethers } = require('ethers');
const { tokenService } = require('../../src/services');
const { usersRepository } = require('../../src/repositories');
const testConstants = require('./testConstants');

const app = 'http://localhost:3000';
//const app = require('../../src/app');

const { privateKey } = testConstants;
const wallet = new ethers.Wallet(privateKey);

describe('Minting routes', () => {
  const testSuiteData = {};

  describe('GET /v1/minting/1440', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/minting/1440?network=ethereum').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const address = await wallet.getAddress();
      const user = await usersRepository.getByAddress(address.toLowerCase());
      const token = await tokenService.generateAuthTokens(user);
      testSuiteData.token = token.access.token;
      const res = await request(app)
        .get('/v1/minting/1440?network=ethereum')
        .set('Authorization', `bearer ${token.access.token}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/minting/labels/1440', () => {
    test('should return unauthorized without token', async () => {
      const res = await request(app).get('/v1/minting/labels/1440?network=ethereum').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return OK', async () => {
      const res = await request(app)
        .get('/v1/minting/labels/1440?network=ethereum')
        .set('Authorization', `bearer ${testSuiteData.token}`)
        .expect(httpStatus.OK);
    });
  });
});
