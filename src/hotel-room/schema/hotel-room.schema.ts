import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ID } from '../../common/ID';

export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom {
  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
  })
  hotelId: ID;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  images: string[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: true })
  isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
