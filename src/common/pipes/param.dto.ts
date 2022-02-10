import { ID } from '../ID';
import { IsMongoId, IsOptional } from 'class-validator';

export class ParamDto {
  @IsOptional()
  @IsMongoId()
  userId?: ID;

  @IsOptional()
  @IsMongoId()
  reservationId?: ID;

  @IsOptional()
  @IsMongoId()
  id?: ID;

  @IsOptional()
  @IsMongoId()
  hotelId?: ID;

  @IsOptional()
  @IsMongoId()
  supportRequestId?: ID;
}
