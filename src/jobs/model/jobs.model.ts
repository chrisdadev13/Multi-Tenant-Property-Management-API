import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Property } from 'src/properties/model/properties.model';
import { Tenant } from 'src/tenants/model/tenants.model';
import { User } from 'src/users/model/users.model';

export type JobDocument = HydratedDocument<Job>;

enum JobStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  completed = 'completed',
}

@Schema({
  timestamps: true,
})
export class Job {
  _id: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'tenants',
  })
  tenant: Types.ObjectId | Tenant;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'properties',
  })
  property: Types.ObjectId | Property;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  assignedUser: Types.ObjectId | User;

  @Prop()
  description: string;

  @Prop({
    type: Date,
  })
  dueDate: Date;

  @Prop({
    type: String,
    enum: Object.values(JobStatus),
  })
  status: JobStatus;
}

export const JobSchema = SchemaFactory.createForClass(Job);
