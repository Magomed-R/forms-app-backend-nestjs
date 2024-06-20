import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailerService } from 'src/mailer/mailer.service';
import authDto from './entities/authDto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly mailerService: MailerService,
    ) {}

    @Post('register')
    async register(@Body() authDto: authDto) {
        return this.authService.register(authDto);
    }

    @Post('login')
    async login(@Body() authDto: authDto) {
        return this.authService.login(authDto);
    }

    @HttpCode(200)
    @Post('sendcode')
    async sendCode(@Body() mailDto: { mail: string }) {
        return this.mailerService.sendCode(mailDto.mail);
    }
}
