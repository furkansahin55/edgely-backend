const TagCache = require('redis-tag-cache').default;

class CacheSingleton {
  constructor() {
    if (!CacheSingleton.instance) {
      CacheSingleton.instance = new TagCache({
        defaultTimeout: 86400, // Expire records after a day (even if they weren't invalidated)
      });
    }
    return CacheSingleton.instance;
  }
}

module.exports = CacheSingleton;
