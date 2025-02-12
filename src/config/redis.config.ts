import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';
import path from 'node:path';
dotenv.config({ path: path.join(__dirname, '../../.env') });
import genericPool from 'generic-pool';

const redisPool = genericPool.createPool(
  {
    create: async () => {
      // throw new Error('Test Error Occured');
      const client = createClient({
        url: process.env.REDIS_CONN_URL,
      });
      await client.connect();

      return client;
    },
    destroy: async (client: RedisClientType) => {
      await client.disconnect();
    },
  },
  {
    min: 1,
    max: 10,
    acquireTimeoutMillis: 5000,
  }
);

export const executeRedisCommand = async <T>(
  // eslint-disable-next-line no-unused-vars
  command: (client: ReturnType<typeof createClient>) => Promise<T>
): Promise<T> => {
  const client = await redisPool.acquire().catch((err) => {
    throw err;
  });
  try {
    return await command(client);
  } finally {
    await redisPool.release(client);
  }
};
