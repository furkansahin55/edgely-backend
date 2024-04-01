const { poolsRepository } = require('../repositories');

/**
 * Get last 100 liquidity event
 * @returns {Object}
 */
const getLiquidityEvents = async () => {
  const result = await poolsRepository.getLiquidityEvents();
  return result;
};

module.exports = {
  getLiquidityEvents,
};
