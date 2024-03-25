const catchAsync = require('../utils/catchAsync');
const { searchService } = require('../services');

const searchCollections = catchAsync(async (req, res) => {
  const { page, pageSize } = req.query;
  const { text } = req.params;
  const collections = await searchService.searchCollections(text, page, pageSize);
  res.send(collections);
});

module.exports = {
  searchCollections,
};
