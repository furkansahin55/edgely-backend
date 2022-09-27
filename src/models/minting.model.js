const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PrismaClientSingleton = require('../utils/PrismaClient');
require('../utils/bigIntPatch');

const prisma = new PrismaClientSingleton();

const getTable = async (timeFrame) => {
  try {
    const tableName = `minting_${timeFrame}`;
    const result = await prisma[tableName].findMany({
      take: 50,
      orderBy: {
        mints: 'desc',
      },
    });
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

module.exports = {
  getTable,
};
