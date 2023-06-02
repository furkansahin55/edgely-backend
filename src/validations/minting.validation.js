const Joi = require('joi');
const { networks } = require('../config/config');

const mintingTable = {
  params: Joi.object().keys({
    timeFrame: Joi.number().valid(1, 15, 30, 60, 720, 1440).required(),
  }),

  query: Joi.object().keys({
    network: Joi.string()
      .valid(...networks)
      .required(),
  }),
};

module.exports = {
  mintingTable,
};
