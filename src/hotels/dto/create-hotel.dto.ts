import { IsDefined, IsString } from 'class-validator';

export class CreateHotelDto {
  @IsDefined()
  @IsString()
  title: string;

  @IsString()
  description?: string;
}
