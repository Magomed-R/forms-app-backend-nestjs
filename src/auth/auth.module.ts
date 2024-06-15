import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
        }),
        MailerModule
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService, AuthGuard],
    exports: []
})
export class AuthModule {}
