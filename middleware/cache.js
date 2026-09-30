
const TTL_MS = parseInt(process.env.CACHE_TTL_MS, 10) || 60_000;

const store = new Map();

function isExpired(entry) {
  return Date.now() - entry.createdAt > TTL_MS;
}

function getCache(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (isExpired(entry)) {
    store.delete(key);
    return undefined;
  }
  return entry.data;
}

function setCache(key, data) {
  store.set(key, { data, createdAt: Date.now() });
}

function invalidateCache() {
  store.clear();
}


function cacheMiddleware(keyFn) {
  return (req, res, next) => {
    const key = typeof keyFn === 'function' ? keyFn(req) : keyFn;
    const cached = getCache(key);
    if (cached !== undefined) {
      console.log(`Cache HIT: ${key}`);
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }
    console.log(`Cache MISS: ${key}`);
    res.set('X-Cache', 'MISS');
    req.cacheKey = key;
    next();
  };
}

module.exports = { cacheMiddleware, getCache, setCache, invalidateCache, TTL_MS };
