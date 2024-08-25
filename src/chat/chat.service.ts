import { Injectable } from '@nestjs/common';

interface Client {
  id: string;
  name: string;
}

/*private clients: Record<string, Client> = {} es igual a:
{
'ABC': { id: 'ABC', name: 'Yo'},
'XYZ': { id: 'XYZ', name: 'Tu'},
'FGH': { id: 'FGH', name: 'El'}
}

Interface Client2 {
[key: string]: Client
}
*/

@Injectable()
export class ChatService {
  private clients: Record<string, Client> = {};
  onClientConnected(client: Client) {
    this.clients[client.id] = client;
  }

  onClientDisconnected(id: string) {
    delete this.clients[id];
  }

  getClients() {
    return Object.values(this.clients); // [Client, Client, Client]
  }
}
