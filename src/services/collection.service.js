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

const get24hInfo = async (address) => {
  const metrics = await collectionModel.get24hInfo(address);
  return metrics;
};

const getVpsGraph = async (timeframe, address) => {
  const metrics = await collectionModel.getVpsGraph(timeframe, address);
  return metrics;
};

const getTransactions = async (address) => {
  const transactions = await collectionModel.getTransactions(address);
  return transactions;
};

/**
 * Gets the feed rows with given cursors
 * if blockNumberCursor smaller than 0 means get the last page of feeds
 * if blockNumberCursor equals to 0 means get the first page of feeds
 * Else get feeds by using cursors
 * @param {String} address
 * @param {*} blockNumberCursor
 * @param {*} logIndexCursor
 * @param {*} take
 * @returns {Object}
 */
const getFeeds = async (address, blockNumberCursor, logIndexCursor, take) => {
  if (blockNumberCursor < 0) {
    const feed = await collectionModel.getLastFeedPage(address, take);
    return feed;
  }
  if (blockNumberCursor === 0) {
    const feed = await collectionModel.getFirstFeedPage(address, take);
    return feed;
  }

  const feed = await collectionModel.getFeed(address, blockNumberCursor, logIndexCursor, take);
  return feed;
};

const getMintsChart = async (address) => {
  const result = await collectionModel.getMintsChart(address);
  return result;
};

const getMintsTable = async (address) => {
  const result = await collectionModel.getMintsTable(address);
  return result;
};

const getHoldersChartByCount = async (address) => {
  const result = await collectionModel.getHoldersChartByCount(address);
  return result;
};

const getHoldersChartByDays = async (address) => {
  const result = await collectionModel.getHoldersChartByDays(address);
  return result;
};

const getRelationsWithCollection = async (address) => {
  const result = await collectionModel.getRelationsWithCollections(address);
  return result;
};

module.exports = {
  getCollectionInfo,
  get24hInfo,
  getVpsGraph,
  getTransactions,
  getFeeds,
  getMintsChart,
  getMintsTable,
  getHoldersChartByCount,
  getHoldersChartByDays,
  getRelationsWithCollection,
};
