const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const ethers = require('ethers');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { usersRepository, tokenRepository } = require('../repositories');
const { tokenTypes } = require('../config/tokens');
const tokenService = require('./token.service');

/**
 * Create a nonce and return it
 * @returns {String}
 */
const getNonce = () => {
  const nonce = jwt.sign(
    {
      date: Date.now(),
    },
    config.jwt.secret,
    { expiresIn: config.jwt.nonceExpiration }
  );

  return nonce;
};

/**
 * Verifies if message signed by given address then verifies nonce to check if timed out
 * @param {String} message
 * @param {String} signed
 * @param {String} address
 * @returns {String}
 */
const verifyNonce = (message, signed, address) => {
  try {
    const signedByAddress = ethers.utils.verifyMessage(message, signed);
    if (signedByAddress.toLowerCase() !== address.toLowerCase()) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Message not signed by provided address');
    }
    const nonce = message.split('Nonce: ')[1];
    jwt.verify(nonce, config.jwt.secret);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Signature not valid or token expired');
  }
};

/**
 * Login with given address retrieve user row or create new if not found
 * @param {String} address
 */
const loginWithSignVerifiedAddress = async (address) => {
  let user = await usersRepository.getByAddress(address);
  if (!user) {
    user = await usersRepository.create(address);
  }
  return user.dataValues;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await usersRepository.getByAddress(refreshTokenDoc.user);
    if (!user) {
      throw new Error('User no');
    }
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    if (error.message) throw new ApiError(httpStatus.UNAUTHORIZED, error.message);
    else throw new ApiError(httpStatus.UNAUTHORIZED, 'Error');
  }
};

/**
 * Logout
 * @param {String} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await tokenRepository.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await tokenRepository.remove(refreshTokenDoc.token);
};

module.exports = {
  getNonce,
  verifyNonce,
  loginWithSignVerifiedAddress,
  refreshAuth,
  logout,
};
