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
      `SELECT 
        dl.block_timestamp as date, 
        dl.type, 
        dl.exchange_name,
        dl.from_address, 
        t1.name as base_token, 
        t2.name as quote_token, 
        dl.amount_in_usd, 
        dl.price_in_usd, 
        dl.base_token_amount, 
        dl.quote_token_amount, 
        dl.transaction_hash as tx 
        
        FROM 
        ethereum.dex_liquidity AS dl 
        LEFT JOIN  ethereum.dex_pools AS dp ON dl.address = dp.address
        LEFT JOIN  ethereum.tokens AS t1 ON dp.base_token_address = t1.address
        LEFT JOIN  ethereum.tokens AS t2 ON dp.quote_token_address = t2.address
        
        GROUP BY date, dl.type, dl.exchange_name, dl.from_address, base_token, quote_token, dl.amount_in_usd, dl.price_in_usd, dl.base_token_amount, dl.quote_token_amount, tx
        
        ORDER BY dl.block_timestamp DESC
		
        LIMIT 100

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

module.exports = {
  getLiquidityEvents,
};
