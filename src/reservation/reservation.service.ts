import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './schema/reservation.schema';
import { ID } from '../common/ID';
import { ReservationSearchOptions } from './dto/reservation-search-options';
import { ReservationDto } from './dto/reservation.dto';
import { serialize } from 'v8';

interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(id: ID): Promise<void>;
  getReservations(
    searchParams: Partial<ReservationSearchOptions>,
  ): Promise<Array<Reservation>>;
}

@Injectable()
export class ReservationService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  // Метод IReservation.addReservation должен проверять доступен ли номер на заданную дату
  public async addReservation(data: ReservationDto): Promise<Reservation> {
    const reservationData = {
      userId: data.user,
      hotelId: data.hotel,
      roomId: data.room,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
    };

    // ПРОВЕРИТЬ - доступен ли номер в эти даты!

    const reservation = await this.reservationModel.create(reservationData);
    console.log(reservation);
    return await reservation.populate([
      { path: 'hotelId' },
      { path: 'roomId' },
    ]);
  }

  public async removeReservation(id: ID): Promise<void> {
    // ПРОВЕРИТЬ, что номер брони и номер пользователя соответствуют друг другу
    const deleted = await this.reservationModel.findByIdAndDelete(id).exec();
    if (deleted) {
      console.log('Deleted: ');
      console.log(deleted);
      return;
    }
    console.log('Nothing to delete');
  }

  public async getReservations(
    searchParams: Partial<ReservationSearchOptions>,
  ): Promise<Array<Reservation>> {
    const filter = {
      userId: searchParams.user,
      // Dates options?
    };

    return await this.reservationModel
      .find(filter)
      .populate([{ path: 'hotelId' }, { path: 'roomId' }])
      .exec();
  }
}
