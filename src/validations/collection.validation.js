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

const transactionsValidation = {
  params: Joi.object().keys({
    address: Joi.string().required(),
    timeframe: Joi.string().valid('1d', '7d', '90d', '365d', 'all').required(),
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
    timeframe: Joi.string().valid('1d', '7d', '90d', '365d', 'all').required(),
    interval: Joi.number().when(
      'timeframe',
      {
        is: '1d',
        then: Joi.number().valid(5).required(),
      },
      {
        is: '7d',
        then: Joi.number().valid(30).required(),
      },
      {
        is: '90d',
        then: Joi.number().valid(300).required(),
      },
      {
        is: '365d',
        then: Joi.number().valid(1440).required(),
      }
    ),
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
  transactionsValidation,
};
