import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './model/properties.model';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { AuthService } from 'src/auth/auth.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from 'src/permissions/permissions.guard';
import { AuthModule } from 'src/auth/auth.module';
import { RolesModule } from 'src/roles/roles.module';
import { UsersModule } from 'src/users/users.module';
import {
  Permission,
  PermissionSchema,
} from 'src/permissions/model/permissions.model';
import { User, UserSchema } from 'src/users/model/users.model';
import { Role, RoleSchema } from 'src/roles/model/roles.model';

@Module({
  imports: [
    PermissionsModule,
    AuthModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      {
        name: Property.name,
        schema: PropertySchema,
      },
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
  ],
  controllers: [PropertiesController],
  providers: [
    AuthService,
    PropertiesService,
    PermissionsService,
    RolesService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class PropertiesModule {}
