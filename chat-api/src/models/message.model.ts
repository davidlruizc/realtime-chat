import { ObjectId } from 'mongodb';
import { prop, Ref, Typegoose } from 'typegoose';
import { User } from 'models/user.model';
import { Room } from 'models/room.model';

export class Message extends Typegoose {
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
