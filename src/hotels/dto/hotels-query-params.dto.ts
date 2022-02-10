import { IsNumber, IsOptional } from 'class-validator';

export class HotelsQueryParamsDto {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsNumber()
  title?: string;
}
