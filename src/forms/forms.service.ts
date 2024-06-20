import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import formDto from './entities/formDto';
import payloadDto from 'src/auth/entities/payloadDto';

@Injectable()
export class FormsService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(formDto: formDto) {
        const { title, authorId } = formDto;

        if (!title) throw new BadRequestException('All fields are required');

        return this.databaseService.form.create({
            data: {
                title,
                authorId,
            },
        });
    }

    async findAll() {
        return this.databaseService.form.findMany({});
    }

    async findOne(id: number) {
        const form = this.databaseService.form.findUnique({ where: { id } });

        if (!form) throw new NotFoundException('Form not found');

        return form;
    }

    async update(id: number, updateFormDto: payloadDto & Prisma.FormUpdateInput) {
        const form = await this.databaseService.form.findUnique({ where: { id } });

        if (!form) throw new NotFoundException('Form not found');

        if (form.authorId !== updateFormDto.user.id) throw new ForbiddenException('Your not author of this form');

        return this.databaseService.form.update({ where: { id }, data: { title: updateFormDto.title } });
    }

    async remove(id: number, userId: number) {
        const form = await this.databaseService.form.findUnique({ where: { id } });

        if (!form) throw new NotFoundException('Form not found');

        if (form.authorId !== userId) throw new ForbiddenException('Your not author of this form');

        await this.databaseService.form.delete({ where: { id } });

        return;
    }
}
