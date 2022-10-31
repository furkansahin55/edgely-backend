const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PrismaClientSingleton = require('../utils/PrismaClient');
require('../utils/bigIntPatch');

const prisma = new PrismaClientSingleton();

const alertSelectList = {
  id: true,
  name: true,
  type_id: true,
  arguments: true,
  delivery_channel_id: true,
  delivery_arguments: true,
  active: true,
};

const getAlertsByUser = async (user) => {
  try {
    // get alerts by user excluding user address column
    const result = await prisma.alerts.findMany({
      where: { user },
      select: alertSelectList,
    });
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const createAlert = async (data) => {
  try {
    const created = await prisma.alerts.create({
      data,
      select: alertSelectList,
    });
    return created;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const deleteAlert = async (id, user) => {
  try {
    // check if alert exists and belongs to user
    const alert = await prisma.alerts.findUnique({
      where: { id },
    });
    if (!alert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Alert not found');
    }
    if (alert.user !== user) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Alert does not belong to user');
    }
    // delete alert
    await prisma.alerts.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
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
    const alert = await prisma.alerts.findUnique({
      where: { id: data.id },
    });
    if (!alert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Alert not found');
    }
    if (alert.user !== user) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Alert does not belong to user');
    }
    // update alert
    const updated = await prisma.alerts.update({
      where: { id: data.id },
      data,
      select: alertSelectList,
    });
    return updated;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getAlertTypes = async () => {
  try {
    const result = await prisma.alerts_types.findMany({});
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getDeliveryChannelTypes = async () => {
  try {
    const result = await prisma.alerts_delivery_channels.findMany({});
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
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
