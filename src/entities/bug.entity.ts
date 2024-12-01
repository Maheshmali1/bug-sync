import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'bugs',
  timestamps: true,
  versionKey: false,
})
export class Bug {

}

export const BugSchema = SchemaFactory.createForClass(Bug);
export type BugDocument = Bug & Document

