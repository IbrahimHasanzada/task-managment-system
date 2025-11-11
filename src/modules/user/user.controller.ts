import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.dto';
import { CreateUserDto } from './dto/create.dto';
import { Auth } from '../../shared/decorators/auth.decorator';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) { }
    @Get()
    @Auth()
    async getAllUsers() {
        return await this.userService.list();
    }

    @Get(':id')
    @Auth()
    async getUserById(@Param('id') id: number) {
        return await this.userService.getUserById(id);
    }

    @Post()
    @Auth()
    async createUser(@Body() body: CreateUserDto) {
        return await this.userService.create(body);
    }

    @Post(':id')
    @Auth()
    async updateUser(
        @Param('id') id: number,
        @Body() body: UpdateUserDto,
    ) {
        return await this.userService.update(id, body);
    }

    @Delete(':id')
    @Auth()
    async deleteUser(@Param('id') id: number) {
        return await this.userService.deleteUser(id);
    }

}