const catchAsync = require('../utils/catchAsync');
const { poolsService } = require('../services');

const getLiquidityEvents = catchAsync(async (req, res) => {
  const result = await poolsService.getLiquidityEvents();
  res.send(result);
});

const getNewPools = catchAsync(async (req, res) => {
  const result = await poolsService.getNewPools();
  res.send(result);
});

module.exports = {
  getLiquidityEvents,
  getNewPools,
};
