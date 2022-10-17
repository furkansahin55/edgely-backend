const Joi = require('joi');

const labelsUpsert = {
  body: Joi.object().keys({
    data: Joi.array().items(
      Joi.object().keys({
        address: Joi.string().length(42).required(),
        type: Joi.number().valid(0, 1).required(),
      })
    ),
  }),
};

module.exports = {
  labelsUpsert,
};
