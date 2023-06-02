const catchAsync = require('../utils/catchAsync');
const { trendingService } = require('../services');

const getTrendingTable = catchAsync(async (req, res) => {
  const { timeFrame } = req.params;
  const { network } = req.query;
  const table = await trendingService.getTrendingTable(network, timeFrame);
  res.send(table);
});

const getTrendingLabelsTable = catchAsync(async (req, res) => {
  const { timeFrame } = req.params;
  const { network } = req.query;
  const table = await trendingService.getTrendingLabelsTable(network, timeFrame, req.user.address);
  res.send(table);
});

module.exports = {
  getTrendingTable,
  getTrendingLabelsTable,
};
