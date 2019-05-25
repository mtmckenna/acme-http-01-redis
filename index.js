const { promisify } = require("util");
const redis = require("redis");

module.exports = class RedisChallenge {
  static create(config = {}) {
    return new RedisChallenge(config);
  }

  constructor(config) {
    this.config = Object.assign({ hashKey: "acme-challenges" }, config);
    if (!this.config.redisClient) {
      const redisConfig = Object.assign({}, this.config.redisConfig);
      this.config.redisClient = redis.createClient(redisConfig);
    }
  }

  async set(opts) {
    const { hashKey, redisClient } = this.config;
    const { challenge } = opts;
    const { altname, keyAuthorization, token } = challenge;
    const hset = promisify(redisClient.hset).bind(redisClient);

    return await hset(hashKey, hashField(altname, token), keyAuthorization);
  }

  async get(query) {
    const { hashKey, redisClient } = this.config;
    const { challenge } = query;
    const { identifier, token } = challenge;
    const domain = identifier.value;
    const hget = promisify(redisClient.hget).bind(redisClient);

    const secret = await hget(hashKey, hashField(domain, token));
    return secret ? { keyAuthorization: secret } : null;
  }

  async remove(opts) {
    const { hashKey, redisClient } = this.config;
    const { challenge } = opts;
    const { identifier, token } = challenge;
    const domain = identifier.value;
    const hdel = promisify(redisClient.hdel).bind(redisClient);

    return await hdel(hashKey, hashField(domain, token));
  }
}

function hashField(domain, token) {
  return `${domain}:${token}`;
}