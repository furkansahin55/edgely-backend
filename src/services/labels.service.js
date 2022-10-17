const { labelsModel } = require('../models');

/**
 * Returns labels for given address
 * @returns {Object}
 */
const getLabels = async (address) => {
  const trendingTable = await labelsModel.getLabels(address);
  return trendingTable;
};

/**
 * Upsert given labels for given address
 * @returns {Object}
 */
const upsertLabels = async (address, data) => {
  data.forEach((element) => {
    // eslint-disable-next-line no-param-reassign
    element.user = address;
  });
  await labelsModel.deleteLabels(address);
  await labelsModel.insertLabels(data);
  return true;
};

module.exports = {
  getLabels,
  upsertLabels,
};
