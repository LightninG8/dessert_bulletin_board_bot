import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type GuardDocument = Guard & Document;

@Schema()
export class Guard {
  @Prop({ required: true, unique: true })
  guardName: string;

  @Prop({ required: true })
  guardArray: number[];

  _id: mongoose.Types.ObjectId | string;
}

export const GuardSchema = SchemaFactory.createForClass(Guard);
