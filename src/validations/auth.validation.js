const Joi = require('joi');

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const nonce = {
  body: Joi.object().keys({
    message: Joi.object({
      domain: Joi.string().required(),
      address: Joi.string().hex().length(42).required(),
      statement: Joi.string().required(),
      uri: Joi.string().uri().required(),
      version: Joi.string().required(),
      chainId: Joi.number().integer().required(),
      nonce: Joi.string().required(),
      issuedAt: Joi.string().isoDate().required(),
    }).required(),
    signature: Joi.string().required(),
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
