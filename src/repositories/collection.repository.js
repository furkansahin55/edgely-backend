const httpStatus = require('http-status');
const { QueryTypes } = require('sequelize');
const ApiError = require('../utils/ApiError');
const CacheSingleton = require('../utils/RedisTag');
const sequelize = require('../models');

const cache = new CacheSingleton();
const getCollectionInfo = async (network, address) => {
  try {
    const cacheId = `req:collection:info:${network}:${address}`;
    const tags = [`all`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    let result = await sequelize.query(
      `
      SELECT
      c.address,
      c.name,
      c.symbol,
      c.image_url,
      c.metadata->'collection'->>'slug' as slug,
      c.metadata->'collection'->>'twitter_username' as twitter_username,
      c.metadata->'collection'->>'discord_url' as discord_url,
      c.metadata->'collection'->>'external_url' as external_url,
      c.block_timestamp as deployed_ago,
      COUNT(to_address) as total_supply,
      (COUNT(DISTINCT(to_address))::FLOAT / NULLIF(COUNT(to_address)::FLOAT, 0) * 100)::NUMERIC(5,2) as unique_owner
      FROM ${network}.collections c, ${network}.nft_tokens t
      WHERE t.address = c.address
      AND c.address = $1
      GROUP BY c.address;
    `,
      {
        bind: [address],
        type: QueryTypes.SELECT,
      }
    );
    result = result?.[0];
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const get24hInfo = async (network, address) => {
  try {
    const cacheId = `req:collection:24h:${network}:${address}`;
    const tags = [`sales`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }
    let result = await sequelize.query(
      `
      WITH prior_frame AS (
        SELECT address, MIN(price_as_eth) as floor, COUNT(price_as_eth) as sales, AVG(price_as_eth) as average, SUM(price_as_eth) as volume FROM ${network}.nft_sales 
        WHERE block_timestamp > NOW() - INTERVAL '2 DAYS' 
        AND block_timestamp < NOW() - INTERVAL '1 DAYS'
        AND price_as_eth IS NOT NULL
        GROUP BY address)
      , frame AS (
        SELECT address, MIN(price_as_eth) as floor, COUNT(price_as_eth) as sales, AVG(price_as_eth) as average, SUM(price_as_eth) as volume FROM ${network}.nft_sales 
        WHERE block_timestamp > NOW() - INTERVAL '1 DAYS'
        AND price_as_eth IS NOT NULL
        GROUP BY address)
      SELECT
      f.address,
      ${network}.wei_to_eth(f.floor) as floor,
      ${network}.percentage_change(pf.floor, f.floor) as floor_change,
      ${network}.wei_to_eth(pf.floor) as floor_old,
      ${network}.wei_to_eth(f.average) as average,
      ${network}.percentage_change(pf.average, f.average) as average_change,
      ${network}.wei_to_eth(pf.average) as average_old,
      f.sales,
      ${network}.percentage_change(pf.sales,f.sales) as sales_change,
      pf.sales as sales_old,
      ${network}.wei_to_eth(f.volume) as volume,
      ${network}.percentage_change(pf.volume, f.volume) as volume_change,
      ${network}.wei_to_eth(pf.volume) as volume_old
      FROM frame f
      LEFT JOIN prior_frame pf ON f.address = pf.address
      WHERE f.address = $1;
    `,
      {
        bind: [address],
        type: QueryTypes.SELECT,
      }
    );
    result = result?.[0];
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

// TODO: make timeframe dynamic minutes
const getVpsGraph = async (network, timeframe, address) => {
  try {
    const cacheId = `req:collection:vps:${network}:${address}:${timeframe}`;
    const tags = [`sales`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }
    const timeframeToInterval = {
      1: `SELECT date_trunc('minute', block_timestamp) - (extract('minute' from block_timestamp) % 5 || ' minutes')::interval AS block_timestamp,`,
      7: `SELECT date_trunc('minute', block_timestamp) - (extract('minute' from block_timestamp) % 30 || ' minutes')::interval AS block_timestamp,`,
      30: `SELECT date_trunc('hour', block_timestamp) - (extract('hour' from block_timestamp) % 2 || ' hours')::interval AS block_timestamp,`,
      90: `SELECT date_trunc('hour', block_timestamp) - (extract('hour' from block_timestamp) % 6 || ' hours')::interval AS block_timestamp,`,
      365: `SELECT date_trunc('day', block_timestamp) - (extract('day' from block_timestamp) % 1 || ' days')::interval AS block_timestamp,`,
      all: `SELECT date_trunc('day', block_timestamp) - (extract('day' from block_timestamp) % 1 || ' days')::interval AS block_timestamp,`,
    };
    const interval = timeframeToInterval[timeframe];
    const whereQuery = timeframe !== 'all' ? `AND block_timestamp > NOW() - INTERVAL '${timeframe} DAYS'` : '';
    const result = await sequelize.query(
      `
      ${interval}
      address,
      ${network}.wei_to_eth(MIN(price_as_eth)) as floor,
      ${network}.wei_to_eth(MAX(price_as_eth)) as max,
      COUNT(price_as_eth) as sales,
      ${network}.wei_to_eth(AVG(price_as_eth)) as average,
      ${network}.wei_to_eth(SUM(price_as_eth)) as volume
      FROM ${network}.nft_sales
      WHERE address = $1 
      ${whereQuery} 
      AND price_as_eth IS NOT NULL
      GROUP BY address, 1
      ORDER BY address, 1;
    `,
      {
        bind: [address],
        type: QueryTypes.SELECT,
      }
    );
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getTransactions = async (network, address, timeframe) => {
  try {
    const cacheId = `req:collection:txs:${network}:${address}:${timeframe}`;
    const tags = [`sales`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }
    const whereQuery = timeframe !== 'all' ? `AND block_timestamp > NOW() - INTERVAL '${timeframe} DAYS'` : '';
    const result = await sequelize.query(
      `
      SELECT block_timestamp, address, to_address as buyer, ${network}.wei_to_eth(price_as_eth) as price
      FROM ${network}.nft_sales
      WHERE address = $1 
      ${whereQuery} 
      AND price_as_eth IS NOT NULL
      ORDER BY block_timestamp DESC
      LIMIT 500;
    `,
      {
        bind: [address],
        type: QueryTypes.SELECT,
      }
    );
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const feedQuery = async (network, address, limit, sort, blockNumberCursor = false, logIndexCursor = false) => {
  const isCursorAvailable = blockNumberCursor !== false && logIndexCursor !== false;
  const cursorQuery = isCursorAvailable ? ` AND (block_number, log_index) ${sort === 'DESC' ? '<' : '>'} ($3, $4) ` : '';
  return sequelize.query(
    `
    SELECT 'Mint' as type, block_number, log_index, address, transaction_hash, block_timestamp as block_timestamp, from_address, to_address, token_id, ${network}.wei_to_eth(price_as_eth) as price_as_eth  FROM ${network}.nft_mints WHERE address = $1 ${cursorQuery}
    UNION ALL
    SELECT 'Sale' as type, block_number, log_index, address, transaction_hash, block_timestamp as block_timestamp, from_address, to_address, token_id, ${network}.wei_to_eth(price_as_eth) as price_as_eth  FROM ${network}.nft_sales WHERE address = $1 ${cursorQuery}
    ORDER BY block_number ${sort}, log_index ${sort} LIMIT $2;`,
    {
      bind: isCursorAvailable ? [address, limit, blockNumberCursor, logIndexCursor] : [address, limit],
      type: QueryTypes.SELECT,
    }
  );
};

const getFeed = async (network, address, blockNumberCursor, logIndexCursor, take) => {
  try {
    const cacheId = `req:collection:feed:${network}:${address}:${blockNumberCursor}:${logIndexCursor}:${take}`;
    const tags = [`all`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const resultObj = {};
    if (take >= 0) {
      const takePlusOne = take + 1;
      const queryResult = await feedQuery(network, address, takePlusOne, 'DESC', blockNumberCursor, logIndexCursor);
      if (queryResult.length === takePlusOne) {
        resultObj.hasNext = true;
        resultObj.hasPrevious = true;
        queryResult.pop();
        resultObj.rows = queryResult;
      } else {
        resultObj.hasNext = false;
        resultObj.hasPrevious = true;
        resultObj.rows = queryResult;
      }
    } else {
      const takePlusOne = Math.abs(take) + 1;
      const queryResult = await feedQuery(network, address, takePlusOne, 'ASC', blockNumberCursor, logIndexCursor);
      queryResult.reverse();
      if (queryResult.length === takePlusOne) {
        resultObj.hasPrevious = true;
        resultObj.hasNext = true;
        queryResult.shift();
        resultObj.rows = queryResult;
      } else {
        resultObj.hasPrevious = false;
        resultObj.hasNext = true;
        resultObj.rows = queryResult;
      }
    }
    await cache.set(cacheId, resultObj, tags);
    return resultObj;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getLastFeedPage = async (network, address, take) => {
  try {
    const cacheId = `req:collection:lastFeed:${network}:${address}:${take}`;
    const tags = [`all`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const resultObj = {};
    const takePlusOne = Math.abs(take) + 1;
    const queryResult = await feedQuery(network, address, takePlusOne, 'ASC');
    queryResult.reverse();
    if (queryResult.length === takePlusOne) {
      resultObj.hasPrevious = true;
      resultObj.hasNext = false;
      queryResult.shift();
      resultObj.rows = queryResult;
    } else {
      resultObj.hasPrevious = false;
      resultObj.hasNext = false;
      resultObj.rows = queryResult;
    }
    await cache.set(cacheId, resultObj, tags);
    return resultObj;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getFirstFeedPage = async (network, address, take) => {
  try {
    const cacheId = `req:collection:firstFeed:${network}:${address}:${take}`;
    const tags = [`all`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const resultObj = {};
    const takePlusOne = Math.abs(take) + 1;
    const queryResult = await feedQuery(network, address, takePlusOne, 'DESC');
    if (queryResult.length === takePlusOne) {
      resultObj.hasPrevious = false;
      resultObj.hasNext = true;
      queryResult.pop();
      resultObj.rows = queryResult;
    } else {
      resultObj.hasPrevious = false;
      resultObj.hasNext = false;
      resultObj.rows = queryResult;
    }
    await cache.set(cacheId, resultObj, tags);
    return resultObj;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getMintsChart = async (network, address) => {
  try {
    const cacheId = `req:collection:mints:chart:${network}:${address}`;
    const tags = [`mints`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const result = await sequelize.query(
      `
      SELECT date_trunc('hours', block_timestamp) as block_timestamp, address, COUNT(price_as_eth) as mints
      FROM ${network}.nft_mints 
      WHERE price_as_eth IS NOT NULL
      AND address = $1
      GROUP BY address, 1
      ORDER BY address, 1;
    `,
      {
        bind: [address],
        type: QueryTypes.SELECT,
      }
    );
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getMintsTable = async (network, address) => {
  try {
    const cacheId = `req:collection:mints:table:${network}:${address}`;
    const tags = [`mints`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const result = await sequelize.query(
      `
      SELECT to_address, COUNT(log_index) as mints FROM ${network}.nft_mints
      WHERE address = $1
      GROUP BY to_address
      ORDER BY mints DESC
      LIMIT 25
      `,
      {
        bind: [address],
        type: QueryTypes.SELECT,
      }
    );
    cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getHoldersChartByCount = async (network, address) => {
  try {
    const cacheId = `req:collection:holders:count:${network}:${address}`;
    const tags = [`all`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }
    const result = await sequelize.query(
      `
    WITH count_table AS (
        SELECT COUNT(token_id) as token_count, to_address as owner FROM ${network}.nft_tokens 
        WHERE address = $1 AND to_address NOT IN (SELECT address FROM ${network}.dead_addresses) 
        GROUP BY to_address 
        ORDER BY token_count DESC
        )
        SELECT token_count, COUNT(owner) as owner_count 
        FROM count_table 
        GROUP BY token_count 
        ORDER BY token_count;
    `,
      {
        bind: [address],
        type: QueryTypes.SELECT,
      }
    );
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getHoldersChartByDays = async (network, address) => {
  try {
    const cacheId = `req:collection:holders:days:${network}:${address}`;
    const tags = [`all`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const result = await sequelize.query(
      `
    WITH days_table AS (
    SELECT DISTINCT ON (token_id) address, token_id, transaction_hash, DATE_PART('day', ${network}.to_utc(NOW()) - ${network}.to_utc(block_timestamp)) as days_ago
    FROM ${network}.nft_tokens 
    WHERE address = $1 AND to_address NOT IN (SELECT address FROM ${network}.dead_addresses) 
    ORDER BY token_id, block_number DESC, log_index DESC) 
    SELECT days_ago, COUNT(token_id) as token_count FROM days_table 
    GROUP BY days_ago 
    ORDER BY days_ago;
    `,
      {
        bind: [address],
        type: QueryTypes.SELECT,
      }
    );
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getRelationsWithCollections = async (network, address) => {
  try {
    const cacheId = `req:collection:relation:${network}:${address}`;
    const tags = [`all`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    let result = await sequelize.query(
      `
    WITH holders AS (
      SELECT to_address FROM ${network}.nft_tokens WHERE address = $1 GROUP BY to_address)
      , adresses AS (
      SELECT jsonb_object_keys(tokens) as address, COUNT(DISTINCT to_address) as holders_count 
      FROM ${network}.nft_wallets w WHERE to_address IN (SELECT to_address FROM holders h) 
      GROUP BY address ORDER BY holders_count DESC LIMIT 21)
      SELECT adresses.*, collections.name FROM adresses JOIN ${network}.collections ON collections.address = adresses.address;
    `,
      {
        bind: [address],
        type: QueryTypes.SELECT,
      }
    );
    result = result.filter((item) => item.address !== address);
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const searchCollections = async (query) => {
  try {
    const cacheId = `req:collection:query:${query}`;
    const tags = [`all`];
    const cacheResult = null;
    if (cacheResult) {
      return cacheResult;
    }

    const result = await sequelize.query(
      `SELECT address, name, symbol FROM ethereum.collections WHERE address = $1 LIMIT 10;`,
      {
        bind: [query.toLowerCase()],
        type: QueryTypes.SELECT,
      }
    );

    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getHolders = async (network, address) => {
  try {
    const cacheId = `req:collection:holders:${network}:${address}`;
    const tags = [];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const result = await sequelize.query(
      `
      SELECT DISTINCT ON (to_address) to_address AS holder
      FROM ${network}.nft_tokens
      WHERE address = $1
        AND to_address NOT IN (SELECT address FROM ${network}.dead_addresses);
    `,
      {
        bind: [address],
        type: QueryTypes.SELECT,
      }
    );
    await cache.set(cacheId, result, tags, 60 * 60 * 24);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getBlockNumber = async (network) => {
  try {
    const cacheId = `req:collection:block_number:${network}`;
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return { blockNumber: cacheResult };
    }
    return { blockNumber: 'fetching...' };
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getHoldersActions = async (network, address) => {
  try {
    const cacheId = `req:collection:holders:action:${network}:${address}`;
    const tags = ['all'];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const result = await sequelize.query(
      `
        WITH holders AS (
        SELECT DISTINCT ON (to_address) to_address AS holder
        FROM ${network}.nft_tokens
        WHERE address = $1
        AND to_address NOT IN (SELECT address FROM ${network}.dead_addresses)
        )
        SELECT 'Buy' as type,  c.name as collection_name, s.block_number, s.log_index, s.address, s.transaction_hash, s.block_timestamp as block_timestamp, s.from_address, s.to_address, s.token_id, ethereum.wei_to_eth(price_as_eth) as price_as_eth
        FROM ${network}.nft_sales s
        JOIN ${network}.collections c ON c.address = s.address
        WHERE s.to_address IN (SELECT holder FROM holders)
        ORDER BY s.block_timestamp DESC
        LIMIT 80;          
      `,
      {
        bind: [address],
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
  getCollectionInfo,
  get24hInfo,
  getVpsGraph,
  getTransactions,
  getFeed,
  getLastFeedPage,
  getFirstFeedPage,
  getMintsChart,
  getMintsTable,
  getHoldersChartByCount,
  getHoldersChartByDays,
  getRelationsWithCollections,
  searchCollections,
  getHolders,
  getBlockNumber,
  getHoldersActions,
};
