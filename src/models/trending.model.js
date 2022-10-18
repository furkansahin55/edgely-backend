const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PrismaClientSingleton = require('../utils/PrismaClient');
require('../utils/bigIntPatch');

const prisma = new PrismaClientSingleton();

const getTrendingTable = async (timeFrame) => {
  try {
    const tableName = `trending_${timeFrame}`;
    const result = await prisma[tableName].findMany({
      take: 50,
      orderBy: {
        sales: 'desc',
      },
    });
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getTrendingLabelTable = async (minutes, user) => {
  try {
    const result = await prisma.$queryRaw`
    SELECT * FROM trending_labels(${user}, ${minutes});
    `;
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

module.exports = {
  getTrendingTable,
  getTrendingLabelTable,
};
