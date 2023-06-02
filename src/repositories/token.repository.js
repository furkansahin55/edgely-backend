const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { models } = require('../models');

const findOne = async (data) => {
  try {
    const token = await models.token.findOne({
      where: data,
    });
    return token;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const create = async (data) => {
  try {
    const token = await models.token.create({
      ...data,
    });
    return token.dataValues;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const remove = async (token) => {
  try {
    const res = await models.token.destroy({
      where: {
        token,
      },
    });
    return res;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

module.exports = {
  create,
  findOne,
  remove,
};
