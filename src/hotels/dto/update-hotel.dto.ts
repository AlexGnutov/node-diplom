import { IsEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateHotelDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEmpty()
  updatedAt: Date;
}
