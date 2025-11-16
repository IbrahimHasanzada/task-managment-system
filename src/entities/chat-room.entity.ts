import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ChatRoomMemberEntity } from './chat-room-member.entity';
import { MessageEntity } from './message.entity';

export enum ChatRoomType {
    DIRECT = 'direct',
    GROUP = 'group',
}

@Entity('chat_room')
export class ChatRoomEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string; // For group chats

    @Column({ nullable: true })
    description: string; // For group chats

    @Column({ type: 'enum', enum: ChatRoomType, default: ChatRoomType.DIRECT })
    type: ChatRoomType;

    @Column({ nullable: true })
    createdById: number; // For group chats

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'createdById' })
    createdBy: UserEntity;

    @OneToMany(() => ChatRoomMemberEntity, (member) => member.room)
    members: ChatRoomMemberEntity[];

    @OneToMany(() => MessageEntity, (message) => message.room)
    messages: MessageEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

