const httpStatus = require('http-status');
const { collectionModel } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Returns collection info of given address
 * @returns {String}
 */
const getCollectionInfo = async (address) => {
  const collectionInfo = await collectionModel.getCollectionInfo(address);
  if (!collectionInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Collection not found');
  }
  return collectionInfo;
};

const get24hMetrics = async (address) => {
  const metrics = await collectionModel.get24hMetrics(address);
  return metrics;
};

const getVpsMetrics = async (timeframe, address) => {
  const metrics = await collectionModel.getVpsMetrics(timeframe, address);
  return metrics;
};

const getTransactions = async (address) => {
  const transactions = await collectionModel.getTransactions(address);
  return transactions;
};

module.exports = {
  getCollectionInfo,
  get24hMetrics,
  getVpsMetrics,
  getTransactions,
};
