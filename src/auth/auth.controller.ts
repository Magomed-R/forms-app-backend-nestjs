import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    async register(@Body() userDto: { username: string; password: string; mail: string; code: string }, @Res() res: Response) {
        return this.authService.register(userDto, res);
    }

    @Post('sendcode')
    async sendCode(@Body() mailDto: {mail: string}) {
        
    }
}
