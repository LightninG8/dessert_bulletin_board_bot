import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AnnouncementDocument = Announcement & Document;

@Schema()
export class Announcement {
  @Prop({ required: true })
  id: number;

  _id: mongoose.Types.ObjectId | string;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
