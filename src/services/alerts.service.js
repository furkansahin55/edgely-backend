const { alertsRepository } = require('../repositories');

/**
 * Returns alerts for given address
 * @param {String} address
 * @returns {Object}
 */
const getAlertsByUser = async (user) => {
  const result = await alertsRepository.getAlertsByUser(user);
  return result;
};

/**
 * create alert
 * @param {Object} data
 * @param {String} user
 * @returns {Object}
 */
const createAlert = async (data, user) => {
  // eslint-disable-next-line no-param-reassign
  data.user = user;
  const result = await alertsRepository.createAlert(data);
  return result.dataValues;
};

/**
 * Delete alert
 * @returns {Object}
 */
const deleteAlert = async (id, user) => {
  await alertsRepository.deleteAlert(id, user);
  return true;
};

/**
 * Get alert types
 *  @param {String} user
 * @param {String} id
 * @returns {Object}
 */
const getAlertTypes = async () => {
  const result = await alertsRepository.getAlertTypes();
  return result;
};

/**
 * Get delivery channel types
 * @param {String} user
 * @param {String} id
 * @returns {Object}
 */
const getDeliveryChannelTypes = async () => {
  const result = await alertsRepository.getDeliveryChannelTypes();
  return result;
};

/**
 * Update alert
 * @returns {Object}
 * @param {Object} data
 * @param {String} user
 * @param {String} id
 * */
const updateAlert = async (user, data) => {
  const result = await alertsRepository.updateAlert(user, data);
  return result;
};

module.exports = {
  getAlertsByUser,
  createAlert,
  deleteAlert,
  getDeliveryChannelTypes,
  getAlertTypes,
  updateAlert,
};
