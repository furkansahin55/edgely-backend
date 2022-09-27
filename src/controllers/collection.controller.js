const catchAsync = require('../utils/catchAsync');
const { collectionService } = require('../services');

const getCollectionInfo = catchAsync(async (req, res) => {
  const { address } = req.params;
  const table = await collectionService.getCollectionInfo(address);
  res.send(table);
});

const get24hMetrics = catchAsync(async (req, res) => {
  const { address } = req.params;
  const table = await collectionService.get24hMetrics(address);
  res.send(table);
});

const getVpsMetrics = catchAsync(async (req, res) => {
  const { timeframe, address } = req.params;
  const table = await collectionService.getVpsMetrics(timeframe, address);
  res.send(table);
});

const getTransactions = catchAsync(async (req, res) => {
  const { address } = req.params;
  const table = await collectionService.getTransactions(address);
  res.send(table);
});

module.exports = {
  getCollectionInfo,
  get24hMetrics,
  getVpsMetrics,
  getTransactions,
};
