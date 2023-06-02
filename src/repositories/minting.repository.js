const httpStatus = require('http-status');
const { QueryTypes } = require('sequelize');
const ApiError = require('../utils/ApiError');
const CacheSingleton = require('../utils/Cache');
const sequelize = require('../models');

const cache = new CacheSingleton();

const getMintingTable = async (network, minutes) => {
  try {
    const cacheId = `req:minting:${minutes}`;
    const cacheResult = await cache.get(cacheId);
    return cacheResult;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getMintingLabelTable = async (network, minutes, user) => {
  try {
    const cacheId = `req:mintingLabel:${minutes}:${user}`;
    const tags = ['mints'];
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
		    SELECT m1.address, COUNT(price_as_eth) as mints, COUNT(DISTINCT (to_address)) as minters, SUM(price_as_eth) as volume FROM ${network}.nft_mints m1 
		    WHERE block_timestamp > NOW() - $1 * INTERVAL '1 MINUTES' 
		    AND block_timestamp < NOW() - ($1 * 2) * INTERVAL '1 MINUTES' 
		    AND to_address IN (SELECT w.to_address FROM ${network}.nft_wallets w)
		    GROUP BY m1.address)
		, frame AS (
		    SELECT m2.address, COUNT(price_as_eth) as mints, COUNT(DISTINCT (to_address)) as minters, SUM(price_as_eth) as volume FROM ${network}.nft_mints m2
		    WHERE block_timestamp > NOW() - $1 * INTERVAL '1 MINUTES' 
		    AND to_address IN (SELECT w.to_address FROM ${network}.nft_wallets w)
		    GROUP BY m2.address)
      SELECT 
      f.address,
      json_build_object(
      'address', f.address,
      'name', c.name,
      'image_url', c.metadata->>'image_url'
      ) as collection,
      c.block_timestamp as deployed_ago,
      f.mints,
      ${network}.percentage_change(pf.mints, f.mints) as mints_change,
      f.minters,
      ${network}.percentage_change(pf.minters, f.minters) as minters_change,
      ${network}.wei_to_eth(f.volume) as volume,
      ${network}.percentage_change(pf.volume, f.volume) as volume_change
      FROM frame f 
      LEFT JOIN prior_frame pf ON f.address = pf.address
      LEFT JOIN ${network}.collections c ON f.address = c.address
      WHERE c.name IS NOT NULL
      ORDER BY volume DESC
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
  getMintingTable,
  getMintingLabelTable,
};
