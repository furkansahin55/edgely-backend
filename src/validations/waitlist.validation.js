const Joi = require('joi');

const waitlistCreate = {
  body: Joi.object().keys({
    mail_address: Joi.string().email().required(),
  }),
};

module.exports = {
  waitlistCreate,
};
