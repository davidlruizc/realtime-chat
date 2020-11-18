import { prop, Ref, Typegoose } from 'typegoose';
import { ObjectId } from 'mongodb';
import { Message } from 'models/message.model';
import { User } from 'models/user.model';

export class Room extends Typegoose {
  _id: ObjectId | string;

  @prop({ required: true, maxlength: 20, minlength: 5 })
  name: string;

  messages: Ref<Message[]>;

  connectedUsers: Ref<User[]>;
}
