import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserLocation } from './user.schema';

export type AnnouncementDocument = Announcement & Document;

@Schema()
export class Announcement {
  @Prop({ required: true })
  readonly title: string;

  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  photo: string | null;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  contacts: string;

  @Prop({ type: UserLocation })
  location?: UserLocation | null;

  @Prop({ required: true })
  authorId: number;

  @Prop({ required: true })
  createdAt: number;

  @Prop({ required: true })
  category: string;

  _id: mongoose.Types.ObjectId | string;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
