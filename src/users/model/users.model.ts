import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/roles/model/roles.model';
import { Tenant } from 'src/tenants/model/tenants.model';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  _id: string;

  @Prop()
  name: string;

  @Prop({
    index: true,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'tenants',
  })
  tenant?: Types.ObjectId | Tenant;

  @Prop({
    type: Types.ObjectId,
    ref: 'roles',
  })
  role?: Types.ObjectId | Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
