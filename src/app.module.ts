import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PropertiesModule } from './properties/properties.module';
import { TenanciesModule } from './tenancies/tenancies.module';
import { JobsModule } from './jobs/jobs.module';
import { CliModule } from './cli/cli.module';
import { CommandModule } from 'nestjs-command';
import { SeedCommand } from './commands/seed/seed.command';

@Module({
  imports: [
    CommandModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    RolesModule,
    PermissionsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    PropertiesModule,
    TenanciesModule,
    JobsModule,
    CliModule,
  ],
  providers: [SeedCommand],
})
export class AppModule {}
