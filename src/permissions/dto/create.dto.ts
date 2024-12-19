import { IsString } from 'class-validator';

type Action = 'create' | 'read' | 'update' | 'delete' | 'assign';

export class CreateDto {
  @IsString()
  resource: string;

  @IsString()
  action: Action;

  @IsString()
  description: string;

  @IsString()
  uniqueKey: `${string}:${Action}`;
}
