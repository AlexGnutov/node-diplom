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
import { SupportRequest } from '../schemas/support-request.interface';
import { Message } from '../schemas/message.interface';

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
    client.join(chatId);
    // Check, if room exist and send suitable reply
    if (this.server.sockets.adapter.rooms.get(chatId)) {
      this.server.to(chatId).emit('server-reply', `Subscribed to: ${chatId}`);
    } else {
      client.emit('server-reply', "Can't subscribe chat room");
    }
  }
  //
  sendNewMessage(supportRequest: SupportRequest, message: Message): void {
    const stringToSend = JSON.stringify(message);
    const chatId = supportRequest['_id'].toString();
    // Check if room exist and send a message
    if (this.server.sockets.adapter.rooms.get(chatId)) {
      this.server.to(chatId).emit('server-reply', stringToSend);
    }
  }
}
