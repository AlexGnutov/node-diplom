import { IsNumber, IsOptional } from 'class-validator';

export class SupportQueryParamsDto {
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
