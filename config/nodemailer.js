import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD } from './env.js';

const transporter = nodemailer.createTransport ( {
  service: 'yahoo',
  auth: {
    user: 'kamsonuel@yahoo.com',
    pass: EMAIL_PASSWORD
  }
})