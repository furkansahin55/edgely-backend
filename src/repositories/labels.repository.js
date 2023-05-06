const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { models } = require('../models');

const getLabels = async (address) => {
  try {
    const result = await models.labels.findAll({
      where: {
        user: address,
      },
      attributes: ['address', 'type'],
    });
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const insertLabels = async (data) => {
  try {
    await models.labels.bulkCreate(data);
    return true;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const deleteLabels = async (user) => {
  try {
    await models.labels.destroy({
      where: { user },
    });
    return true;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

module.exports = {
  getLabels,
  insertLabels,
  deleteLabels,
};
