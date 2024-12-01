import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { APP_DOMAINS, BUG_STATUS } from '../constants';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Comment {
  @Prop({type: Types.ObjectId, ref: 'User'})
  user_id: Types.ObjectId;

  @Prop({type: String, default: ''})
  description: string;
}

export const commentSchema = SchemaFactory.createForClass(Comment);


@Schema({
  collection: 'bugs',
  timestamps: true,
  versionKey: false,
})
export class Bug {
  @Prop({type: String, required: true})
  title: string;

  @Prop({type: String, required: true})
  description: string;

  @Prop({type: String, enum: APP_DOMAINS, required: true})
  domain: APP_DOMAINS;

  @Prop({type: Date, required: true})
  due_date: Date;

  @Prop({type: Types.ObjectId, ref: 'User'})
  reporter_id: Types.ObjectId;

  @Prop({type: Types.ObjectId, ref: 'User'})
  assignee_id: Types.ObjectId;

  @Prop({type: [commentSchema], default: []})
  comments: Comment[];

  @Prop({type: String, enum: BUG_STATUS, default: BUG_STATUS.OPEN})
  status: BUG_STATUS;

  @Prop({type: Boolean, default: false})
  is_delete: boolean;
}

export const BugSchema = SchemaFactory.createForClass(Bug);
export type BugDocument = Bug & Document

