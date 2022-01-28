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

@WebSocketGateway()
export class SupportSocketGateway {
  constructor(private readonly authService: AuthService) {}
  @WebSocketServer()
  server;

  @UseGuards(WsAuthenticatedGuard)
  @SubscribeMessage('subscribeToChat')
  subscribeHandler(
    @MessageBody() data: string,
    @ConnectedSocket() client: any,
  ) {
    console.log('From message handler');
    console.log(data);
    console.log(client.request.user);

    this.server.emit('server-reply', 'Message received');

    // return { name: 'received', message: 'received' };
  }
}
