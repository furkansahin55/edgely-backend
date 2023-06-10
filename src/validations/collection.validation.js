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
  }),

  query: Joi.object().keys({
    network: Joi.string()
      .valid(...networks)
      .required(),
    timeframe: Joi.string().valid('1d', '7d', '90d', '365d', 'all').required(),
  }),
};

const vpsValidation = {
  params: Joi.object().keys({
    address: Joi.string().required(),
  }),

  query: Joi.object().keys({
    network: Joi.string()
      .valid(...networks)
      .required(),
    timeframe: Joi.string().valid('1', '7', '90', '365', 'all').required(),
    interval: Joi.number()
      .required()
      .when(
        'timeframe',
        {
          is: '1',
          then: Joi.number().valid(5).required(),
        },
        {
          is: '7',
          then: Joi.number().valid(30).required(),
        },
        {
          is: '90',
          then: Joi.number().valid(300).required(),
        },
        {
          is: '365',
          then: Joi.number().valid(1440).required(),
        },
        {
          is: 'all',
          then: Joi.number()
            .valid(1440 * 7)
            .required(),
        }
      ),
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
