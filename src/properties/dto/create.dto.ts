import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { AddressDto } from './address.dto';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsMongoId()
  @IsNotEmpty()
  tenant: string;

  @IsMongoId()
  @IsOptional()
  owner?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  assignedUsers?: string[];
}
