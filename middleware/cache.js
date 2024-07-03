const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

redisClient.on('end', () => {
  console.log('Redis client closed');
});

const createCache = (duration) => async (req, res, next) => {
  const key = req.originalUrl || req.url;
  
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const startTime = new Date();
    const cachedData = await redisClient.get(key);
    const endTime = new Date();
    const time = endTime - startTime;

    if (cachedData) {
      console.log(`WITH CACHING Fetched data for ${key} in ${time}ms`);
      return res.json(JSON.parse(cachedData));
    } else {
      console.log(`Cache miss for ${key}`);
      res.sendResponse = res.json;
      res.json = async (body) => {
        await redisClient.set(key, JSON.stringify(body), 'EX', duration);
        console.log(`Cache set for ${key}`);
        res.sendResponse(body);
      };
      next();
    }
  } catch (error) {
    console.error('Redis error:', error);
    next();
  }
};

const clearCache = async (key) => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const deletedCount = await redisClient.del(key);
    console.log(`Deleted ${deletedCount} keys with pattern: ${key}`);
  } catch (error) {
    console.error('Redis error:', error);
  }
};

module.exports = { createCache, clearCache };
