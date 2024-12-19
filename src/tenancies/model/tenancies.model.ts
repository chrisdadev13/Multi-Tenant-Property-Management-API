import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Property } from 'src/properties/model/properties.model';
import { Tenant } from 'src/tenants/model/tenants.model';
import { User } from 'src/users/model/users.model';

export type TenancyDocument = HydratedDocument<Tenancy>;

enum TenancyStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({
  timestamps: true,
})
export class Tenancy {
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
  user: Types.ObjectId | User;

  @Prop({
    type: Date,
  })
  startDate: Date;

  @Prop({
    type: Date,
  })
  endDate: Date;

  @Prop({
    type: String,
    enum: Object.values(TenancyStatus),
  })
  status: TenancyStatus;
}

export const TenancySchema = SchemaFactory.createForClass(Tenancy);
