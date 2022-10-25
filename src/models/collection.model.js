const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PrismaClientSingleton = require('../utils/PrismaClient');
const CacheSingleton = require('../utils/Cache');
require('../utils/bigIntPatch');

const prisma = new PrismaClientSingleton();
const cache = new CacheSingleton();

const getCollectionInfo = async (address) => {
  try {
    const cacheId = `req:collection:info:${address}`;
    const tags = [`all:${address}`, `metadata:${address}`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }
    const result = await prisma.overview_info.findUnique({
      where: {
        address,
      },
    });
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const get24hInfo = async (address) => {
  try {
    const cacheId = `req:collection:24h:${address}`;
    const tags = [`sale:${address}`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }
    const result = await prisma.overview_24h.findUnique({
      where: {
        address,
      },
    });
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getVpsGraph = async (timeframe, address) => {
  try {
    const cacheId = `req:collection:vps:${address}`;
    const tags = [`sale:${address}`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }
    const result = await prisma[`overview_detailed_${timeframe}`].findMany({
      where: {
        address,
      },
    });
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getTransactions = async (address) => {
  try {
    const cacheId = `req:collection:txs:${address}`;
    const tags = [`sale:${address}`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }
    const result = await prisma.overview_txs.findMany({
      take: 1000,
      where: {
        address,
      },
    });
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const feedQuery = async (address, limit, sort, blockNumberCursor = false, logIndexCursor = false) => {
  const cursorQuery =
    blockNumberCursor !== false && logIndexCursor !== false
      ? ` AND (block_number, log_index) ${sort === 'DESC' ? '<' : '>'} ($3, $4) `
      : '';
  return prisma.$queryRawUnsafe(
    `
    SELECT 'Mint' as type, block_number, log_index, address, transaction_hash, to_utc(block_timestamp) as block_timestamp, from_address, to_address, token_id, wei_to_eth(price_as_eth) as price_as_eth  FROM mints WHERE address = $1 ${cursorQuery}
    UNION ALL
    SELECT 'Sale' as type, block_number, log_index, address, transaction_hash, to_utc(block_timestamp) as block_timestamp, from_address, to_address, token_id, wei_to_eth(price_as_eth) as price_as_eth  FROM sales WHERE address = $1 ${cursorQuery}
    ORDER BY block_number ${sort}, log_index ${sort} LIMIT $2;`,
    address,
    limit,
    blockNumberCursor,
    logIndexCursor
  );
};

const getFeed = async (address, blockNumberCursor, logIndexCursor, take) => {
  try {
    const cacheId = `req:collection:feed:${address}:${blockNumberCursor}:${logIndexCursor}:${take}`;
    const tags = [`all:${address}`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const resultObj = {};
    if (take >= 0) {
      const takePlusOne = take + 1;
      const queryResult = await feedQuery(address, takePlusOne, 'DESC', blockNumberCursor, logIndexCursor);
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
      const queryResult = await feedQuery(address, takePlusOne, 'ASC', blockNumberCursor, logIndexCursor);
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
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getLastFeedPage = async (address, take) => {
  try {
    const cacheId = `req:collection:lastFeed:${address}:${take}`;
    const tags = [`all:${address}`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const resultObj = {};
    const takePlusOne = Math.abs(take) + 1;
    const queryResult = await feedQuery(address, takePlusOne, 'ASC');
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
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getFirstFeedPage = async (address, take) => {
  try {
    const cacheId = `req:collection:firstFeed:${address}:${take}`;
    const tags = [`all:${address}`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const resultObj = {};
    const takePlusOne = Math.abs(take) + 1;
    const queryResult = await feedQuery(address, takePlusOne, 'DESC');
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
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getMintsChart = async (address) => {
  try {
    const cacheId = `req:collection:mints:chart:${address}`;
    const tags = [`mint:${address}`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const result = await prisma.mints_chart.findMany({
      where: {
        address,
      },
    });
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getMintsTable = async (address) => {
  try {
    const cacheId = `req:collection:mints:table:${address}`;
    const tags = [`mint:${address}`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const result =
      await prisma.$queryRaw`SELECT to_address, COUNT(log_index) as mints FROM (SELECT DISTINCT ON(address, token_id) * FROM mints_table WHERE address = ${address}) t1 GROUP BY to_address ORDER BY mints DESC LIMIT 20;`;
    cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getHoldersChartByCount = async (address) => {
  try {
    const cacheId = `req:collection:holders:count:${address}`;
    const tags = [`all:${address}`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }
    const result = await prisma.$queryRaw`
    WITH count_table AS (
        SELECT COUNT(token_id) as token_count, to_address as owner FROM tokens WHERE address = ${address} AND to_address NOT IN ('0x000000000000000000000000000000000000dead', '0x0000000000000000000000000000000000000000') GROUP BY to_address ORDER BY token_count DESC
        )
        SELECT token_count, COUNT(owner) as owner_count FROM count_table GROUP BY token_count ORDER BY token_count;
    `;
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getHoldersChartByDays = async (address) => {
  try {
    const cacheId = `req:collection:holders:days:${address}`;
    const tags = [`all:${address}`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    const result = await prisma.$queryRaw`
    WITH days_table AS (
    SELECT DISTINCT ON (token_id) address, token_id, transaction_hash, DATE_PART('day', to_utc('2022-06-17 17:48:24.74218+02'::TIMESTAMP) - to_utc(block_timestamp)) as days_ago
    FROM tokens WHERE address = ${address} AND to_address NOT IN ('0x000000000000000000000000000000000000dead', '0x0000000000000000000000000000000000000000') ORDER BY token_id, block_number DESC, log_index DESC
    ) SELECT days_ago, COUNT(token_id) as token_count FROM days_table GROUP BY days_ago ORDER BY days_ago;
    `;
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
  }
};

const getRelationsWithCollections = async (address) => {
  try {
    const cacheId = `req:collection:relation:${address}`;
    const tags = [`all`];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    let result = await prisma.$queryRaw`
    WITH holders AS (
      SELECT to_address FROM tokens WHERE address = ${address} GROUP BY to_address)
      , adresses AS (
      SELECT jsonb_object_keys(tokens) as address, COUNT(DISTINCT to_address) as holders_count 
      FROM wallets w WHERE to_address IN (SELECT to_address FROM holders h) GROUP BY address ORDER BY holders_count DESC LIMIT 21)
      SELECT adresses.*, contracts.name FROM adresses JOIN contracts ON contracts.address = adresses.address;
    `;
    result = result.filter((item) => item.address !== address);
    await cache.set(cacheId, result, tags);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB Error', true, error.message);
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
};
