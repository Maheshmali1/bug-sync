import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema(
  {
    collection: 'blacklist_tokens',
    timestamps: true,
    versionKey: false,
  }
)
export class BlackListToken {
  @Prop({ type: String, required: true })
  access_token: string;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({type: Boolean, default: false})
  is_delete: boolean;
}

export const blackListTokenSchema= SchemaFactory.createForClass(BlackListToken);


export type blackListTokenDocument = BlackListToken & Document