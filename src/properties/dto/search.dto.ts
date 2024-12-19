import { IsString, IsMongoId } from 'class-validator';

export class SearchDto {
  @IsMongoId()
  tenantId: string;

  @IsString()
  searchParam: string;
}
