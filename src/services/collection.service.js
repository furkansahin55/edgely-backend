const httpStatus = require('http-status');
const { collectionRepository } = require('../repositories');
const ApiError = require('../utils/ApiError');

/**
 * Returns collection info of given address
 * @returns {String}
 */
const getCollectionInfo = async (network, address) => {
  const collectionInfo = await collectionRepository.getCollectionInfo(network, address);
  if (!collectionInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Collection not found');
  }
  return collectionInfo;
};

const get24hInfo = async (network, address) => {
  const metrics = await collectionRepository.get24hInfo(network, address);
  return metrics;
};

const getVpsGraph = async (network, timeframe, address) => {
  const metrics = await collectionRepository.getVpsGraph(network, timeframe, address);
  return metrics;
};

const getTransactions = async (network, address, timeframe) => {
  const transactions = await collectionRepository.getTransactions(network, address, timeframe);
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
const getFeeds = async (network, address, blockNumberCursor, logIndexCursor, take) => {
  if (blockNumberCursor < 0) {
    const feed = await collectionRepository.getLastFeedPage(network, address, take);
    return feed;
  }
  if (blockNumberCursor === 0) {
    const feed = await collectionRepository.getFirstFeedPage(network, address, take);
    return feed;
  }

  const feed = await collectionRepository.getFeed(network, address, blockNumberCursor, logIndexCursor, take);
  return feed;
};

const getMintsChart = async (network, address) => {
  const result = await collectionRepository.getMintsChart(network, address);
  return result;
};

const getMintsTable = async (network, address) => {
  const result = await collectionRepository.getMintsTable(network, address);
  return result;
};

const getHoldersChartByCount = async (network, address) => {
  const result = await collectionRepository.getHoldersChartByCount(network, address);
  return result;
};

const getHoldersChartByDays = async (network, address) => {
  const result = await collectionRepository.getHoldersChartByDays(network, address);
  return result;
};

const getRelationsWithCollection = async (network, address) => {
  const result = await collectionRepository.getRelationsWithCollections(network, address);
  return result;
};

const searchCollections = async (query) => {
  const result = await collectionRepository.searchCollections(query);
  return result;
};

const getHolders = async (network, address) => {
  const result = await collectionRepository.getHolders(network, address);
  return result;
};

const getBlockNumber = async (network) => {
  const result = await collectionRepository.getBlockNumber(network);
  return result;
};

const getHoldersActions = async (network, address) => {
  const result = await collectionRepository.getHoldersActions(network, address);
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
  searchCollections,
  getHolders,
  getBlockNumber,
  getHoldersActions,
};
