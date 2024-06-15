import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FormsService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createFormDto: Prisma.FormCreateInput) {
        return this.databaseService.form.create({
            data: createFormDto,
        });
    }

    async findAll() {
        return this.databaseService.form.findMany({});
    }

    async findOne(id: number) {
        return this.databaseService.form.findUnique({
            where: {
                id,
            },
        });
    }

    async update(id: number, updateFormDto: Prisma.FormUpdateInput) {
        return this.databaseService.form.update({ where: { id }, data: updateFormDto });
    }

    remove(id: number) {
        return this.databaseService.form.delete({ where: { id } });
    }
}
