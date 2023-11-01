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

const searchValidation = {
  query: Joi.object().keys({
    query: Joi.string().required(),
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
    timeframe: Joi.string().valid('1', '7', '90', '365', 'all').required(),
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
    timeframe: Joi.string().valid('1', '7', '30', '90', '365', 'all').required(),
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

const blockNumberValidation = {
  query: Joi.object().keys({
    network: Joi.string()
      .valid(...networks)
      .required(),
  }),
};

module.exports = {
  addressValidation,
  vpsValidation,
  feedValidation,
  transactionsValidation,
  searchValidation,
  blockNumberValidation,
};
