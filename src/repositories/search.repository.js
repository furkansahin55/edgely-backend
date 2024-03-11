const httpStatus = require('http-status');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { models } = require('../models');

const getCollections = async (page, pageSize) => {
  try {
    const defaultPageSize = 50; // Default page size if not provided

    const options = {
      where: {
        weight: {
          [Op.not]: null,
        },
      },
      order: [['weight', 'DESC']],
    };

    if (page) {
      // Calculate the offset only if page is provided
      options.limit = pageSize || defaultPageSize;
      options.offset = (page - 1) * (pageSize || defaultPageSize);
    } else {
      // If page is not provided, limit to defaultPageSize
      options.limit = defaultPageSize;
    }

    const collections = await models.collections.findAll(options);

    return collections;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

module.exports = {
  getCollections,
};
