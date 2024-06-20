import { Controller, Get, Body, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Body() idDto: { id: number | string }) {
        if (id !== String(idDto.id)) throw new ForbiddenException('This is not your account');

        return this.usersService.remove(+id);
    }
}
