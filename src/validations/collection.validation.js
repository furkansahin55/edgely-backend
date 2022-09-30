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
    skip: Joi.number().integer(),
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
