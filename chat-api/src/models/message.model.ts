import { ObjectId } from 'mongodb';
import { prop, Ref } from '@typegoose/typegoose';
import { User } from 'models/user.model';
import { Room } from 'models/room.model';

export class Message {
  _id: ObjectId | string;

  @prop({ required: true })
  text: string;

  @prop({ required: true })
  created: Date;

  @prop({ required: true, ref: User })
  owner: Ref<User>;

  @prop({ required: true, ref: Room })
  room: Ref<Room> | string;
}
