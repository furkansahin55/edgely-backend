const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PrismaClientSingleton = require('../utils/PrismaClient');

const prisma = new PrismaClientSingleton();

const getByAddress = async (address) => {
  try {
    const lowerAddress = address.toLowerCase();

    const user = await prisma.users.findUnique({
      where: {
        address: lowerAddress,
      },
    });
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const create = async (address) => {
  try {
    const lowerAddress = address.toLowerCase();
    const user = await prisma.users.create({
      data: {
        address: lowerAddress,
      },
    });
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

module.exports = {
  getByAddress,
  create,
};
