import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { APP_DOMAINS, USER_AVAILABILITY, USER_ROLES } from '../constants';
import { Document } from 'mongoose';

@Schema(
  {
    collection: 'users',
    timestamps: true,
    versionKey: false,
  }
)
export class User {
  @Prop({type: String, required: true})
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: USER_ROLES, required: false, default: USER_ROLES.USER })
  role: USER_ROLES;

  @Prop({type: [String], enum: APP_DOMAINS, default: [] })
  skills:APP_DOMAINS []

  @Prop({ type: Boolean, default: false })
  is_delete: boolean

  @Prop({type: String, enum: USER_AVAILABILITY, default: USER_AVAILABILITY.AVAILABLE})
  availability: USER_AVAILABILITY;
}

export const userSchema = SchemaFactory.createForClass(User);
export type userDocument =  User & Document;
