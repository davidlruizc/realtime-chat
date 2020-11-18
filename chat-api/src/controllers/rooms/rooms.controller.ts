import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Room } from 'models/room.model';
import { ModelType } from 'typegoose';

@Controller('api/rooms')
export class RoomsController {
  constructor(@InjectModel(Room) private readonly roomModel: ModelType<Room>) {}

  @Get()
  find(@Query('q') q: any) {
    if (q) {
      return this.roomModel.find({ name: { $regex: new RegExp(`.*${q}.*`) } });
    } else {
      return this.roomModel.find();
    }
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.roomModel.findById(id);
  }

  @Post()
  save(@Body() item: Room) {
    return item._id
      ? this.roomModel.findByIdAndUpdate(item._id, item, { new: true })
      : this.roomModel.create(item);
  }
}
