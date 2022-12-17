import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import { BASE_URL, SENDGRID } from '@config';

interface SendMailProps {
  email: string;
  type: 'confirm' | 'reset-pass';
  confirm?: {
    token: string;
  };
}
// Send the email
export const sendMail = async function (options: SendMailProps) {
  try {
    let mailOptions = { from: 'contact@ntcde.com' };
    const { type = 'confirm', email, confirm } = options;
    const { token } = confirm;
    switch (type) {
      case 'confirm':
        const verifyUrl = BASE_URL + '/verify?token=' + token;
        mailOptions = {
          ...mailOptions,
          ...{
            to: email,
            subject: 'Account Verification Token',
            html: `Hello,<br><br>
Please verify your account by clicking the link or copy code add to input verify:<br><br>
<a href='${verifyUrl}'>Follow link to verify</a><br><br>
<code>${token}</code>`,
          },
        };
        break;
      case 'reset-pass':
        mailOptions = {
          ...mailOptions,
          ...{
            to: email,
            subject: 'Account Reset Password',
            html:
              'Hello,<br><br>' +
              'Your password has been reset! Below is your new password.<br><br>' +
              '<code>' +
              token +
              '</code> <br><br>' +
              'You can change the password in your account section.',
          },
        };
        break;
      default:
        console.log('sendMail default');
        break;
    }
    const transporter = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: SENDGRID.APIKEY,
        },
      }),
    );
    await transporter.sendMail(mailOptions);
  } catch (e) {
    console.log('sendMail err', e);
  }
};
