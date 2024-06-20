import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, Query } from '@nestjs/common';
import { FormsService } from './forms.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import payloadDto from 'src/auth/entities/payloadDto';

@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) {}

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() formDto: { title: string; user: { id: number } }) {
        return this.formsService.create({ title: formDto.title, authorId: formDto.user.id });
    }

    @Get()
    findAll(@Query("userId") userId: string) {
        return this.formsService.findAll(+userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.formsService.findOne(+id);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFormDto: payloadDto & { title: string }) {
        return this.formsService.update(+id, updateFormDto);
    }

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Delete(':id')
    remove(@Param('id') id: string, @Body() removeFormDto: payloadDto) {
        return this.formsService.remove(+id, removeFormDto.user.id);
    }
}
