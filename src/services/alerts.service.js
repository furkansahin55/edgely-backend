const { alertsModel } = require('../models');

/**
 * Returns alerts for given address
 * @param {String} address
 * @returns {Object}
 */
const getAlertsByUser = async (user) => {
  const result = await alertsModel.getAlertsByUser(user);
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
  const result = await alertsModel.createAlert(data);
  return result;
};

/**
 * Delete alert
 * @returns {Object}
 */
const deleteAlert = async (id, user) => {
  await alertsModel.deleteAlert(id, user);
  return true;
};

/**
 * Get alert types
 *  @param {String} user
 * @param {String} id
 * @returns {Object}
 */
const getAlertTypes = async () => {
  const result = await alertsModel.getAlertTypes();
  return result;
};

/**
 * Get delivery channel types
 * @param {String} user
 * @param {String} id
 * @returns {Object}
 */
const getDeliveryChannelTypes = async () => {
  const result = await alertsModel.getDeliveryChannelTypes();
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
  const result = await alertsModel.updateAlert(user, data);
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
