import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload';
import { FastifyPluginAsync } from 'fastify';
import { FastifySES } from '@/plugins/ses';

declare module 'fastify' {
  interface FastifyInstance {
    ses: FastifySES;
  }
}

export type AppOptions = {} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
  });

  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
  });
};

export default app;
export { app };
