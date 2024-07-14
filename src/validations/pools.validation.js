const Joi = require('joi');

const transactionsValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
  query: Joi.object().keys({
    blockNumberCursor: Joi.number().integer().optional(),
    logIndexCursor: Joi.number().integer().optional(),
    take: Joi.number().integer().required(),
  }),
};

module.exports = {
  transactionsValidation,
};
