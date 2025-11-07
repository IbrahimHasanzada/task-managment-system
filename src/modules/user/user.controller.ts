import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.dto';
import { CreateUserDto } from './dto/create.dto';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) { }
    @Get()
    async getAllUsers() {
        return await this.userService.list();
    }

    @Get(':id')
    async getUserById(@Param('id') id: number) {
        return await this.userService.getUserById(id);
    }

    @Post()
    async createUser(@Body() body: CreateUserDto) {
        return await this.userService.create(body);
    }

    @Post(':id')
    async updateUser(
        @Param('id') id: number,
        @Body() body: UpdateUserDto,
    ) {
        return await this.userService.update(id, body);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        return await this.userService.deleteUser(id);
    } 

}