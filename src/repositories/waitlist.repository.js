const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { models } = require('../models');

const create = async (mailAddress) => {
  try {
    const [, created] = await models.waitlist.findOrCreate({
      where: { mail_address: mailAddress },
      defaults: { mail_address: mailAddress },
    });
    if (created) {
      return { message: 'Mail added to waitlist' };
    }
    return { message: 'Mail already in waitlist' };
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

module.exports = {
  create,
};
