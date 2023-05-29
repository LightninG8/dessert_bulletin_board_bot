import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Counter, CounterSchema } from '../schemas';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { CountersService } from './counters.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Counter.name,
        schema: CounterSchema,
      },
    ]),
  ],
  providers: [CountersService],
  exports: [CountersService],
})
export class CountersModule {}
