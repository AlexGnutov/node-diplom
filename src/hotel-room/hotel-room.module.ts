import { Module } from '@nestjs/common';
import { HotelRoomService } from './hotel-room.service';
import { HotelRoomController } from './hotel-room.controller';
import { HotelsModule } from '../hotels/hotels.module';
import { DatabaseModule } from '../database/database.module';
import { HotelRoomProviders } from './hotel-room.providers';

@Module({
  imports: [DatabaseModule, HotelsModule],
  providers: [HotelRoomService, ...HotelRoomProviders],
  exports: [HotelRoomService],
  controllers: [HotelRoomController],
})
export class HotelRoomModule {}
