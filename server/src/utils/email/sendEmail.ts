import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { Payload } from '../../@types';

const sendEmail = async (email: string, subject: string, payload: Payload, template: string) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), 'utf8');
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('email sent');
      }
    });
  } catch (error) {
    return error;
  }
};

export default sendEmail;