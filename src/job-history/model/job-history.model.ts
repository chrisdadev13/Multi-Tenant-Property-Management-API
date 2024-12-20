import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobHistoryDocument = JobHistory & Document;

@Schema({ timestamps: true })
export class JobHistory {
  @Prop({ required: true, type: Types.ObjectId })
  tenantId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  jobId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  assignedTo: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  assignedBy: Types.ObjectId;

  @Prop({ required: true })
  action: string;

  @Prop()
  notes?: string;
}

export const JobHistorySchema = SchemaFactory.createForClass(JobHistory);
