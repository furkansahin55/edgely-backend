const catchAsync = require('../utils/catchAsync');
const { mintingService } = require('../services');

const getMintingTable = catchAsync(async (req, res) => {
  const { timeFrame } = req.params;
  const { network } = req.query;
  const table = await mintingService.getMintingTable(network, timeFrame);
  res.send(table);
});

const getMintingLabelsTable = catchAsync(async (req, res) => {
  const { timeFrame } = req.params;
  const { network } = req.query;
  const table = await mintingService.getMintingLabelsTable(network, timeFrame, req.user.address);
  res.send(table);
});

module.exports = {
  getMintingTable,
  getMintingLabelsTable,
};
