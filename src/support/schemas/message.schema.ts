import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ID } from '../../common/ID';
import * as mongoose from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  author: ID;

  @Prop({ required: true })
  sentAt: Date;

  @Prop({ required: true })
  text: string;

  @Prop({ default: null })
  readAt: Date | null; // message is read, when this field is not empty
}

export const MessageSchema = SchemaFactory.createForClass(Message);
