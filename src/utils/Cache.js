const TagCache = require('redis-tag-cache').default;
const config = require('../config/config');

class CacheSingleton {
  constructor() {
    if (!CacheSingleton.instance) {
      CacheSingleton.instance = new TagCache({
        defaultTimeout: 86400, // Expire records after a day (even if they weren't invalidated)
        redis: config.redis,
      });
    }
    return CacheSingleton.instance;
  }
}

module.exports = CacheSingleton;
