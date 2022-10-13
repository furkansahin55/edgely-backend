const catchAsync = require('../utils/catchAsync');
const { collectionService } = require('../services');

const getCollectionInfo = catchAsync(async (req, res) => {
  const { address } = req.params;
  const data = await collectionService.getCollectionInfo(address);
  res.send(data);
});

const get24hInfo = catchAsync(async (req, res) => {
  const { address } = req.params;
  const data = await collectionService.get24hInfo(address);
  res.send(data);
});

const getVpsGraph = catchAsync(async (req, res) => {
  const { timeframe, address } = req.params;
  const data = await collectionService.getVpsGraph(timeframe, address);
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

const getMintsChart = catchAsync(async (req, res) => {
  const { address } = req.params;
  const data = await collectionService.getMintsChart(address);
  res.send(data);
});

const getMintsTable = catchAsync(async (req, res) => {
  const { address } = req.params;
  const data = await collectionService.getMintsTable(address);
  res.send(data);
});

const getHoldersChartByCount = catchAsync(async (req, res) => {
  const { address } = req.params;
  const data = await collectionService.getHoldersChartByCount(address);
  res.send(data);
});

const getHoldersChartByDays = catchAsync(async (req, res) => {
  const { address } = req.params;
  const data = await collectionService.getHoldersChartByDays(address);
  res.send(data);
});

const getRelationsWithCollection = catchAsync(async (req, res) => {
  const { address } = req.params;
  const data = await collectionService.getRelationsWithCollection(address);
  res.send(data);
});

module.exports = {
  getCollectionInfo,
  get24hInfo,
  getVpsGraph,
  getTransactions,
  getFeeds,
  getMintsChart,
  getMintsTable,
  getHoldersChartByCount,
  getHoldersChartByDays,
  getRelationsWithCollection,
};
