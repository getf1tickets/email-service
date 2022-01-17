import fp from 'fastify-plugin';
import { userCRUDHandler } from '@/amqp/handlers/user';

export default fp(async (fastify) => {
  await fastify.amqp.createQueue('user.curd', userCRUDHandler);
}, {
  name: 'amqp-registration',
  dependencies: ['sdk-registration', 'sdk-amqp'],
});
