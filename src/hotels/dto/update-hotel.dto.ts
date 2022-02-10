import { IsEmpty, IsString } from 'class-validator';

export class UpdateHotelDto {
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsEmpty()
  updatedAt: Date;
}
