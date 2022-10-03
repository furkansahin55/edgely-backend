const catchAsync = require('../utils/catchAsync');
const { collectionService } = require('../services');

const getCollectionInfo = catchAsync(async (req, res) => {
  const { address } = req.params;
  const data = await collectionService.getCollectionInfo(address);
  res.send(data);
});

const get24hMetrics = catchAsync(async (req, res) => {
  const { address } = req.params;
  const data = await collectionService.get24hMetrics(address);
  res.send(data);
});

const getVpsMetrics = catchAsync(async (req, res) => {
  const { timeframe, address } = req.params;
  const data = await collectionService.getVpsMetrics(timeframe, address);
  res.send(data);
});

const getTransactions = catchAsync(async (req, res) => {
  const { address } = req.params;
  const data = await collectionService.getTransactions(address);
  res.send(data);
});

const getFeeds = catchAsync(async (req, res) => {
  const { address } = req.params;
  const { blockNumberCursor, logIndexCursor, take } = req.query;
  const data = await collectionService.getFeeds(address, blockNumberCursor, logIndexCursor, take);
  res.send(data);
});

module.exports = {
  getCollectionInfo,
  get24hMetrics,
  getVpsMetrics,
  getTransactions,
  getFeeds,
};
