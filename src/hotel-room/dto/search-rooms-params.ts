import { IsMongoId, IsOptional } from 'class-validator';

export class SearchRoomsParams {
  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;

  @IsOptional()
  @IsMongoId()
  hotelId?: string;

  @IsOptional()
  isEnabled?: boolean;
}
