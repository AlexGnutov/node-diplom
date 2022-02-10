import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Reservation } from './schema/reservation.interface';
import { ID } from '../common/ID';
import { ReservationSearchOptions } from './dto/reservation-search-options';
import { ReservationDto } from './dto/reservation.dto';
import { DateToComStrUtil } from '../common/utils/date-to-compare-string.util';
import { ReservationModelName } from '../common/constants';

interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(id: ID): Promise<void>;
  getReservations(
    searchParams: Partial<ReservationSearchOptions>,
  ): Promise<Array<Reservation>>;
  findById(id: ID): Promise<Reservation>;
}

@Injectable()
export class ReservationService implements IReservation {
  constructor(
    @Inject(ReservationModelName)
    private reservationModel: Model<Reservation>,
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
    // Check if new reservation is possible
    reservedDates.forEach((datePair) => {
      if (
        DateToComStrUtil(data.dateStart) >= DateToComStrUtil(datePair[1]) ||
        DateToComStrUtil(data.dateEnd) <= DateToComStrUtil(datePair[0])
      ) {
        return;
      } else {
        throw new BadRequestException(
          "Error: can't make reservation, dates are not free",
        );
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
      return await reservation.populate([
        { path: 'hotelId' },
        { path: 'roomId' },
      ]);
    } catch (e) {
      throw new BadRequestException(e, "DB-error: can't create reservation");
    }
  }

  public async removeReservation(id: ID): Promise<void> {
    try {
      await this.reservationModel.findByIdAndDelete(id).exec();
    } catch (e) {
      throw new BadRequestException(e, "DB-error: can't delete reservation");
    }
    return;
  }

  public async getReservations(
    searchParams: Partial<ReservationSearchOptions>,
  ): Promise<Array<Reservation>> {
    // Finding by ID in separate function - see below
    let filter = {};
    if (searchParams.user) {
      filter['user'] = searchParams.user;
    }
    if (Object.keys(filter).length === 0) {
      filter = null;
    }
    let reservations;
    try {
      reservations = await this.reservationModel
        .find(filter)
        .populate([{ path: 'hotelId' }, { path: 'roomId' }])
        .exec();
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        'DB-error: reservations: getReservations',
      );
    }
    return reservations;
  }

  async findById(id: ID): Promise<Reservation> {
    try {
      return await this.reservationModel
        .findById(id)
        .populate([{ path: 'hotelId' }, { path: 'roomId' }])
        .exec();
    } catch (e) {
      throw new BadRequestException(e, "DB-error: findById - can't find");
    }
  }
}
