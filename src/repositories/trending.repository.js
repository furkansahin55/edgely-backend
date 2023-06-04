const httpStatus = require('http-status');
const { QueryTypes } = require('sequelize');
const ApiError = require('../utils/ApiError');
const CacheSingleton = require('../utils/Cache');
const sequelize = require('../models');

const cache = new CacheSingleton();

const getTrendingTable = async (network, minutes) => {
  try {
    const cacheId = `req:trending:${minutes}`;
    const cacheResult = await cache.get(cacheId);
    return cacheResult;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getTrendingLabelTable = async (network, minutes, user) => {
  try {
    const cacheId = `req:trendingLabel:${minutes}:${user}`;
    const tags = ['sales'];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }
    const result = await sequelize.query(
      `
      WITH wallets AS (
        SELECT l1.address as to_address FROM labels l1 WHERE l1.user = $2 AND l1.type = 0 AND l1.network = $3
        UNION ALL
        SELECT t.to_address FROM ${network}.nft_tokens t WHERE t.address IN (SELECT l2.address FROM labels l2 WHERE l2.user = $2 AND l2.type = 1 AND l2.network = $3)
      )
      , prior_frame AS (
          SELECT s1.address, MIN(price_as_eth) as floor, COUNT(price_as_eth) as sales, AVG(price_as_eth) as average, SUM(price_as_eth) as volume FROM ${network}.nft_sales s1 
          WHERE block_timestamp > NOW() - ($1 * 2) * INTERVAL '1 MINUTES' 
          AND block_timestamp < NOW() - $1 * INTERVAL '1 MINUTES' 
          AND price_as_eth IS NOT NULL AND price_as_eth > 0
          AND to_address IN (SELECT w.to_address FROM wallets w)
          GROUP BY s1.address)
      , frame AS (
          SELECT s2.address, MIN(price_as_eth) as floor, COUNT(price_as_eth) as sales, AVG(price_as_eth) as average, SUM(price_as_eth) as volume FROM ${network}.nft_sales s2 
          WHERE block_timestamp > NOW() - $1 * INTERVAL '1 MINUTES' 
          AND price_as_eth IS NOT NULL AND price_as_eth > 0
          AND to_address IN (SELECT w.to_address FROM wallets w)
          GROUP BY s2.address)
      SELECT
      f.address,
      json_build_object(
      'address', f.address,
      'name', c.name,
      'image_url', c.metadata->>'image_url'
      ) as collection,
      c.block_timestamp as deployed_ago,
      ${network}.wei_to_eth(f.floor) as floor,
      ${network}.percentage_change(pf.floor, f.floor) as floor_change,
      ${network}.wei_to_eth(pf.floor) as floor_old,
      f.sales,
      ${network}.percentage_change(pf.sales,f.sales) as sales_change,
      pf.sales as sales_old,
      ${network}.wei_to_eth(f.average) as average,
      ${network}.percentage_change(pf.average, f.average) as average_change,
      ${network}.wei_to_eth(pf.average) as average_old,
      ${network}.wei_to_eth(f.volume) as volume,
      ${network}.percentage_change(pf.volume, f.volume) as volume_change,
      ${network}.wei_to_eth(pf.volume) as volume_old
      FROM frame f 
      LEFT JOIN prior_frame pf ON f.address = pf.address
      LEFT JOIN ${network}.collections c ON f.address = c.address
      WHERE c.name IS NOT NULL
      ORDER BY sales DESC
      LIMIT 50;
    `,
      {
        bind: [minutes, user, network],
        type: QueryTypes.SELECT,
      }
    );

    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

module.exports = {
  getTrendingTable,
  getTrendingLabelTable,
};
