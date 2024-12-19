import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission {
  _id?: string;

  @Prop({ required: true })
  resource: string;

  @Prop({ required: true })
  action: string;

  @Prop()
  description: string;

  @Prop({ unique: true })
  uniqueKey: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.pre('save', function (next) {
  this.uniqueKey = `${this.resource}:${this.action}`;
  next();
});
