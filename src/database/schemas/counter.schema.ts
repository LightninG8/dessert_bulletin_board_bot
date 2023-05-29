import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CountersDocument = Counter & Document;

@Schema()
export class Counter {
  @Prop({ required: true, unique: true })
  sequenceName: string;

  @Prop({ required: true })
  sequenceValue: number;

  _id: mongoose.Types.ObjectId | string;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
