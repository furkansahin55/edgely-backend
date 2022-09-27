const { mintingModel } = require('../models');

/**
 * Returns respective trending table
 * @returns {String}
 */
const getTable = async (timeFrame) => {
  const trendingTable = await mintingModel.getTable(timeFrame);
  return trendingTable;
};

module.exports = {
  getTable,
};
