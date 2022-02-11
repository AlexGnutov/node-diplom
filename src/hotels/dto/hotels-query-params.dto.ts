import { IsOptional } from 'class-validator';

export class HotelsQueryParamsDto {
  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;

  @IsOptional()
  title?: string;
}
