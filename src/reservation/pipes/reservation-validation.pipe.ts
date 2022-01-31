import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
const ObjectId = Types.ObjectId;

@Injectable()
export class ReservationValidationPipe implements PipeTransform {
  async transform(data: any, metadata: ArgumentMetadata) {
    // Check if data strings are valid
    const dateStart = new Date(data.startDate);
    const dateEnd = new Date(data.endDate);
    if (
      dateStart.toString() === 'Invalid Date' ||
      dateEnd.toString() === 'Invalid Date'
    ) {
      console.log('Dates are bad!');
      throw new BadRequestException();
    }

    if (!ObjectId.isValid(data.hotelRoom)) {
      throw new BadRequestException();
    }

    const room = data.hotelRoom;
    const hotel = data.hotel;

    const output = {
      room,
      dateStart,
      dateEnd,
      hotel,
    };

    return output;
  }
}
