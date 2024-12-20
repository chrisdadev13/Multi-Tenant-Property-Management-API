import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './model/jobs.model';
import {
  Property,
  PropertySchema,
} from 'src/properties/model/properties.model';
import { User, UserSchema } from 'src/users/model/users.model';
import { JobsController } from './jobs.controller';
import { JobHistoryModule } from 'src/job-history/job-history.module';
import { AuthService } from 'src/auth/auth.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/permissions/permissions.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { RolesModule } from 'src/roles/roles.module';
import { Role, RoleSchema } from 'src/roles/model/roles.model';
import {
  Permission,
  PermissionSchema,
} from 'src/permissions/model/permissions.model';
import { JobHistoryService } from 'src/job-history/job-history.service';
import {
  JobHistory,
  JobHistorySchema,
} from 'src/job-history/model/job-history.model';

@Module({
  imports: [
    JobHistoryModule,
    AuthModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: Property.name, schema: PropertySchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: User.name, schema: UserSchema },
      { name: JobHistory.name, schema: JobHistorySchema },
    ]),
  ],
  providers: [
    AuthService,
    JobsService,
    JobHistoryService,
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
  controllers: [JobsController],
})
export class JobsModule {}
