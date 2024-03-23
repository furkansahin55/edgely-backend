const Joi = require('joi');

const searchValidation = {
  params: Joi.object({
    text: Joi.string().min(1).required(),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).default(25),
  }),
};

module.exports = {
  searchValidation,
};
