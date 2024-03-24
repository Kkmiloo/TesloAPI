import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClient {
  [id: string]: { socket: Socket; user: User };
}

@Injectable()
export class MessagesWsService {
  private connectedCliente: ConnectedClient = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerCLient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');

    if (!user.isActive) throw new Error('User not active');

    this.checkUserConnection(user);

    this.connectedCliente[client.id] = {
      socket: client,
      user: user,
    };
  }

  removeClient(clientId: string) {
    delete this.connectedCliente[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedCliente);
  }

  getUserFullName(socketId: string) {
    return this.connectedCliente[socketId].user.fullName;
  }

  checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedCliente)) {
      const connectedClient = this.connectedCliente[clientId];

      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
