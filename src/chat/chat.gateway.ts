import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      // console.log( socket );

      const { name, token } = socket.handshake.auth;
      console.log({ name, token });

      if ( !name ) {
        socket.disconnect();
        return;
      }

      socket.on('disconnect', () => {
        // console.log('Cliente desconectado:', socket.id);
      });
    });
  }
}
