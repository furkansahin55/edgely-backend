const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { models } = require('../models');

const alertSelectList = ['id', 'name', 'type_id', 'arguments', 'delivery_channel_id', 'delivery_arguments', 'active'];

const getAlertsByUser = async (user) => {
  try {
    // get alerts by user excluding user address column
    const result = await models.alerts.findAll({
      where: { user },
      attributes: alertSelectList,
    });
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

// TODO: select only necessary fields
const createAlert = async (data) => {
  try {
    const created = await models.alerts.create({
      ...data,
    });
    return created;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const deleteAlert = async (id, user) => {
  try {
    // check if alert exists and belongs to user
    const alert = await models.alerts.findOne({
      where: { id },
    });
    if (!alert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Alert not found');
    }
    if (alert.user !== user) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Alert does not belong to user');
    }
    // delete alert
    await models.alerts.destroy({
      where: { id },
    });
    return true;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

/** update alert
 * @returns {Object}
 * @param {Object} data
 * @param {String} id
 */
const updateAlert = async (user, data) => {
  try {
    // check if alert exists and belongs to user
    const alert = await models.alerts.findOne({
      where: { id: data.id },
    });
    if (!alert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Alert not found');
    }
    if (alert.user !== user) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Alert does not belong to user');
    }
    // update alert
    const updated = await models.alerts.update(
      {
        data,
      },
      {
        where: { id: data.id },
        returning: alertSelectList,
      }
    );
    return updated;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getAlertTypes = async () => {
  try {
    const result = await models.alert_types.findAll();
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getDeliveryChannelTypes = async () => {
  try {
    const result = await models.alert_delivery_channels.findAll();
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

module.exports = {
  getAlertsByUser,
  createAlert,
  deleteAlert,
  getAlertTypes,
  getDeliveryChannelTypes,
  updateAlert,
};
