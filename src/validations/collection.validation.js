const Joi = require('joi');
const { networks } = require('../config/config');

const addressValidation = {
  params: Joi.object().keys({
    address: Joi.string().required(),
  }),

  query: Joi.object().keys({
    network: Joi.string()
      .valid(...networks)
      .required(),
  }),
};

const vpsValidation = {
  params: Joi.object().keys({
    address: Joi.string().required(),
    timeframe: Joi.string().valid('1d', '7d', '90d', 'all').required(),
  }),

  query: Joi.object().keys({
    network: Joi.string()
      .valid(...networks)
      .required(),
  }),
};

const feedValidation = {
  query: Joi.object().keys({
    logIndexCursor: Joi.number().integer().required(),
    blockNumberCursor: Joi.number().integer().required(),
    take: Joi.number().integer().required(),
    network: Joi.string()
      .valid(...networks)
      .required(),
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
