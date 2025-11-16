import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../../guard/ws-auth.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/chat',
})
@UseGuards(WsAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private userSockets = new Map<number, Set<string>>(); // userId -> Set of socketIds

    constructor(private chatService: ChatService) {}

    async handleConnection(client: Socket) {
        const user = client.data.user;
        if (!user) {
            client.disconnect();
            return;
        }

        // Track user's socket connections
        if (!this.userSockets.has(user.id)) {
            this.userSockets.set(user.id, new Set());
        }
        const userSockets = this.userSockets.get(user.id);
        if (userSockets) {
            userSockets.add(client.id);
        }

        // Join user to their rooms
        const rooms = await this.chatService.getUserRooms(user.id);
        rooms.forEach((room) => {
            client.join(`room:${room.id}`);
        });

        // Notify others that user is online
        this.server.emit('user:online', { userId: user.id });
    }

    async handleDisconnect(client: Socket) {
        const user = client.data.user;
        if (!user) return;

        // Remove socket from user's connections
        const sockets = this.userSockets.get(user.id);
        if (sockets) {
            sockets.delete(client.id);
            if (sockets.size === 0) {
                this.userSockets.delete(user.id);
                // Notify others that user is offline
                this.server.emit('user:offline', { userId: user.id });
            }
        }
    }

    @SubscribeMessage('message:send')
    async handleMessage(
        @MessageBody() data: SendMessageDto,
        @ConnectedSocket() client: Socket,
    ) {
        const user = client.data.user;

        try {
            const message = await this.chatService.sendMessage(
                data.roomId,
                user.id,
                data.content,
            );

            // Emit to all users in the room
            this.server.to(`room:${data.roomId}`).emit('message:new', message);

            return { success: true, message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    @SubscribeMessage('room:join')
    async handleJoinRoom(
        @MessageBody() data: { roomId: number },
        @ConnectedSocket() client: Socket,
    ) {
        const user = client.data.user;

        try {
            await this.chatService.getRoomById(data.roomId, user.id);
            client.join(`room:${data.roomId}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    @SubscribeMessage('room:leave')
    async handleLeaveRoom(
        @MessageBody() data: { roomId: number },
        @ConnectedSocket() client: Socket,
    ) {
        client.leave(`room:${data.roomId}`);
        return { success: true };
    }

    @SubscribeMessage('message:read')
    async handleMarkAsRead(
        @MessageBody() data: { roomId: number },
        @ConnectedSocket() client: Socket,
    ) {
        const user = client.data.user;

        try {
            await this.chatService.markAsRead(data.roomId, user.id);
            this.server.to(`room:${data.roomId}`).emit('message:read', {
                roomId: data.roomId,
                userId: user.id,
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Helper method to emit to specific user
    emitToUser(userId: number, event: string, data: any) {
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            sockets.forEach((socketId) => {
                this.server.to(socketId).emit(event, data);
            });
        }
    }
}

