import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

enum TaskStatus {
  Active,
  Completed,
}

@Schema()
export class Task {
  @Prop()
  title: string;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.Active })
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
