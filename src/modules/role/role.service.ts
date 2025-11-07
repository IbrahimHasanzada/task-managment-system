import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { RoleEntity } from '../../entities/role.entity';
import { Repository } from 'typeorm';
import { RoleDto } from './dto/create.dto';
@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private roleRepo: Repository<RoleEntity>
    ) { }


    async roleList() {

        let roles = await this.roleRepo.find()

        return roles
    }

    async create(params: RoleDto) {

        let checkedRole = await this.roleRepo.findOne({ where: { role: params.role } })

        if (checkedRole) throw new ConflictException('Vəzifə artıq mövcuddur!')

        const role = this.roleRepo.create(params)

        await role.save()

        return role
    }

    async findByName(role: string) {
        return this.roleRepo.findOne({ where: { role } });
    }


    async update(id: number, params: RoleDto) {
        let checkRole = await this.roleRepo.findOne({ where: { id } })

        if (!checkRole) throw new NotFoundException('Belə bir vəzifə tapılmadı!')

        let checkRoleName = await this.roleRepo.findOne({ where: { role: params.role } })

        if (checkRoleName) throw new ConflictException('Vəzifə adı artıq mövcuddur!')

        checkRole.role = params.role

        await checkRole.save()
    }

    async deleteRole(id: number) {

        let checkRole = await this.roleRepo.findOne({ where: { id } })

        if (!checkRole) throw new NotFoundException('Belə bir vəzifə tapılmadı!')

        await this.roleRepo.delete({ id })

        return { message: 'Vəzifə uğurla silindi!' }
    }

}