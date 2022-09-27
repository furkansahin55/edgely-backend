const { trendingModel } = require('../models');

/**
 * Returns respective trending table
 * @returns {String}
 */
const getTable = async (timeFrame) => {
  const trendingTable = await trendingModel.getTable(timeFrame);
  return trendingTable;
};

module.exports = {
  getTable,
};
