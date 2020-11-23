import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Message } from 'models/message.model';
import { Room } from 'models/room.model';
import { User } from 'models/user.model';
import { RoomsController } from './controllers/rooms/rooms.controller';
import { MessagesController } from './controllers/messages/messages.controller';
import { MessagesGateway } from 'gateways/messages/messages.gateway';
import { UsersController } from './controllers/users/users.controller';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://root:root@localhost/realtime-chat', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    TypegooseModule.forFeature([Message, Room, User]),
  ],
  controllers: [
    AppController,
    RoomsController,
    MessagesController,
    UsersController,
  ],
  providers: [AppService, MessagesGateway],
})
export class AppModule {}
