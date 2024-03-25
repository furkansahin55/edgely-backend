const { searchRepository } = require('../repositories');

const searchCollections = async (text, page, pageSize) => {
  const result = await searchRepository.searchCollections(text, page, pageSize);
  return result;
};

module.exports = {
  searchCollections,
};
