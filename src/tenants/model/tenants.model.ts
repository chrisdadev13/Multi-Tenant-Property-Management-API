import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TenantDocument = HydratedDocument<Tenant>;

@Schema({
  timestamps: true,
})
export class Tenant {
  _id: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    index: true,
    required: true,
  })
  contactEmail: string;

  @Prop({
    index: true,
    required: true,
  })
  contactPhone: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'users',
    required: true,
  })
  owner: Types.ObjectId;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
