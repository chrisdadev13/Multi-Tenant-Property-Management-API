import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Tenant } from 'src/tenants/model/tenants.model';
import { User } from 'src/users/model/users.model';

export type PropertyDocument = HydratedDocument<Property>;

class Address {
  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zip: string;
}

@Schema({ timestamps: true })
export class Property {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Address, required: true })
  address: Address;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'tenants',
  })
  tenant: Types.ObjectId | Tenant;

  @Prop({
    type: Types.ObjectId,
    ref: 'users',
  })
  owner: Types.ObjectId | User;

  @Prop({
    type: [Types.ObjectId],
    ref: 'users',
  })
  assignedUsers?: Types.ObjectId[] | User[];
}

export const PropertySchema = SchemaFactory.createForClass(Property);
