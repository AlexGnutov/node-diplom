import { ID } from '../../common/ID';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateSupportRequestDto {
  @IsOptional()
  @IsMongoId()
  user?: ID;

  @IsString()
  text: string;
}
