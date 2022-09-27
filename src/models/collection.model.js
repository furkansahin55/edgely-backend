const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PrismaClientSingleton = require('../utils/PrismaClient');
require('../utils/bigIntPatch');

const prisma = new PrismaClientSingleton();

const getCollectionInfo = async (address) => {
  try {
    const result = await prisma.overview_info.findUnique({
      where: {
        address,
      },
    });
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const get24hMetrics = async (address) => {
  try {
    const result = await prisma.overview_24h.findUnique({
      where: {
        address,
      },
    });
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getVpsMetrics = async (timeframe, address) => {
  try {
    const result = await prisma[`overview_detailed_${timeframe}`].findMany({
      where: {
        address,
      },
    });
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getTransactions = async (address) => {
  try {
    const result = await prisma.overview_txs.findMany({
      take: 1000,
      where: {
        address,
      },
    });
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

module.exports = {
  getCollectionInfo,
  get24hMetrics,
  getVpsMetrics,
  getTransactions,
};
