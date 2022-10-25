const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PrismaClientSingleton = require('../utils/PrismaClient');
const CacheSingleton = require('../utils/Cache');
require('../utils/bigIntPatch');

const prisma = new PrismaClientSingleton();
const cache = new CacheSingleton();

const getTrendingTable = async (timeFrame) => {
  try {
    const start = new Date().getTime();
    const cacheId = `req:trending:${timeFrame}`;
    const tags = ['sale'];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      console.log('cache hit :', new Date().getTime(), start)
      return cacheResult;
    }

    const tableName = `trending_${timeFrame}`;
    const result = await prisma[tableName].findMany({
      take: 50,
      orderBy: {
        sales: 'desc',
      },
    });
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getTrendingLabelTable = async (minutes, user) => {
  try {
    const cacheId = `req:trendingLabel:${minutes}:${user}`;
    const tags = ['sale'];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const result = await prisma.$queryRaw`
    SELECT * FROM trending_labels(${user}, ${minutes});
    `;
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

module.exports = {
  getTrendingTable,
  getTrendingLabelTable,
};
