import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import testDto from './entities/testDto';
import payloadDto from '../auth/entities/payloadDto';

@Injectable()
export class TestsService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createTestDto: payloadDto & testDto) {
        const { question, formId, user } = createTestDto;

        if (!question || !formId) throw new BadRequestException('All fields are required');

        const form = await this.databaseService.form.findUnique({ where: { id: formId } });

        if (!form) throw new NotFoundException('Form not found');

        if (form.authorId !== user.id) throw new ForbiddenException('You are not the creator of this form');

        return await this.databaseService.test.create({
            data: {
                question: question,
                form: {
                    connect: {
                        id: formId,
                    },
                },
            },
        });
    }

    async update(id: number, updateTestDto: payloadDto & testDto) {
        if (!updateTestDto.question) throw new BadRequestException('All fields are required');

        const test = await this.databaseService.test.findUnique({ where: { id } });

        if (!test) throw new NotFoundException('Test not found');

        const form = await this.databaseService.form.findUnique({ where: { id: test.formId } });

        if (!form) throw new NotFoundException('Form not found');

        if (form.authorId !== updateTestDto.user.id) throw new ForbiddenException('You are not the creator of this form');

        return this.databaseService.test.update({ where: { id }, data: { question: updateTestDto.question } });
    }

    async delete(id: number, deleteTestDto: payloadDto) {
        const test = await this.databaseService.test.findUnique({ where: { id } });

        if (!test) throw new NotFoundException('Test not found');

        const form = await this.databaseService.form.findUnique({ where: { id: test.formId } });

        if (!form) throw new NotFoundException('Form not found');

        if (form.authorId !== deleteTestDto.user.id) throw new ForbiddenException('You are not the creator of this form');

        await this.databaseService.test.delete({ where: { id } });
        return;
    }
}
