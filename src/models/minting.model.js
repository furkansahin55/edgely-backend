const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PrismaClientSingleton = require('../utils/PrismaClient');
const CacheSingleton = require('../utils/Cache');
require('../utils/bigIntPatch');

const prisma = new PrismaClientSingleton();
const cache = new CacheSingleton();

const getMintingTable = async (timeFrame) => {
  try {
    const cacheId = `req:minting:${timeFrame}`;
    const tags = ['mint'];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const tableName = `minting_${timeFrame}`;
    const result = await prisma[tableName].findMany({
      take: 50,
      orderBy: {
        mints: 'desc',
      },
    });
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getMintingLabelTable = async (minutes, user) => {
  try {
    const cacheId = `req:mintingLabel:${minutes}:${user}`;
    const tags = ['mint'];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const result = await prisma.$queryRaw`
    SELECT * FROM minting_labels(${user}, ${minutes});
    `;
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

module.exports = {
  getMintingTable,
  getMintingLabelTable,
};
