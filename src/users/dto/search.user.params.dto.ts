import { IsOptional } from 'class-validator';
import { Role } from '../../roles/role.enum';

export class SearchUserParamsDto {
  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;

  @IsOptional()
  email?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  contactPhone?: string;

  @IsOptional()
  role?: Role | undefined;
}
