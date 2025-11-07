import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('role')
export class RoleEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    role: string

    @OneToOne(() => UserEntity, (user) => user.role)
    user: UserEntity
}