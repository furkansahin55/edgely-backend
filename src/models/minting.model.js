const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PrismaClientSingleton = require('../utils/PrismaClient');
require('../utils/bigIntPatch');

const prisma = new PrismaClientSingleton();

const getMintingTable = async (timeFrame) => {
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

const getMintingLabelTable = async (minutes, user) => {
  try {
    const result = await prisma.$queryRaw`
    SELECT * FROM minting_labels(${user}, ${minutes});
    `;
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

module.exports = {
  getMintingTable,
  getMintingLabelTable,
};
