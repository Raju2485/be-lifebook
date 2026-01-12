import config from '../config/config';
import { compile } from './handlebarsHelpers';
import { ConfidentialClientApplication } from '@azure/msal-node';
import axios from 'axios';

export  const sendEmail = async ({toEmail, subject, template, context}) => {
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
      const accessToken = result.accessToken;
      // console.log(`Access Token: ${accessToken}`);

      if (Array.isArray(toEmail)) {
        toEmail = toEmail
          .map((email) => email.trim())
          .filter((email) => email)
          .map((email) => ({ emailAddress: { address: email } }));
      } else {
        toEmail = toEmail
          .split(',')
          .map((email) => email.trim())
          .filter((email) => email)
          .map((email) => ({ emailAddress: { address: email } }));
      }

      const content = await compile(template, context);

      const msg = {
        message: {
          subject,
          toRecipients: toEmail,
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
      console.log(`Email sent to ${JSON.stringify(toEmail)}`);
    } catch (error) {
      console.log(`Error sending email: ${error}`);
    }
  };
