import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import type { Socket, Server } from 'socket.io'
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  constructor(private readonly chatService: ChatService) { }

  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id)
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id)
  }

  @SubscribeMessage('chat')
  async handleMessage(@MessageBody() dto: SendMessageDto) {
    const message = await this.chatService.sendMessage(dto)

    this.server.emit('messages', message)

    return message
  }
}
