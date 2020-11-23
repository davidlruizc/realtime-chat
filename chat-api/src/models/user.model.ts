import { ObjectId } from 'mongodb';
import { prop, Ref } from '@typegoose/typegoose';
import { Message } from 'models/message.model';
import { Room } from 'models/room.model';

export class User {
  _id: ObjectId | string;

  @prop({ required: true, maxlength: 20, minlength: 1 })
  nickname: string;

  @prop({ required: true })
  clientId: string;

  messages?: Ref<Message[]>;

  joinedRooms?: Ref<Room[]>;
}
