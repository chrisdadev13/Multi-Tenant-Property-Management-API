import { Type } from 'class-transformer';
import {
  IsString,
  ValidateNested,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { AddressDto } from './address.dto';

export class UpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @IsMongoId()
  @IsOptional()
  owner?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  assignedUsers?: string[];
}
