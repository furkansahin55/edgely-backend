const Joi = require('joi');

const addressValidation = {
  params: Joi.object().keys({
    address: Joi.string().required(),
  }),
};

const vpsValidation = {
  params: Joi.object().keys({
    address: Joi.string().required(),
    timeframe: Joi.string().valid('1d', '7d', '90d', 'all').required(),
  }),
};

const feedValidation = {
  query: Joi.object().keys({
    logIndexCursor: Joi.number().integer().required(),
    blockNumberCursor: Joi.number().integer().required(),
    take: Joi.number().integer().required(),
  }),
  params: Joi.object().keys({
    address: Joi.string().required(),
  }),
};

module.exports = {
  addressValidation,
  vpsValidation,
  feedValidation,
};
