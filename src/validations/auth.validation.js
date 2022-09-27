const Joi = require('joi');

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const nonce = {
  body: Joi.object().keys({
    message: Joi.string().required(),
    signed: Joi.string().required(),
    address: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  refreshTokens,
  nonce,
  logout,
};
