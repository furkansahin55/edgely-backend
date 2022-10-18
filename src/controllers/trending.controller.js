const catchAsync = require('../utils/catchAsync');
const { trendingService } = require('../services');

const getTrendingTable = catchAsync(async (req, res) => {
  const { timeFrame } = req.params;
  const table = await trendingService.getTrendingTable(timeFrame);
  res.send(table);
});

const getTrendingLabelsTable = catchAsync(async (req, res) => {
  const { timeFrame } = req.params;
  const table = await trendingService.getTrendingLabelsTable(timeFrame, req.user.address);
  res.send(table);
});

module.exports = {
  getTrendingTable,
  getTrendingLabelsTable,
};
