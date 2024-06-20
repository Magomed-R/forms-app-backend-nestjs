import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AuthGuard } from '../auth/auth.guard';
import answerDto from './entities/answerDto';

@Controller('answers')
export class AnswersController {
    constructor(private readonly answersService: AnswersService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(answerDto: answerDto) {
        return this.answersService.create(answerDto)
    }
}
