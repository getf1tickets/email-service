import fp from 'fastify-plugin';
import * as SES from 'aws-sdk/clients/ses';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface FastifySES {
  sendEmail: (
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string,
    extra: string) => Promise<void>
}

export default fp(async (fastify) => {
  const sesConfig = {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION,
  };

  const ses = new SES(sesConfig);

  const wrapEmailWithTemplate = async (subject: string, text: string, extra: string = '') => {
    const emailTemplate = (await fs.readFile(path.join(__dirname, '../../src/static/html/email.html'))).toString();
    const replacedText = text.replace(/(?:\r\n|\r|\n)/g, '<br>');

    let html = `${emailTemplate}`;
    html = html.replace(/{{subject}}/g, subject);
    html = html.replace(/{{text}}/g, replacedText);
    html = html.replace(/{{extra}}/g, extra);

    return html;
  };

  const sendEmail = async (
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string,
    extra: string,
  ) => {
    if (!subject && (!text || !html)) {
      throw new Error('Invalid email request');
    }

    if (!html && text) {
      // tslint:disable-next-line: no-parameter-reassignment
      // eslint-disable-next-line no-param-reassign
      html = await wrapEmailWithTemplate(subject, text, extra);
    }

    const params = {
      Source: from || 'F1 Tickets <noreply@getf1tickets.com>',
      Destination: {
        ToAddresses: [
          to,
        ],
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          },
          Text: {
            Charset: 'UTF-8',
            Data: text,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
    };

    await ses.sendEmail(params).promise();
  };

  fastify.decorate('ses', {
    sendEmail,
  });
}, {
  name: 'ses',
});
