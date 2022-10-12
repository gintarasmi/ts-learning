import { createClient, RedisClientType } from 'redis';
import { config } from './Config';

export async function redisOpen() {
  var client = createClient({ url: config.redis.url });
  client.connect();
  return client;
}
