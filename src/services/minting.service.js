const { mintingRepository } = require('../repositories');

/**
 * Returns respective trending table
 * @returns {Object}
 */
const getMintingTable = async (network, timeFrame) => {
  const trendingTable = await mintingRepository.getMintingTable(network, timeFrame);
  return trendingTable;
};

/**
 * Returns respective trending label table
 * @returns {String}
 */
const getMintingLabelsTable = async (network, timeFrame, user) => {
  const trendingTable = await mintingRepository.getMintingLabelTable(network, timeFrame, user);
  return trendingTable;
};

module.exports = {
  getMintingTable,
  getMintingLabelsTable,
};
