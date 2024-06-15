import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { DatabaseService } from 'src/database/database.service';
import * as crypto from 'crypto';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Response } from 'express';

const { MAIL_USER, MAIL_PASS } = process.env;

@Injectable()
export class MailerService {
    private mailer: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    constructor(private readonly databaseService: DatabaseService) {
        this.mailer = nodemailer.createTransport({
            service: 'mail.ru',
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASS,
            },
        });
    }

    async sendCode(mail: string, res: Response) {
        if (!this.validateMail(mail)) return res.status(400).json({ message: 'Invalid mail' });

        const code = crypto.randomBytes(2).toString('hex');

        await this.databaseService.checkMail.updateMany({
            data: {
                confirmed: true,
            },
            where: {
                mail: mail,
            },
        });

        await this.databaseService.checkMail.create({
            data: {
                mail,
                code,
                confirmed: false,
            },
        });

        await this.mailer.sendMail({
            to: mail,
            from: MAIL_USER,
            subject: 'Authorization code',
            html: `Do not share your authorization code with anyone: <div style='display: flex; justify-content: center; align-items: center; height: 80px; background: #0003'><b style='text-align: center; font-size: 40px;'>${code}</b></div>`,
        });

        return res.sendStatus(200);
    }

    validateMail(mail: string) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            mail,
        );
    }
}
