const { trendingModel } = require('../models');

const timeFrameToMinutes = { '1m': 1, '15m': 15, '30m': 30, '1h': 60, '12h': 720, '1d': 1440, '3d': 4320, '7d': 10080 };

/**
 * Returns respective trending table
 * @returns {String}
 */
const getTrendingTable = async (timeFrame) => {
  const trendingTable = await trendingModel.getTrendingTable(timeFrame);
  return trendingTable;
};

/**
 * Returns respective trending label table
 * @returns {String}
 */
const getTrendingLabelsTable = async (timeFrame, user) => {
  const trendingTable = await trendingModel.getTrendingLabelTable(timeFrameToMinutes[timeFrame], user);
  return trendingTable;
};

module.exports = {
  getTrendingTable,
  getTrendingLabelsTable,
};
