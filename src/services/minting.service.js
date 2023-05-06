const { mintingRepository } = require('../repositories');

const timeFrameToMinutes = { '1m': 1, '15m': 15, '30m': 30, '1h': 60, '12h': 720, '1d': 1440, '3d': 4320, '7d': 10080 };

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
