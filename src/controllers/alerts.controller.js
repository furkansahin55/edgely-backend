const catchAsync = require('../utils/catchAsync');
const { alertService } = require('../services');

const getAlertsByUser = catchAsync(async (req, res) => {
  const result = await alertService.getAlertsByUser(req.user.address);
  res.send(result);
});

const createAlert = catchAsync(async (req, res) => {
  const { data } = req.body;
  const result = await alertService.createAlert(data, req.user.address);
  res.send(result);
});

const deleteAlert = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await alertService.deleteAlert(id, req.user.address);
  res.send(result);
});

const getAlertTypes = catchAsync(async (req, res) => {
  const result = await alertService.getAlertTypes();
  res.send(result);
});

const getDeliveryChannelTypes = catchAsync(async (req, res) => {
  const result = await alertService.getDeliveryChannelTypes();
  res.send(result);
});

/**
 * update alert
 * @param {Object} data
 * @param {String} user
 * @param {String} id
 * @returns {Object}
 */
const updateAlert = catchAsync(async (req, res) => {
  const { data } = req.body;
  const result = await alertService.updateAlert(req.user.address, data);
  res.send(result);
});

module.exports = {
  getAlertsByUser,
  createAlert,
  deleteAlert,
  getDeliveryChannelTypes,
  getAlertTypes,
  updateAlert,
};
