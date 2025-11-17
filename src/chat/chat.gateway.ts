import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import type { Socket, Server } from 'socket.io'
import { SendMessageDto } from './dto/send-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  userId: string

  constructor(
    private readonly chatService: ChatService,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) { }

  async handleConnection(client: Socket,) {
    const token = client.handshake.headers.authorization?.split(' ')[1]

    console.log(token)

    if (!token) {
      client.disconnect(true)
      console.log('no token')
      return
    }

    const { email } = await this.authService.validateToken(token)

    const user = await this.prismaService.user.findUnique({
      where: {
        email
      }
    });

    console.log(user)

    if (!user) {
      client.disconnect(true)

      return
    }

    this.userId = user.id

    console.log('Client connected: ', client.id)
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id)
  }

  @Authorization()
  @SubscribeMessage('chat')
  async handleMessage(@MessageBody() dto: SendMessageDto) {
    const message = await this.chatService.sendMessage(dto, this.userId)

    this.server.emit('messages', message)

    return message
  }
}
