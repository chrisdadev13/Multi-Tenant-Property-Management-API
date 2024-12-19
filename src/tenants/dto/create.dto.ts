import { IsString, IsEmail, IsMongoId, IsPhoneNumber } from 'class-validator';

export class CreateDto {
  @IsString()
  name: string;

  @IsPhoneNumber()
  contactPhone: string;

  @IsEmail()
  contactEmail: string;

  @IsMongoId()
  createdById: string;
}
