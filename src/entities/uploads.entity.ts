import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, ValueTransformer } from "typeorm";
import { UserEntity } from "./user.entity";

const pathTransformer: ValueTransformer = {
    to: (value: string) => value, 
    from: (value: string) => value?.replace(/\\/g, '/') 
};

@Entity('uploads')
export class UploadsEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ transformer: pathTransformer }) 
    url: string;

    @OneToOne(() => UserEntity, (user) => user.avatar)
    user: UserEntity

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

} 