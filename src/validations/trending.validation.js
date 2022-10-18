const Joi = require('joi');

const trendingTable = {
  params: Joi.object().keys({
    timeFrame: Joi.string().valid('1m', '15m', '30m', '1h', '12h', '1d').required(),
  }),
};

module.exports = {
  trendingTable,
};
