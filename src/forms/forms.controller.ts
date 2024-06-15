import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormsService } from './forms.service';
import { Prisma } from '@prisma/client';

@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) {}

    @Post()
    create(
        @Body()
        createFormDto: {
            title: string;
            tests: [
                {
                    question: string;
                    answers: [
                        {
                            answer: string;
                            is_right: boolean;
                            number: number;
                        },
                    ];
                },
            ];
        },
    ) {
        return;
        // this.formsService.create({
        //     title: createFormDto.title,
            // author:  
        // });
    }

    @Get()
    findAll() {
        return this.formsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.formsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFormDto: Prisma.FormUpdateInput) {
        return this.formsService.update(+id, updateFormDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.formsService.remove(+id);
    }
}
