import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly usersService: UsersService,
        private JwtService: JwtService,
    ) {}

    public async register(userDto: { username: string; password: string; mail: string; code: string }, res: Response) {
        const { username, password, mail, code } = userDto;

        if (!username || !password || !mail || !code) return res.status(400).json({ error: 'Not enough data' });

        if ((await this.getUserByEmail(mail)) !== null) return res.status(409).json({ error: 'User with this mail already exists' });

        if (!/^[a-zA-Z0-9-_]+$/.test(username))
            return res.status(403).json({ error: "Username cannot contain characters other than '-' and '_'" });

        if (!(await this.checkCode(mail, code))) return res.status(401).json({ error: 'Incorrect mail code' });

        const salt = await bcrypt.genSalt(7);
        const hash = await bcrypt.hash(password, salt);
        console.log(hash);

        const user = await this.usersService.create({
            username,
            password: hash,
            mail,
        });

        const payload = { id: user.id };

        return res.status(200).json({
            access_token: await this.JwtService.signAsync(payload),
        });
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

        return codeObject.code === code;
    }
}
