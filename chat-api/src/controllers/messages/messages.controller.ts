import { Controller, Get, Query } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { Message } from 'models/message.model';

@Controller('api/messages')
export class MessagesController {
  constructor(
    @InjectModel(Message) private readonly messageModel: ModelType<Message>,
  ) {}

  @Get()
  find(@Query('where') where: any) {
    where = JSON.parse(where || '{}');
    return this.messageModel.find(where).populate('owner').exec();
  }
}
