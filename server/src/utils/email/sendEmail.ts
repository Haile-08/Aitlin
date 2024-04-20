import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { Payload } from '../../@types';
import { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_USERNAME, FROM_EMAIL } from '../../config';

const sendEmail = async (email: string, subject: string, payload: Payload, template: string) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: EMAIL_HOST,
      port: 465,
      secure: false,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), 'utf8');
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: FROM_EMAIL,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res = await new Promise<boolean>((resolve, reject) => {
      transporter.sendMail(options(), (error, info) => {
        if (error) {
          console.error(error);
          resolve(false); // Reject the promise
        } else {
          console.log('Email sent:', info.response);
          resolve(true); // Resolve the promise
        }
      });
    });

    return res;
  } catch (error) {
    return error;
  }
};

export default sendEmail;