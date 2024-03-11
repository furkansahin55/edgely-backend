const catchAsync = require('../utils/catchAsync');
const { searchRepository } = require('../repositories');

const getCollections = catchAsync(async (req, res) => {
  const { page, pageSize } = req.params;
  const collections = await searchRepository.getCollections(page, pageSize);
  res.send(collections);
});

module.exports = {
  getCollections,
};
