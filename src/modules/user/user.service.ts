import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto, CreateUserDto } from './dto/create.dto';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update.dto';
import { ClsService } from 'nestjs-cls';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { UploadsEntity } from '../../entities/uploads.entity';
import { RoleEnum } from '../../shared/enums/role.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        @InjectRepository(UploadsEntity)
        private uploadRepo: Repository<UploadsEntity>,
        private cls: ClsService
    ) { }


    async getUserById(id: number) {
        return await this.userRepo.findOne({
            where: { id },
            relations: ['avatar'],
            select: {
                id: true,
                username: true,
                avatar: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            }
        })
    }

    async list(role?: RoleEnum, search?: string) {
        const queryBuilder = this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.avatar', 'avatar');

        if (role) {
            queryBuilder.where('user.role = :role', { role });
        }

        if (search) {
            if (role) {
                queryBuilder.andWhere('(user.username ILIKE :search OR user.email ILIKE :search)', {
                    search: `%${search}%`,
                });
            } else {
                queryBuilder.where('(user.username ILIKE :search OR user.email ILIKE :search)', {
                    search: `%${search}%`,
                });
            }
        }

        return await queryBuilder.getMany();
    }

    async findByEmail(email: string) {
        return this.userRepo.findOne({ where: { email } });
    }


    async create(params: CreateUserDto) {
        let user = await this.userRepo.findOne({ where: { email: params.email } })

        if (user) throw new ConflictException('Əməkdaş artıq mövcuddur!')

        if (params.avatarId) {
            let avatar = await this.uploadRepo.findOne({ where: { id: params.avatarId } })

            if (!avatar) throw new NotFoundException('Şəkil tapılmadı!')
        }

        params.password = await hash(params.password, 10)

        user = this.userRepo.create({
            avatarId: params.avatarId ?? null,
            email: params.email,
            username: params.username,
            password: params.password,
            phone: params.phone,
            role: params.role ?? RoleEnum.USER,
        })

        await user.save()

        return { message: 'Əməkdaş uğurla yaradıldı!' }
    }

    async createAdmin(params: CreateAdminDto) {
        let user = await this.userRepo.findOne({ where: { email: params.email } })

        if (user) throw new ConflictException('Əməkdaş artıq mövcuddur!')

        if (params.avatarId) {
            let avatar = await this.uploadRepo.findOne({ where: { id: params.avatarId } })

            if (!avatar) throw new NotFoundException('Şəkil tapılmadı!')
        }

        params.password = await hash(params.password, 10)

        user = this.userRepo.create({
            ...params,
            avatarId: params.avatarId ?? null,
        })

        await user.save()

        return { message: 'Əməkdaş uğurla yaradıldı!' }
    }



    async update(id: number, params: UpdateUserDto) {

        let checkedUser = await this.userRepo.findOne({ where: { id } })

        if (!checkedUser) throw new NotFoundException('Əməkdaş tapılmadı!')


        if (params.avatarId) {

            let avatar = await this.uploadRepo.findOne({ where: { id: params.avatarId } })

            if (!avatar) throw new NotFoundException('Şəkil tapılmadı!')
        }



        const updatedUser = Object.assign(checkedUser, {
            ...params,
            username: params.username ?? checkedUser.username,
            avatarId: params.avatarId ?? checkedUser.avatarId,
            email: params.email ?? checkedUser.email,
            phone: params.phone ?? checkedUser.phone,
        });


        await updatedUser.save()
        return { message: 'Əməkdaş uğurla yeniləndi!' }
    }

    async updateMe(params: UpdateUserDto) {

        let user = this.cls.get('user')

        if (params.avatarId) {

            let avatar = await this.uploadRepo.findOne({ where: { id: params.avatarId } })

            if (!avatar) throw new NotFoundException('Şəkil tapılmadı!')
        }

        const updatedUser = Object.assign(user, {
            ...params,
            username: params.username ?? user.username,
            avatarId: params.avatarId ?? user.avatarId,
            email: params.email ?? user.email,
            phone: params.phone ?? user.phone,
        });


        await updatedUser.save()
        return { message: 'Hesabınız uğurla yeniləndi!' }
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