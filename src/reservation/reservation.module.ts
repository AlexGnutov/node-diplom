import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schema/reservation.schema';
import { ReservationController } from './reservation.controller';
import { HotelRoomModule } from '../hotel-room/hotel-room.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    HotelRoomModule,
  ],
  providers: [ReservationService],
  exports: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
