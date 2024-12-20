import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './model/jobs.model';
import {
  Property,
  PropertySchema,
} from 'src/properties/model/properties.model';
import { User, UserSchema } from 'src/users/model/users.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: Property.name, schema: PropertySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [JobsService],
})
export class JobsModule {}
