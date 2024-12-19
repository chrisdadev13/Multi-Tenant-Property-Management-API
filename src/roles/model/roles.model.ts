import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Tenant } from 'src/tenants/model/tenants.model';

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'tenants' })
  tenant: Types.ObjectId | Tenant;

  @Prop({ type: [Types.ObjectId], ref: 'permissions' })
  permissions: Types.ObjectId[];

  @Prop()
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
