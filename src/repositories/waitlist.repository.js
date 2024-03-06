const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { models } = require('../models');

const create = async (mailAddress) => {
  try {
    const user = await models.waitlist.create({
      mail_address: mailAddress,
    });
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

module.exports = {
  create,
};
