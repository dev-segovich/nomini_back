import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMailWithAttachment(to: string, subject: string, text: string, filename: string, content: Buffer) {
    if (!to) {
        console.warn('No recipient email provided, skipping email sending.');
        return;
    }

    try {
      await this.transporter.sendMail({
        from: `"Nomini" <${process.env.MAIL_USER || 'no-reply@nomini.com'}>`,
        to,
        subject,
        text,
        attachments: [
          {
            filename,
            content,
          },
        ],
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
