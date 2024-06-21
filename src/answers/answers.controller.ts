import { Body, Controller, Delete, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AuthGuard } from '../auth/auth.guard';
import answerDto from './entities/answerDto';
import payloadDto from 'src/auth/entities/payloadDto';

@Controller('answers')
export class AnswersController {
    constructor(private readonly answersService: AnswersService) {}

    @UseGuards(AuthGuard)
    @HttpCode(201)
    @Post()
    async create(@Body() answerDto: payloadDto & answerDto) {
        return this.answersService.create(answerDto);
    }

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() answerDto: payloadDto & answerDto) {
        return this.answersService.update(+id, answerDto);
    }

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Delete(':id')
    async remove(@Param('id') id: string, @Body() asnwerDto: payloadDto) {
        return this.answersService.remove(+id, asnwerDto);
    }
}
