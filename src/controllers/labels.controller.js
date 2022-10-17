const catchAsync = require('../utils/catchAsync');
const { labelsService } = require('../services');

const getLabels = catchAsync(async (req, res) => {
  const table = await labelsService.getLabels(req.user.address);
  res.send(table);
});

const upsertLabels = catchAsync(async (req, res) => {
  const { data } = req.body;
  const result = await labelsService.upsertLabels(req.user.address, data);
  res.send(result);
});

module.exports = {
  getLabels,
  upsertLabels,
};
