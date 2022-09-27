const request = require('supertest');
const httpStatus = require('http-status');
const { ethers } = require('ethers');
const app = require('../../src/app');
// const app = 'http://localhost:3000';

const privateKey = '010257ecd6d7b79b49df775a7ad8af8789387c8f504a421902e9d8ab5249b2f5';
const wallet = new ethers.Wallet(privateKey);

describe('Auth routes', () => {
  const testSuiteData = {};

  describe('GET /v1/auth/nonce', () => {
    test('should return nonce successfully', async () => {
      const res = await request(app).get('/v1/auth/nonce').expect(httpStatus.OK);
      expect(res.body).toEqual({ nonce: expect.anything() });
      testSuiteData.nonce = res;
    });
  });

  describe('POST /v1/auth/login', () => {
    test('should verify nonce successfully', async () => {
      const resNonce = testSuiteData.nonce;
      const signedNonce = await wallet.signMessage(resNonce.body.nonce);
      const address = await wallet.getAddress();
      const signedNonceRequest = {
        message: resNonce.body.nonce,
        signed: signedNonce,
        address,
      };
      const res = await request(app).post('/v1/auth/login').send(signedNonceRequest).expect(httpStatus.OK);

      expect(res.body.user).toEqual({
        address: address.toLowerCase(),
        premium_finish_timestamp: expect.anything(),
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
      testSuiteData.tokens = res.body.tokens;
    });
  });

  describe('POST /v1/auth/refresh-tokens', () => {
    test('should return 200 and new auth tokens if refresh token is valid', async () => {
      const res = await request(app)
        .post('/v1/auth/refresh-tokens')
        .send({ refreshToken: testSuiteData.tokens.refresh.token });

      expect(res.body).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });
  });

  describe('POST /v1/auth/logout', () => {
    test('should return 204 if refresh token is valid', async () => {
      await request(app)
        .post('/v1/auth/logout')
        .send({ refreshToken: testSuiteData.tokens.refresh.token })
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if refresh token is missing from request body', async () => {
      await request(app).post('/v1/auth/logout').send().expect(httpStatus.BAD_REQUEST);
    });
  });
});
