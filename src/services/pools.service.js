const { poolsRepository } = require('../repositories');

/**
 * Get last 100 liquidity event
 * @returns {Object}
 */
const getLiquidityEvents = async () => {
  const result = await poolsRepository.getLiquidityEvents();
  return result;
};

/**
 * Get last 100 new pools
 * @returns {Object}
 */
const getNewPools = async () => {
  const result = await poolsRepository.getNewPools();
  return result;
};

/**
 * Gets the transactions with given cursors
 * if blockNumberCursor   smaller than 0 means get the last page of feeds
 * if blockNumberCursor equals to 0 means get the first page of feeds
 * Else get feeds by using cursors
 * @param {String} address
 * @param {*} blockNumberCursor
 * @param {*} logIndexCursor
 * @param {*} take
 * @returns {Object}
 */
const getTransactions = async (address, blockNumberCursor, logIndexCursor, take) => {
  const result = await poolsRepository.getTransactions(address, blockNumberCursor, logIndexCursor, take);
  return result;
};

module.exports = {
  getLiquidityEvents,
  getNewPools,
  getTransactions,
};
