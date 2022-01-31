import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthService } from '../../auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { WsAuthenticatedGuard } from './guards/ws.authentificated.guard';
import { SupportRequest } from '../schemas/support-request.schema';
import { Message } from '../schemas/message.schema';

@WebSocketGateway()
export class SupportSocketGateway {
  constructor(private readonly authService: AuthService) {}
  @WebSocketServer()
  server;

  @UseGuards(WsAuthenticatedGuard)
  @SubscribeMessage('subscribeToChat')
  subscribeHandler(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: any,
  ) {
    console.log('User: ', client.request.user);
    console.log('makes a subscription to chat:');
    console.log(chatId);
    client.join(chatId);

    this.server.to(chatId).emit('server-reply', 'Message received');
  }
  //
  sendNewMessage(supportRequest: SupportRequest, message: Message) {
    const stringToSend = JSON.stringify(message);
    const chatId = supportRequest['_id'].toString();
    if (this.server.sockets.adapter.rooms[chatId]) {
      console.log('Web-socket: sending message to Room: ', chatId);
      this.server.to(chatId).emit('server-reply', stringToSend);
    } else {
      console.log('Web-socket: message NOT sent - no such room');
    }
  }
}
