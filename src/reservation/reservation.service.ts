import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './schema/reservation.schema';
import { ID } from '../common/ID';
import { ReservationSearchOptions } from './dto/reservation-search-options';
import { ReservationDto } from './dto/reservation.dto';
import { DateToComStrUtil } from '../common/utils/date-to-compare-string.util';

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

  public async addReservation(data: ReservationDto): Promise<Reservation> {
    // Check if the room is not reserved for the dates
    const existReservations = await this.getReservations({
      user: data.user,
    });
    // Take dates of existing reservations
    const reservedDates = [];
    existReservations.forEach((reservation) => {
      reservedDates.push([reservation.dateStart, reservation.dateEnd]);
    });
    console.log(reservedDates);
    // Check if new reservation is possible
    reservedDates.forEach((datePair) => {
      if (
        DateToComStrUtil(data.dateStart) >= DateToComStrUtil(datePair[1]) ||
        DateToComStrUtil(data.dateEnd) <= DateToComStrUtil(datePair[0])
      ) {
        return;
      } else {
        throw new BadRequestException();
      }
    });
    // Create reservation after dates check
    const reservationData = {
      userId: data.user,
      hotelId: data.hotel,
      roomId: data.room,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
    };
    try {
      const reservation = await this.reservationModel.create(reservationData);
      console.log(reservation);
      return await reservation.populate([
        { path: 'hotelId' },
        { path: 'roomId' },
      ]);
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException();
    }
  }

  public async removeReservation(id: ID): Promise<void> {
    try {
      const deleted = await this.reservationModel.findByIdAndDelete(id).exec();
      if (deleted) {
        console.log('Deleted: ');
        console.log(deleted);
        return;
      }
      console.log('Nothing to delete');
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException();
    }
    return;
  }

  public async getReservations(
    searchParams: Partial<ReservationSearchOptions>,
  ): Promise<Array<Reservation>> {
    // If id is given - find by id
    if (searchParams.id) {
      try {
        return await this.reservationModel
          .find({ _id: searchParams.id })
          .populate([{ path: 'hotelId' }, { path: 'roomId' }])
          .exec();
      } catch (e) {
        console.log(e.message);
        throw new BadRequestException();
      }
    }
    // If no id is given - find by other options
    let filter = {};
    if (searchParams.user) {
      filter['user'] = searchParams.user;
    }
    if (Object.keys(filter).length === 0) {
      filter = null;
    }
    return await this.reservationModel
      .find(filter)
      .populate([{ path: 'hotelId' }, { path: 'roomId' }])
      .exec();
  }
}
