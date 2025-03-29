import { mailTransporter } from '../utils/sendMail';

export const sendGuideProfileRejectedEmail = (email: string, remarks: string) => {
  return mailTransporter.sendMail({
    to: email,
    subject: `Guide Compass - Profile Rejected`,
    text: `
Your profile  on Guide Compass is rejected!
Remarks: ${remarks}

You can address the remarks and submit for review again.

    `,
    from: 'Guide Compass accounts@guidecompass.com',
  });
};
export const sendGuideProfileAcceptedEmail = (email: string) => {
  return mailTransporter.sendMail({
    to: email,
    subject: `Guide Compass - Profile Accepted`,
    text: `
Congratulations! Your profile  on Guide Compass is Accepted!
You will now start appearning on searches and recommendation.

We are honoured to have you on our platform!
    `,
    from: 'Guide Compass accounts@guidecompass.com',
  });
};
