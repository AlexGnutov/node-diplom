import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomSchema } from './schema/hotel-room.schema';
import { HotelRoomService } from './hotel-room.service';
import { HotelRoomController } from './hotel-room.controller';
import { HotelsModule } from '../hotels/hotels.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
    HotelsModule,
  ],
  providers: [HotelRoomService],
  exports: [HotelRoomService],
  controllers: [HotelRoomController],
})
export class HotelRoomModule {}
