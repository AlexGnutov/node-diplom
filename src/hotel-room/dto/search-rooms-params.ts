import { IsEmpty, IsNumber, IsOptional } from 'class-validator';

export class SearchRoomsParams {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsNumber()
  hotelId?: string;

  @IsEmpty()
  isEnabled?: true;
}
