import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter, CountersDocument } from '../schemas';

@Injectable()
export class CountersService {
  constructor(
    @InjectModel(Counter.name)
    private countersModel: Model<CountersDocument>,
  ) {}
  async addCounter(sequenceName: string): Promise<Counter | null> {
    const createdCounter = new this.countersModel({
      sequenceName,
      sequenceValue: 0,
    });

    return createdCounter.save();
  }

  async getNextSequenceValue(sequenceName: string): Promise<number | null> {
    // Проверяем если юзер уже сущетсвует
    let existingCounter = null;

    await this.countersModel.collection
      .findOne({
        sequenceName,
      })
      .then((res) => {
        existingCounter = res;
      });

    if (!existingCounter) {
      this.addCounter(sequenceName);
    }

    let nextSequenceValue = null;

    await this.countersModel.collection.updateOne(
      { sequenceName },
      { $inc: { sequenceValue: 1 } },
    );

    await this.countersModel.collection
      .findOne({ sequenceName })
      .then((res) => {
        nextSequenceValue = res.sequenceValue;
      });

    return nextSequenceValue;
  }
}
