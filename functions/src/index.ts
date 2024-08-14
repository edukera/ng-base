import * as admin from "firebase-admin";
import { defineString } from "firebase-functions/params";
import { https, logger } from "firebase-functions/v2";
import * as postmark from "postmark";

admin.initializeApp();

const postmarkAPIKey = defineString('POSTMARK_APIKEY');

async function sendEmail(
  email: string,
  emailtype: 'verification' | 'resetpwd'
) {
  let client = new postmark.ServerClient(postmarkAPIKey.value());
  try {
    let url = '';
    let template = '';
    switch (emailtype) {
      case 'verification': {
        url = await admin.auth().generateEmailVerificationLink(email);
        template = 'ng-base-verification';
        break;
      }
      case 'resetpwd': {
        url = await admin.auth().generatePasswordResetLink(email);
        template = 'ng-base-pwdreset';
        break;
      }
    }
    logger.info(url);

    const templatedMessage = new postmark.Models.TemplatedMessage(
      'contact@edukera.com',
      template,
      { url: url },
      email
    );
    templatedMessage.Metadata = { "Key": "Value" };

    await client.sendEmailWithTemplate(templatedMessage);
    logger.info(`${emailtype} email sent to:`, email);
  } catch (error) {
    // Log the error and throw an HttpsError to notify the client of the failure
    logger.error('Error when sending email:', error);
    throw new https.HttpsError('internal', 'An error occurred while sending the email. Please try again later.');
  }
}

export const sendVerificationEmail = https.onCall(async (request: https.CallableRequest<any>) => {
  const email = request.auth?.token.email;
  if (!email) {
    throw new https.HttpsError('failed-precondition', 'Not authenticated.');
  }
  await sendEmail(email, 'verification');
});

type PwdResetData = {
  email: string
}

export const sendPasswordResetEmail = https.onCall(async (request: https.CallableRequest<PwdResetData>) => {
  const email = request.data.email
  await sendEmail(email, 'resetpwd');
});
