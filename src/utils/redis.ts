import { RedisClientType } from 'redis';
import { executeRedisCommand } from '../config/redis.config';

export const redisPublishMessage = (channel: string, message: object) => {
  return executeRedisCommand((client) => client.PUBLISH(channel, JSON.stringify(message)));
};

export const redisSubscribeChannel = (...args: Parameters<RedisClientType['subscribe']>) => {
  return executeRedisCommand((client) => client.subscribe(...args));
};
