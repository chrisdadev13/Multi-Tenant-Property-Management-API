import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './model/roles.model';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PermissionsService } from 'src/permissions/permissions.service';
import {
  Permission,
  PermissionSchema,
} from 'src/permissions/model/permissions.model';

@Module({
  imports: [
    PermissionsModule,
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  providers: [RolesService, PermissionsService],
})
export class RolesModule {}
