import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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
      // console.log({ name, token });

      if (!name) {
        socket.disconnect();
        return;
      }

      // Agregar cliente al listado
      this.chatService.onClientConnected({ id: socket.id, name: name }); //es mejor tomar el token que el id porque el id cambia si se refresca el navegador

      // Mensaje de bienvenida
      // socket.emit('welcome-message', 'Bienvenido al servidor'); //parecido a console log

      // Listado de clientes conectados
      this.server.emit('on-clients-changed', this.chatService.getClients());

      socket.on('disconnect', () => {
        this.chatService.onClientDisconnected(socket.id);
        this.server.emit('on-clients-changed', this.chatService.getClients());
        // console.log('Cliente desconectado:', socket.id);
      });
    });
  }


  @SubscribeMessage('send-message')
handleMessage(
  @MessageBody() message: string,
  @ConnectedSocket() client: Socket,
) {

const {name , token} = client.handshake.auth;
const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).replace(/^24:/, '00:');
console.log({name, message , currentTime });

if ( !message) {
  return;
}

this.server.emit(
  'on-message', 
  {
  userId: client.id,
  message: message, //se puede poner message (solo)
  name: name, //se puede poner name (solo)
  time: currentTime
}
)
}

}
