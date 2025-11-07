import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/create.dto';
import { Auth } from '../../shared/decorators/auth.decorator';

@Controller('role')
export class RoleController {
    constructor(
        private roleService: RoleService
    ) { }

    @Get()
    async roleList() {
        return await this.roleService.roleList()
    }

    @Post()
    @Auth('admin')
    async create(@Body() body: RoleDto) {
        return await this.roleService.create(body)
    }

    @Post(':id')
    @Auth('admin')
    async update(@Body() body: RoleDto, @Param('id') id: number) {
        return await this.roleService.update(id, body)
    }
    @Delete(':id')
    @Auth('admin')
    async deleteRole(@Param('id') id: number) {
        return await this.roleService.deleteRole(id)
    }


}