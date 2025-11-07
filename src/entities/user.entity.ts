import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "./role.entity";

@Entity('user')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    avatar: string

    @Column()
    phone: string

    @Column()
    email: string

    @Column()
    roleId: number

    @Column()
    password: string

    @OneToOne(() => RoleEntity, (role) => role.user)
    @JoinColumn({ name: 'roleId' })
    role: RoleEntity


    @CreateDateColumn()
    createdAt: Date
}