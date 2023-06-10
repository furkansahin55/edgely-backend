const catchAsync = require('../utils/catchAsync');
const { collectionService } = require('../services');

const getCollectionInfo = catchAsync(async (req, res) => {
  const { network } = req.query;
  const { address } = req.params;
  const data = await collectionService.getCollectionInfo(network, address);
  res.send(data);
});

const get24hInfo = catchAsync(async (req, res) => {
  const { network } = req.query;
  const { address } = req.params;
  const data = await collectionService.get24hInfo(network, address);
  res.send(data);
});

const getVpsGraph = catchAsync(async (req, res) => {
  const { network, interval, timeframe } = req.query;
  const { address } = req.params;
  const data = await collectionService.getVpsGraph(network, timeframe, address, interval);
  res.send(data);
});

const getTransactions = catchAsync(async (req, res) => {
  const { network, timeframe } = req.query;
  const { address } = req.params;
  const data = await collectionService.getTransactions(network, address, timeframe);
  res.send(data);
});

const getFeeds = catchAsync(async (req, res) => {
  const { network } = req.query;
  const { address } = req.params;
  const { blockNumberCursor, logIndexCursor, take } = req.query;
  const data = await collectionService.getFeeds(network, address, blockNumberCursor, logIndexCursor, take);
  res.send(data);
});

const getMintsChart = catchAsync(async (req, res) => {
  const { network } = req.query;
  const { address } = req.params;
  const data = await collectionService.getMintsChart(network, address);
  res.send(data);
});

const getMintsTable = catchAsync(async (req, res) => {
  const { network } = req.query;
  const { address } = req.params;
  const data = await collectionService.getMintsTable(network, address);
  res.send(data);
});

const getHoldersChartByCount = catchAsync(async (req, res) => {
  const { network } = req.query;
  const { address } = req.params;
  const data = await collectionService.getHoldersChartByCount(network, address);
  res.send(data);
});

const getHoldersChartByDays = catchAsync(async (req, res) => {
  const { network } = req.query;
  const { address } = req.params;
  const data = await collectionService.getHoldersChartByDays(network, address);
  res.send(data);
});

const getRelationsWithCollection = catchAsync(async (req, res) => {
  const { network } = req.query;
  const { address } = req.params;
  const data = await collectionService.getRelationsWithCollection(network, address);
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
