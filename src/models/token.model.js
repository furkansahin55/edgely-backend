const httpStatus = require('http-status');
const PrismaClientSingleton = require('../utils/PrismaClient');
const ApiError = require('../utils/ApiError');

const prisma = new PrismaClientSingleton();

const findOne = async (data) => {
  try {
    const token = await prisma.token.findFirst({
      where: data,
    });
    return token;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const create = async (data) => {
  try {
    const token = await prisma.token.create({
      data,
    });
    return token;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const remove = async (token) => {
  try {
    const res = await prisma.token.delete({
      where: {
        token,
      },
    });
    return res;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

module.exports = {
  create,
  findOne,
  remove,
};
