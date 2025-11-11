import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from '../../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsEntity } from '../../entities/uploads.entity';
import { RoleEntity } from '../../entities/role.entity';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, UploadsEntity, RoleEntity])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { };