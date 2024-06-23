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

const getTransactions = catchAsync(async (req, res) => {
  const { address } = req.params;
  const { blockNumberCursor, logIndexCursor, take } = req.query;
  const result = await poolsService.getTransactions(address, blockNumberCursor, logIndexCursor, take);
  res.send(result);
});

module.exports = {
  getLiquidityEvents,
  getNewPools,
  getTransactions,
};
