import { ObjectId } from 'mongodb';
import { prop, Ref, Typegoose } from 'typegoose';
import { Message } from 'models/message.model';
import { Room } from 'models/room.model';

export class User extends Typegoose {
  _id: ObjectId | string;

  @prop({ required: true, maxlength: 20, minlength: 5 })
  nickname: string;

  @prop({ required: true })
  clientId: string;

  messages?: Ref<Message[]>;

  joinedRooms?: Ref<Room[]>;
}
