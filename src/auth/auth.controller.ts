import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { MailerService } from 'src/mailer/mailer.service';
import authDto from './entities/authDto';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly mailerService: MailerService,
    ) {}

    @Post('register')
    async register(@Body() authDto: authDto, @Res() res: Response) {
        return this.authService.register(authDto, res);
    }

    @Post('login')
    async login(@Body() authDto: authDto, @Res() res: Response) {
        return this.authService.login(authDto, res)
    }

    @Post('sendcode')
    async sendCode(@Body() mailDto: { mail: string }, @Res() res: Response) {
        return this.mailerService.sendCode(mailDto.mail, res);
    }
}
