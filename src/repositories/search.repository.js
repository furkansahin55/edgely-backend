const httpStatus = require('http-status');
const { QueryTypes } = require('sequelize');
const ApiError = require('../utils/ApiError');
const CacheSingleton = require('../utils/RedisTag');
const sequelize = require('../models');

const cache = new CacheSingleton(); // Don't mind the constructor, this is singleton!
const searchCollections = async (text, page, pageSize) => {
  try {
    // Check if the data is available in the cache
    const cacheId = `req:search:results:for:(${text}:${page}:${pageSize})`;
    const tags = [`all`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) return cacheResult;

    // Configuration for the db query
    const defaultPageSize = 25; // Default page size if not provided
    let limit = defaultPageSize;
    let offset = null;
    if (page) {
      // Calculate the offset only if page is provided
      limit = pageSize || defaultPageSize;
      offset = (page - 1) * (pageSize || defaultPageSize);
    }

    const result = await sequelize.query(
      `
      SELECT address, name, symbol
      FROM ethereum.collections
      WHERE weight IS NOT NULL AND LOWER(name) LIKE '%' || LOWER($1) || '%'
      ORDER BY weight DESC
      LIMIT $2 OFFSET $3;
      `,
      {
        bind: [text, limit, offset],
        type: QueryTypes.SELECT,
      }
    );

    if (result?.length > 0) await cache.set(cacheId, result, tags); // Write data to cache

    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

module.exports = {
  searchCollections,
};
