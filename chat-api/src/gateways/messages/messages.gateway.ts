import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectModel } from 'nestjs-typegoose';
import { User } from 'models/user.model';
import { ModelType } from 'typegoose';
import { Message } from 'models/message.model';
import { Room } from 'models/room.model';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

interface IDataChatRoom {
  nickname: string;
  roomId: string;
}

@WebSocketGateway(3001, {
  path: '/websockets',
  serveClient: true,
  namespace: '/',
})
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('MessagesGateway');

  //@WebSocketServer() wss: Server;

  constructor(
    @InjectModel(User) private readonly usersModel: ModelType<User>,
    @InjectModel(Message) private readonly messagesModel: ModelType<Message>,
    @InjectModel(Room) private readonly roomModel: ModelType<Room>,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected:       ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected:     ${client.id}`);
    const user = await this.usersModel.findOne({ clientId: client.id });

    if (user) {
      client.server.emit('users-changed', {
        user: user.nickname,
        event: 'left',
      });
      user.clientId = null;
      await this.usersModel.findByIdAndUpdate(user._id, user);
    }
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void {
    this.logger.log(text);
    //this.wss.emit('msgToClient', text);
    // return { event: 'msgToClient', data: text };
  }

  @SubscribeMessage('enter-chat-room')
  async enterChatRoom(client: Socket, data: IDataChatRoom): Promise<void> {
    let user = await this.usersModel.findOne({ nickname: data.nickname });

    if (!user) {
      user = await this.usersModel.create({
        nickname: data.nickname,
        clientId: client.id,
      });
    } else {
      user.clientId = client.id;
      user = await this.usersModel.findOneAndUpdate(user._id, { new: true });
    }
    client
      .join(data.roomId)
      .broadcast.to(data.roomId)
      .emit('users-changed', { user: user.nickname, event: 'joined' });
  }

  @SubscribeMessage('leave-chat-room')
  async leaveChatRoom(client: Socket, data: IDataChatRoom): Promise<void> {
    const user = await this.usersModel.findOne({ nickname: data.nickname });

    client.broadcast
      .to(data.roomId)
      .emit('users-changed', { user: user.nickname, event: 'left' });
    client.leave(data.roomId);
  }

  @SubscribeMessage('add-message')
  async addMessage(client: Socket, message: Message): Promise<void> {
    message.owner = await this.usersModel.findOne({ clientId: client.id });
    message.created = new Date();
    message = await this.messagesModel.create(message);
    client.server.in(message.room as string).emit('message', message);
  }
}
