import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import answerDto from './entities/answerDto';
import payloadDto from 'src/auth/entities/payloadDto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AnswersService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(answerDto: payloadDto & answerDto) {
        const { answer, isRight, testId, user } = answerDto;

        if (!answer || isRight === undefined || testId === undefined) throw new BadRequestException('All fields are required');

        const test = await this.databaseService.test.findUnique({ where: { id: testId } });

        if (!test) throw new NotFoundException('Test not found');

        const form = await this.databaseService.form.findUnique({ where: { id: test.formId } });

        if (!form) throw new NotFoundException('Form not found');
        if (form.authorId !== user.id) throw new ForbiddenException('You are not the creator of this form');

        return await this.databaseService.answer.create({
            data: {
                answer,
                isRight,
                test: {
                    connect: {
                        id: testId,
                    },
                },
            },
        });
    }

    async update(id: number, answerDto: payloadDto & answerDto) {
        const { answer, isRight, user } = answerDto;

        if (id === undefined || typeof id !== 'number' || !answer || isRight === undefined)
            throw new BadRequestException('All fields are required');

        const answer_db = await this.databaseService.answer.findUnique({ where: { id }, select: { test: { select: { form: true } } } });

        if (!answer_db) throw new NotFoundException('Form not found');
        if (answer_db.test.form.authorId !== user.id) throw new ForbiddenException('You are not the creator of this form');

        return await this.databaseService.answer.update({
            where: { id },
            data: { answer, isRight },
        });
    }

    async remove(id: number, asnwerDto: payloadDto) {
        const { user } = asnwerDto;

        if (id === undefined || typeof id !== 'number') throw new BadRequestException('All fields are required');

        const answer = await this.databaseService.answer.findUnique({ where: { id }, select: { test: { select: { form: true } } } });

        if (answer.test.form.authorId !== user.id) throw new ForbiddenException('You are not the creator of this form');

        await this.databaseService.answer.delete({ where: { id } });

        return;
    }
}
