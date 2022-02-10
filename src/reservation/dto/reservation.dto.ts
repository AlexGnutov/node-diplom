import { ID } from '../../common/ID';
import { IsDate, IsEmpty, IsMongoId } from 'class-validator';

export class ReservationDto {
  @IsEmpty()
  userId: ID;

  @IsEmpty()
  hotelId: ID;

  @IsMongoId()
  roomId: ID;

  @IsDate()
  dateStart: Date;

  @IsDate()
  dateEnd: Date;
}
