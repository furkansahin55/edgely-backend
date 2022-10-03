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

const getFeed = async (address, blockNumberCursor, logIndexCursor, take) => {
  try {
    const resultObj = {};
    if (take >= 0) {
      const takePlusOne = take + 1;
      const queryResult =
        await prisma.$queryRaw`SELECT DISTINCT ON (block_number, log_index) feed.* FROM feed WHERE address = ${address} AND (block_number, log_index) < (${blockNumberCursor}, ${logIndexCursor}) ORDER BY block_number DESC, log_index DESC LIMIT ${takePlusOne}`;
      if (queryResult.length === takePlusOne) {
        resultObj.hasNext = true;
        resultObj.hasPrevious = true;
        queryResult.pop();
        resultObj.rows = queryResult;
      } else {
        resultObj.hasNext = false;
        resultObj.hasPrevious = true;
        resultObj.rows = queryResult;
      }
    } else {
      const takePlusOne = Math.abs(take) + 1;
      const queryResult =
        await prisma.$queryRaw`SELECT DISTINCT ON (block_number, log_index) feed.* FROM feed WHERE address = ${address} AND (block_number, log_index) > (${blockNumberCursor}, ${logIndexCursor}) ORDER BY block_number ASC, log_index ASC LIMIT ${takePlusOne}`;
      queryResult.reverse();
      if (queryResult.length === takePlusOne) {
        resultObj.hasPrevious = true;
        resultObj.hasNext = true;
        queryResult.shift();
        resultObj.rows = queryResult;
      } else {
        resultObj.hasPrevious = false;
        resultObj.hasNext = true;
        resultObj.rows = queryResult;
      }
    }
    return resultObj;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getLastFeedPage = async (address, take) => {
  try {
    const resultObj = {};
    const takePlusOne = Math.abs(take) + 1;
    const queryResult =
      await prisma.$queryRaw`SELECT DISTINCT ON (block_number, log_index) feed.* FROM feed WHERE address = ${address} ORDER BY block_number ASC, log_index ASC LIMIT ${takePlusOne}`;
    queryResult.reverse();
    if (queryResult.length === takePlusOne) {
      resultObj.hasPrevious = true;
      resultObj.hasNext = false;
      queryResult.shift();
      resultObj.rows = queryResult;
    } else {
      resultObj.hasPrevious = false;
      resultObj.hasNext = false;
      resultObj.rows = queryResult;
    }
    return resultObj;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getFirstFeedPage = async (address, take) => {
  try {
    const resultObj = {};
    const takePlusOne = Math.abs(take) + 1;
    const queryResult =
      await prisma.$queryRaw`SELECT DISTINCT ON (block_number, log_index) feed.* FROM feed WHERE address = ${address} ORDER BY block_number DESC, log_index DESC LIMIT ${takePlusOne}`;
    if (queryResult.length === takePlusOne) {
      resultObj.hasPrevious = false;
      resultObj.hasNext = true;
      queryResult.pop();
      resultObj.rows = queryResult;
    } else {
      resultObj.hasPrevious = false;
      resultObj.hasNext = false;
      resultObj.rows = queryResult;
    }
    return resultObj;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

module.exports = {
  getCollectionInfo,
  get24hMetrics,
  getVpsMetrics,
  getTransactions,
  getFeed,
  getLastFeedPage,
  getFirstFeedPage,
};
