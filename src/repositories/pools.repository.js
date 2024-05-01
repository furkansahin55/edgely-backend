const httpStatus = require('http-status');
const { QueryTypes } = require('sequelize');
const sequelize = require('../models');
const ApiError = require('../utils/ApiError');
const CacheSingleton = require('../utils/RedisTag');

const cache = new CacheSingleton();

const getLiquidityEvents = async () => {
  try {
    const cacheId = `req:pools:liquidity-events`;
    const tags = ['liquidity-events'];

    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const result = await sequelize.query(
      `
      SELECT
      concat_ws('/', t1.name, t2.name) as pair_name,
        dl.block_timestamp as date,
        dp.block_timestamp as pair_age,
        dl.type,
        dl.exchange_name,
        dl.from_address,
        dl.amount_in_usd,
        dl.price_in_usd,
        dl.base_token_amount,
        dl.quote_token_amount,
        100 as liquidity_in_usd,
        dl.transaction_hash as tx
        
        FROM
        ethereum.dex_liquidity AS dl
        LEFT JOIN ethereum.dex_pools AS dp ON dl.address = dp.address
        LEFT JOIN ethereum.tokens AS t1 ON dp.base_token_address = t1.address
        LEFT JOIN ethereum.tokens AS t2 ON dp.quote_token_address = t2.address
        
        ORDER BY dl.block_number DESC, dl.log_index DESC LIMIT 100;
      `,
      {
        type: QueryTypes.SELECT,
      }
    );
    await cache.set(cacheId, result, tags);

    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getNewPools = async () => {
  try {
    const cacheId = `req:pools:new`;
    const tags = [`new-pools`];

    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const result = await sequelize.query(
      `
      SELECT 
      concat_ws('/', base_token.name, quote_token.name) as pair_name,
      pool.address,
      pool.block_timestamp as created_at,
      pool.base_token_address,
      pool.quote_token_address,
      pool.base_token_amount as current_base_token_amount,
      pool.quote_token_amount as current_quote_token_amount,
      initial_liquidity.base_token_amount as initial_base_token_amount,
      initial_liquidity.quote_token_amount as initial_quote_token_amount
      FROM ethereum.dex_pools pool
      JOIN ethereum.tokens base_token ON pool.base_token_address = base_token.address
      JOIN ethereum.tokens quote_token ON pool.quote_token_address = quote_token.address
      LEFT JOIN LATERAL (
          SELECT * FROM ethereum.dex_liquidity
          WHERE address = pool.address AND type = 'add'
          ORDER BY block_number, log_index
          LIMIT 1
      ) initial_liquidity ON true
      ORDER BY pool.block_timestamp DESC
      LIMIT 100;
      `,
      {
        bind: [],
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
  getLiquidityEvents,
  getNewPools,
};
