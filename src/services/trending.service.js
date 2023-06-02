const { trendingRepository } = require('../repositories');

/**
 * Returns respective trending table
 * @returns {String}
 */
const getTrendingTable = async (network, timeFrame) => {
  const trendingTable = await trendingRepository.getTrendingTable(network, timeFrame);
  return trendingTable;
};

/**
 * Returns respective trending label table
 * @returns {String}
 */
const getTrendingLabelsTable = async (network, timeFrame, user) => {
  const trendingTable = await trendingRepository.getTrendingLabelTable(network, timeFrame, user);
  return trendingTable;
};

module.exports = {
  getTrendingTable,
  getTrendingLabelsTable,
};
