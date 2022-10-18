const catchAsync = require('../utils/catchAsync');
const { mintingService } = require('../services');

const getMintingTable = catchAsync(async (req, res) => {
  const { timeFrame } = req.params;
  const table = await mintingService.getMintingTable(timeFrame);
  res.send(table);
});

const getMintingLabelsTable = catchAsync(async (req, res) => {
  const { timeFrame } = req.params;
  const table = await mintingService.getMintingLabelsTable(timeFrame, req.user.address);
  res.send(table);
});

module.exports = {
  getMintingTable,
  getMintingLabelsTable,
};
