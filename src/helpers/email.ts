import { FastifyInstance } from 'fastify';

export const sendNewUserEmail = async (fastify: FastifyInstance, email: string) => {
  await fastify.ses.sendEmail(
    null,
    email,
    'Welcome to F1 Tickets !',
    'Hi there,\n\n'
    + 'We\'re excited to welcome you to the F1 Tickets community! We\'re so lucky to have you.\n\n'
    + 'We are here to help make sure you get the results you expect from our website, so don\'t hesitate to reach out with questions. We\'d love to hear from you.\n\n'
    + 'Cheers.\nF1 Tickets',
  );
};

export const a = null;
