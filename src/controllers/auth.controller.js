const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { web3AuthService, tokenService } = require('../services');

const getNonce = catchAsync(async (req, res) => {
  const nonce = web3AuthService.getNonce();
  const msg = `I want to login with my wallet. \nNonce: ${nonce}`;
  res.send({ nonce: msg });
});

const verifyNonce = catchAsync(async (req, res) => {
  const { message, signed, address } = req.body;
  web3AuthService.verifyNonce(message, signed, address);
  const user = await web3AuthService.loginWithSignVerifiedAddress(address);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await web3AuthService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const logout = catchAsync(async (req, res) => {
  await web3AuthService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getNonce,
  verifyNonce,
  refreshTokens,
  logout,
};
