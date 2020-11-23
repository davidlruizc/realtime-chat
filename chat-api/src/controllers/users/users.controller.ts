import { Controller, Get, Param } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from 'models/user.model';
import { ModelType } from 'typegoose';

@Controller('api/users')
export class UsersController {
  constructor(@InjectModel(User) private readonly userModel: ModelType<User>) {}

  @Get('/:nickname')
  findByNickname(@Param('nickname') nickname: string) {
    return this.userModel.findOne({ nickname });
  }
}
