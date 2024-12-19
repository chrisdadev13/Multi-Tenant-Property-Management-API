import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from './model/users.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from 'src/tenants/model/tenants.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tenant.name, schema: TenantSchema },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
