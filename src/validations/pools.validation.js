const Joi = require('joi');

const transactionsValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
  query: Joi.object().keys({
    blockNumberCursor: Joi.number().integer(),
    logIndexCursor: Joi.number().integer(),
    take: Joi.number().integer().required(),
  }),
};

module.exports = {
  transactionsValidation,
};
