import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "./role.entity";
import { UploadsEntity } from "./uploads.entity";

@Entity('user')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    avatarId: number

    @Column()
    phone: string

    @Column()
    email: string

    @Column()
    roleId: number

    @Column()
    password: string

    @ManyToOne(() => RoleEntity, (role) => role.user)
    role: RoleEntity

    @OneToOne(() => UploadsEntity, (image) => image.user)
    @JoinColumn({ name: 'avatarId' })
    avatar: string


    @CreateDateColumn()
    createdAt: Date
}