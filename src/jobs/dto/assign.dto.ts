import { IsDate, IsMongoId, IsString } from 'class-validator';

export class AssignDto {
  @IsMongoId()
  tenantId: string;
  @IsMongoId()
  propertyId: string;
  @IsMongoId()
  userId: string;
  @IsString()
  description: string;
  // @IsEnum({
  //   values: ['pending', 'active', 'completed'],
  // })
  // status: 'pending' | 'active' | 'completed';
  @IsDate()
  dueDate: Date;
}
