import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update.dto';
import { ClsService } from 'nestjs-cls';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private cls: ClsService
    ) { }


    async getUserById(id: number) {
        return await this.userRepo.findOne({
            where: { id },
            relations: ['role'],
            select: {
                id: true,
                username: true,
                avatar: true,
                email: true,
                phone: true,
                role: {
                    id: true,
                    role: true
                },
                createdAt: true,
                roleId: true,
            }
        })
    }

    async list() {
        return await this.userRepo.find({ relations: ['role'] })
    }

    async findByEmail(email: string) {
        return this.userRepo.findOne({ where: { email } });
    }


    async create(params: CreateUserDto) {
        let user = await this.userRepo.findOne({ where: { email: params.email } })

        if (user) throw new ConflictException('Əməkdaş artıq mövcuddur!')

        params.password = await hash(params.password, 10)

        user = this.userRepo.create(params)

        await user.save()

        return { message: 'Əməkdaş uğurla yaradıldı!' }
    }



    async update(id: number, params: UpdateUserDto) {
        let user = this.cls.get('user')

        let checkedUser = await this.userRepo.findOne({ where: { id } })

        if (!checkedUser) throw new NotFoundException('Əməkdaş tapılmadı!')

        if (user.role !== 'admin') {
            if (user.id != id) throw new BadRequestException('Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur!')
        }


        const updatedUser = Object.assign(checkedUser, {
            ...params,
            roleId:
                user.role === 'admin'
                    ? params.roleId ?? checkedUser.roleId
                    : checkedUser.roleId,
            username: params.username ?? checkedUser.username,
            avatar: params.avatar ?? checkedUser.avatar,
            email: params.email ?? checkedUser.email,
            phone: params.phone ?? checkedUser.phone,
        });


        await updatedUser.save()
    }

    async deleteUser(id: number) {
        let user = this.cls.get('user')

        let checkUser = await this.userRepo.findOne({ where: { id } })

        if (!checkUser) throw new NotFoundException('Əməkdaş tapılmadı!')

        if (user.role !== 'admin') {
            if (user.id !== id) throw new BadRequestException('Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur!')
        }

        await this.userRepo.delete({ id })
        return { message: user.id == id ? 'Hesabınız uğurla silindi!' : 'Əməkdaş uğurla silindi!' }
    }
}