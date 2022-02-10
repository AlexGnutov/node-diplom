import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { HotelRoomModule } from '../hotel-room/hotel-room.module';
import { ReservationProviders } from './reservation.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, HotelRoomModule],
  providers: [ReservationService, ...ReservationProviders],
  exports: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
