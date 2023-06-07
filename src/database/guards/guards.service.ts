import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guard, GuardDocument } from '../schemas';

@Injectable()
export class GuardsService {
  constructor(
    @InjectModel(Guard.name)
    private guardsModel: Model<GuardDocument>,
  ) {}
  async addGuard(guardName: string): Promise<Guard | null> {
    const createdGuard = new this.guardsModel({
      guardName,
      guardArray: [],
    });

    return createdGuard.save();
  }

  async touchGuard(guardName: string) {
    // Проверяем если гвард уже сущетсвует
    let existingGuard = null;

    await this.guardsModel.collection
      .findOne({
        guardName,
      })
      .then((res) => {
        existingGuard = res;
      });

    if (!existingGuard) {
      existingGuard = await this.addGuard(guardName);
    }

    return existingGuard;
  }

  async addValueToGuardArray(guardName: string, value: number): Promise<void> {
    const guard = await this.touchGuard(guardName);

    if (guard?.guardArray?.include(value)) {
      return;
    }

    await this.guardsModel.collection.updateOne(
      { guardName },
      { $push: { guardArray: value } },
    );
  }

  async removeValueFromGuardArray(
    guardName: string,
    value: number,
  ): Promise<void> {
    await this.touchGuard(guardName);

    await this.guardsModel.collection.updateOne(
      { guardName },
      { $pull: { guardArray: value } },
    );
  }
}
