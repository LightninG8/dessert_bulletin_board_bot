import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UsersDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  telegram_id: number;

  name: string;

  isSalesman: boolean;

  _id: mongoose.Types.ObjectId | string;
}

export const UserSchema = SchemaFactory.createForClass(User);
