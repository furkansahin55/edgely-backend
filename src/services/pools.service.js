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

module.exports = {
  getLiquidityEvents,
  getNewPools,
};
