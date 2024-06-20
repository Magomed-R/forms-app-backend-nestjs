import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import authDto from './entities/authDto';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly usersService: UsersService,
        private JwtService: JwtService,
    ) {}

    public async register(authDto: authDto) {
        const { username, password, mail, code } = authDto;

        if (!username || !password || !mail || !code) throw new BadRequestException('Not enough data');

        if ((await this.getUserByEmail(mail)) !== null) throw new ConflictException('User with this mail already exists');

        if (!/^[a-zA-Z0-9-_]+$/.test(username)) throw new ForbiddenException("Username cannot contain characters other than '-' and '_'");

        if (!(await this.checkCode(mail, code))) throw new UnauthorizedException('Incorrect mail code');

        const salt = await bcrypt.genSalt(7);
        const hash = await bcrypt.hash(password, salt);

        const user = await this.usersService.create({
            username,
            password: hash,
            mail,
        });

        const payload = { id: user.id };

        return {
            access_token: await this.JwtService.signAsync(payload),
        };
    }

    async login(authDto: authDto) {
        const { mail, password, code } = authDto;

        if (!password || !mail || !code) throw new BadRequestException('Not enough data');

        const user = await this.databaseService.user.findUnique({
            where: { mail },
        });

        if (!user) throw new NotFoundException('User not found');

        if (!(await bcrypt.compare(password, user.password))) throw new ForbiddenException('Invalid password');

        if (!(await this.checkCode(mail, code))) throw new UnauthorizedException('Incorrect mail code');

        const payload = { id: user.id };

        return {
            access_token: await this.JwtService.signAsync(payload),
        };
    }

    async getUserByEmail(mail: string) {
        return this.databaseService.user.findUnique({
            where: {
                mail,
            },
        });
    }

    async checkCode(mail: string, code: string): Promise<boolean> {
        const codeObject = await this.databaseService.checkMail.findFirst({
            where: {
                mail,
                confirmed: false,
            },
        });

        if (!codeObject) return false;

        if (codeObject.code === code)
            await this.databaseService.checkMail.updateMany({
                data: {
                    confirmed: true,
                },
                where: {
                    mail,
                },
            });

        return codeObject.code === code;
    }
}
