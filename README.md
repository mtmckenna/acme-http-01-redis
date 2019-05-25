# acme-http-01-redis
Redis-backed challenge strategy for [greenlock-express.js (and greenlock.js)](https://www.npmjs.com/package/greenlock-express).

## Install

```
npm install --save acme-http-01-redis
```

## Requirements

For both local and production environments, you'll need to have a Redis server running.

## Integration

### greenlock-express.js

```javascript
const greenlock = require("greenlock-express");
const redis = require("redis");
const redisConfig = { host: REDIS_HOST, password: REDIS_PASSWORD, port: REDIS_PORT };
const redisClient = redis.createClient(redisConfig);

const challenge = require("acme-http-01-redis").create({
  redisClient, // If omitted, a Redis client will be created using 127.0.0.1 as the host
  hashKey: "acme-challenges", // Optional--the default hash key is "acme-challenges"
});

const glx = greenlock.create({
  challenges: { "http-01": challenge },
  // plus the rest of your setup
});

```

## Testing

`acme-http-01-redis` is tested against the [greenlock-challenge-test](https://git.coolaj86.com/coolaj86/greenlock-challenge-test.js).

## License

MIT
