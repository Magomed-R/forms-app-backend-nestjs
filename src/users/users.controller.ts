import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: Prisma.UserCreateInput, @Res() res: Response) {
        if (!createUserDto.username || !createUserDto.password) return res.sendStatus(400);
        else if (!/^[a-zA-Z0-9-_]+$/.test(createUserDto.username)) return res.sendStatus(403);

        return res.json(await this.usersService.create(createUserDto));
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id') 
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
