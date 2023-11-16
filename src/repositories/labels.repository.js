const httpStatus = require('http-status');
const { QueryTypes } = require('sequelize');
const ApiError = require('../utils/ApiError');
const sequelize = require('../models');
const CacheSingleton = require('../utils/RedisTag');

const cache = new CacheSingleton();

const getLabels = async (address) => {
  try {
    const result = await sequelize.models.labels.findAll({
      where: {
        user: address,
      },
      attributes: ['address', 'type', 'network'],
    });
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const insertLabels = async (data) => {
  try {
    await sequelize.models.labels.bulkCreate(data);
    return true;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const deleteLabels = async (user) => {
  try {
    await sequelize.models.labels.destroy({
      where: { user },
    });
    return true;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

const getAdresses = async (network, user) => {
  try {
    const cacheId = `req:labels:adresses:${network}:${user}`;
    const tags = [];
    const cacheResult = await cache.get(cacheId);
    if (cacheResult) {
      return cacheResult;
    }

    let result = await sequelize.query(
      `
      WITH labels AS (
        SELECT * FROM public.labels as l WHERE l.user = $2 and network = $1
      ),
      holders AS (
        SELECT DISTINCT ON (to_address) to_address AS address
        FROM ${network}.nft_tokens
        WHERE address IN (SELECT address FROM labels l WHERE l.type = 1)
        AND to_address NOT IN (SELECT address FROM ${network}.dead_addresses)
      )
      SELECT address FROM holders
      UNION ALL
      SELECT address FROM labels WHERE type=0;    
      `,
      {
        bind: [network, user],
        type: QueryTypes.SELECT,
      }
    );
    result = result.map((e) => e.address);

    await cache.set(cacheId, result, tags, { timeout: 10 });
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `DB Error: ${error.message}`, true, error.stack);
  }
};

module.exports = {
  getLabels,
  insertLabels,
  deleteLabels,
  getAdresses,
};
