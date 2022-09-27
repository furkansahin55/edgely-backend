const catchAsync = require('../utils/catchAsync');
const { trendingService } = require('../services');

const getTrendingTable = catchAsync(async (req, res) => {
  const { timeFrame } = req.params;
  const table = await trendingService.getTable(timeFrame);
  res.send(table);
});

module.exports = {
  getTrendingTable,
};
