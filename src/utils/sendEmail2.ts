import config from '../config/config';
import { compile } from './handlebarsHelpers';
import { ConfidentialClientApplication } from '@azure/msal-node';
import axios from 'axios';

type GraphEmailRecipient = {
  emailAddress: { address: string };
};

type SendEmailParams = {
  toEmail: string | string[];
  subject: string;
  template: string;
  context: Record<string, unknown>;
};

export const sendEmail = async ({
  toEmail,
  subject,
  template,
  context,
}: SendEmailParams) => {
  try {
    const cca = new ConfidentialClientApplication({
      auth: {
        clientId: config.MSAL.EMAIL_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${config.MSAL.TENANT_ID}`,
        clientSecret: config.MSAL.EMAIL_CLIENT_SECRET,
      },
    });

    const result = await cca.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'],
    });
    if (!result?.accessToken) {
      throw new Error('Failed to acquire Microsoft Graph access token');
    }
    const accessToken = result.accessToken;

    let toRecipients: GraphEmailRecipient[];
    if (Array.isArray(toEmail)) {
      toRecipients = toEmail
        .map((email: string) => email.trim())
        .filter((email: string) => email)
        .map((email: string) => ({ emailAddress: { address: email } }));
    } else {
      toRecipients = toEmail
        .split(',')
        .map((email: string) => email.trim())
        .filter((email: string) => email)
        .map((email: string) => ({ emailAddress: { address: email } }));
    }

    const content = await compile(template, context);

    const msg = {
      message: {
        subject,
        toRecipients,
        body: {
          contentType: 'HTML',
          content,
        },
      },
    };

    await axios.post(
      `https://graph.microsoft.com/v1.0/users/${config.EMAIL_ID}/sendMail`,
      msg,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`Email sent to ${JSON.stringify(toRecipients)}`);
  } catch (error) {
    console.log(`Error sending email: ${error}`);
  }
};
