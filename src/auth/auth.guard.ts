import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly JwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const res: Response = context.switchToHttp().getResponse();
        const req: Request = context.switchToHttp().getRequest();

        if (!req.headers.authorization) throw new UnauthorizedException('Authorization token required');

        const token = req.headers.authorization.split(' ')[1];

        if (!token) throw new BadRequestException('Invalid token');

        try {
            const payload = await this.JwtService.verify(token);

            req.body.id = payload.id;

            return true;
        } catch (e) {
            throw new BadRequestException('Invalid token');
        }
    }
}
