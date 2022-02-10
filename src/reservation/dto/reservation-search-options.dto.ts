import { ID } from '../../common/ID';
import { IsDate, IsMongoId, IsOptional } from 'class-validator';

export class ReservationSearchOptionsDto {
  @IsMongoId()
  @IsOptional()
  userId?: ID;

  @IsOptional()
  @IsDate()
  dateStart?: Date;

  @IsOptional()
  @IsMongoId()
  roomId?: ID;

  @IsOptional()
  @IsDate()
  dateEnd?: Date;

  @IsOptional()
  @IsMongoId()
  id?: ID;
}
