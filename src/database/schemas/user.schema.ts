import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UsersDocument = User & Document;

@Schema()
export class UserLocation {
  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  formattedAddress: string;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zipcode: string;

  @Prop()
  streetName: string;

  @Prop()
  streetNumber: string;

  @Prop()
  countryCode: string;

  @Prop()
  neighbourhood: string;

  @Prop()
  provider: string;
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  telegram_id: number;

  @Prop({ required: true })
  @Prop()
  name: string;

  @Prop({ required: true })
  type: 'seller' | 'consumer';

  @Prop()
  photo?: string | null;

  @Prop({ required: true })
  @Prop()
  city: string;

  @Prop()
  about?: string;

  @Prop()
  contacts?: string;

  @Prop({ required: true })
  announcements?: string[];

  @Prop({ type: UserLocation })
  location?: UserLocation | null;

  _id: mongoose.Types.ObjectId | string;
}

export const UserSchema = SchemaFactory.createForClass(User);
