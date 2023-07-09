const { labelsRepository } = require('../repositories');

/**
 * Returns labels for given address
 * @returns {Object}
 */
const getLabels = async (address) => {
  const result = await labelsRepository.getLabels(address);
  return result;
};

/**
 * Upsert given labels for given address
 * @returns {Object}
 */
const upsertLabels = async (address, data) => {
  data.forEach((element) => {
    // eslint-disable-next-line no-param-reassign
    element.user = address;
    // eslint-disable-next-line no-param-reassign
    element.address = element.address.toLowerCase();
  });
  await labelsRepository.deleteLabels(address);
  await labelsRepository.insertLabels(data);
  return true;
};

module.exports = {
  getLabels,
  upsertLabels,
};
