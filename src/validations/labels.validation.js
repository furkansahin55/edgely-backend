const Joi = require('joi');
const { networks } = require('../config/config');

const labelsUpsert = {
  body: Joi.object().keys({
    data: Joi.array().items(
      Joi.object().keys({
        network: Joi.string()
          .valid(...networks)
          .required(),
        address: Joi.string().length(42).required(),
        type: Joi.number().valid(0, 1).required(),
      })
    ),
  }),
};

const getAdresses = {
  query: Joi.object().keys({
    network: Joi.string()
      .valid(...networks)
      .required(),
  }),
};

module.exports = {
  labelsUpsert,
  getAdresses,
};
