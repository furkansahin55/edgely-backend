const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { models } = require('../models');

const getByAddress = async (address) => {
  try {
    const lowerAddress = address.toLowerCase();

    const user = await models.users.findOne({
      where: {
        address: lowerAddress,
      },
    });
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const create = async (address) => {
  try {
    const lowerAddress = address.toLowerCase();
    const user = await models.users.create({
      address: lowerAddress,
      premium_finish_date: '2024-05-08 21:07:46.555505+00',
    });
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

module.exports = {
  getByAddress,
  create,
};
