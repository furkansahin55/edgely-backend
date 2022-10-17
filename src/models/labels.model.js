const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PrismaClientSingleton = require('../utils/PrismaClient');
require('../utils/bigIntPatch');

const prisma = new PrismaClientSingleton();

const getLabels = async (address) => {
  try {
    const result = await prisma.labels.findMany({
      where: {
        user: address,
      },
      select: {
        address: true,
        type: true,
      },
    });
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const insertLabels = async (data) => {
  try {
    await prisma.labels.createMany({
      data,
    });
    return true;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const deleteLabels = async (user) => {
  try {
    await prisma.labels.deleteMany({
      where: { user },
    });
    return true;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

module.exports = {
  getLabels,
  insertLabels,
  deleteLabels,
};
