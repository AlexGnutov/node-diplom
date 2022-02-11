import { IsOptional } from 'class-validator';

export class SupportQueryParamsDto {
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  offset?: number;

  @IsOptional()
  limit?: number;
}
