import { Body, Controller, Delete, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import payloadDto from '../auth/entities/payloadDto';
import testDto from './entities/testDto';
import { TestsService } from './tests.service';

@Controller('tests')
export class TestsController {
    constructor(private readonly testsService: TestsService) {}

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Post()
    async create(@Body() createTestDto: payloadDto & testDto) {
        return this.testsService.create(createTestDto);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTestDto: payloadDto & testDto) {
        return this.testsService.update(+id, updateTestDto);
    }

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Delete(':id')
    async delete(@Param('id') id: string, @Body() deleteTestDto: payloadDto) {
        return this.testsService.delete(+id, deleteTestDto);
    }
}
