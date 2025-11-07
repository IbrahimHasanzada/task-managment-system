import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../../entities/role.entity';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity]), UserModule],
    controllers: [RoleController],
    providers: [RoleService],
})
export class RoleModule { };