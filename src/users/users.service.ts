import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createUserDto: Prisma.UserCreateInput) {
        return this.databaseService.user.create({ data: createUserDto });
    }

    async findAll() {
        return this.databaseService.user.findMany({
            select: {
                password: false,
                mail: false,
            },
        });
    }

    async findOne(id: number) {
        return this.databaseService.user.findUnique({
            where: { id },
            select: {
                password: false,
                mail: false,
                id: true,
                username: true,
                comments: true,
                createdAt: true,
                forms: true,
                history: true,
            },
        });
    }

    async remove(id: number) {
        await this.databaseService.user.delete({ where: { id } });
        await this.databaseService.form.deleteMany({
            where: {
                authorId: id,
            },
        });
        await this.databaseService.comment.deleteMany({
            where: {
                userId: id,
                Form: {
                    authorId: id,
                },
            },
        });
    }
}
