import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GameGateway');
  private activeClients = new Map<string, string>(); // socketId -> userId (if authenticated)

  afterInit(server: Server) {
    this.logger.log('GameGateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.activeClients.set(client.id, 'anonymous');
    // We could add JWT validation here to authenticate the socket
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.activeClients.delete(client.id);
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: string,
  ): string {
    client.join(gameId);
    this.logger.log(`Client ${client.id} joined game room: ${gameId}`);
    this.server.to(gameId).emit('playerJoined', { clientId: client.id });
    return `Joined ${gameId}`;
  }

  @SubscribeMessage('leaveGame')
  handleLeaveGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: string,
  ): string {
    client.leave(gameId);
    this.logger.log(`Client ${client.id} left game room: ${gameId}`);
    return `Left ${gameId}`;
  }
}

