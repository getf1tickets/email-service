import { QueueHandler } from '@getf1tickets/sdk';
import { FastifyInstance } from 'fastify';
import { sendNewUserEmail } from '@/helpers/email';

export const userCRUDHandler: QueueHandler = async (
  fastify: FastifyInstance,
  type: string,
  data: any,
) => {
  fastify.log.debug(`Receive user curd with type: ${type}`);

  if (type === 'created') {
    await sendNewUserEmail(fastify, data.email);
  }
};

export const a = null;
