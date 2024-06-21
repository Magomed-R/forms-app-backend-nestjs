import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import formDto from './entities/formDto';
import payloadDto from 'src/auth/entities/payloadDto';

@Injectable()
export class FormsService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(formDto: formDto) {
        const { title, authorId, open } = formDto;

        if (!title) throw new BadRequestException('All fields are required');

        return this.databaseService.form.create({
            data: {
                title,
                authorId,
                open: open || true,
            },
        });
    }

    async findAll(userId: number) {
        const whereOption: { authorId?: number; open?: boolean } = { open: true };

        if (userId) whereOption.authorId = userId;

        return this.databaseService.form.findMany({
            where: whereOption,
            select: {
                _count: true,
                createdAt: true,
                id: true,
                title: true,
            },
        });
    }

    async findOne(id: number) {
        const form = this.databaseService.form.findUnique({
            where: { id },
            select: {
                tests: {
                    select: {
                        answers: {
                            select: {
                                isRight: false,
                                answer: true,
                                id: true,
                            },
                        },
                        question: true,
                    },
                },
                author: {
                    select: {
                        id: true,
                        username: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                comments: true,
                createdAt: true,
                id: true,
                history: true,
                title: true,
            },
        });

        if (!form) throw new NotFoundException('Form not found');

        return form;
    }

    async update(id: number, updateFormDto: payloadDto & Prisma.FormUpdateInput) {
        const { title, open, user, ready } = updateFormDto;

        if (id === undefined || title === undefined || open === undefined) throw new BadRequestException('All fields are required');

        const form = await this.databaseService.form.findUnique({ where: { id } });

        if (!form) throw new NotFoundException('Form not found');
        if (form.authorId !== user.id) throw new ForbiddenException('Your not author of this form');

        return this.databaseService.form.update({ where: { id }, data: { title, open, ready: ready || false } });
    }

    async remove(id: number, userId: number) {
        if (!id) throw new BadRequestException('All fields are required');

        const form = await this.databaseService.form.findUnique({ where: { id } });

        if (!form) throw new NotFoundException('Form not found');
        if (form.authorId !== userId) throw new ForbiddenException('Your not author of this form');

        await this.databaseService.answer.deleteMany({ where: { test: { formId: id } } });
        await this.databaseService.test.deleteMany({ where: { formId: id } });
        await this.databaseService.form.delete({ where: { id } });

        return;
    }
}
