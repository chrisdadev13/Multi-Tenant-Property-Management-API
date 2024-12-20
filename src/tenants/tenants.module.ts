import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './model/tenants.model';
import { TenantsController } from './tenants.controller';
import { User, UserSchema } from 'src/users/model/users.model';
import { RolesModule } from 'src/roles/roles.module';
import { RolesService } from 'src/roles/roles.service';
import { Role, RoleSchema } from 'src/roles/model/roles.model';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PermissionsService } from 'src/permissions/permissions.service';
import {
  Permission,
  PermissionSchema,
} from 'src/permissions/model/permissions.model';
import { PermissionGuard } from 'src/permissions/permissions.guard';
import { Job, JobSchema } from 'src/jobs/model/jobs.model';
import {
  Property,
  PropertySchema,
} from 'src/properties/model/properties.model';
import { Tenancy, TenancySchema } from 'src/tenancies/model/tenancies.model';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Job.name, schema: JobSchema },
      { name: Property.name, schema: PropertySchema },
      { name: Tenancy.name, schema: TenancySchema },
    ]),
  ],
  providers: [
    AuthService,
    TenantsService,
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
  controllers: [TenantsController],
})
export class TenantsModule {}
