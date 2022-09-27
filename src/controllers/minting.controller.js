const catchAsync = require('../utils/catchAsync');
const { mintingService } = require('../services');

const getMintingTable = catchAsync(async (req, res) => {
  const { timeFrame } = req.params;
  const table = await mintingService.getTable(timeFrame);
  res.send(table);
});

module.exports = {
  getMintingTable,
};
