import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth';
import { User, UsersDocument } from '../schemas';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UsersDocument>,
  ) {}

  async registration(createUserDto: CreateUserDto): Promise<User | null> {
    // Проверяем если юзер уже сущетсвует
    let existingUser = null;

    await this.usersModel.collection
      .findOne({
        telegram_id: createUserDto.telegram_id,
      })
      .then((res) => {
        existingUser = res;
      });

    if (existingUser) {
      let updatedUser = null;

      await this.usersModel.collection
        .updateOne(
          {
            telegram_id: createUserDto.telegram_id,
          },
          { $set: createUserDto },
        )
        .then((res) => {
          updatedUser = res;
        });

      return updatedUser;
    } else {
      const createdUser = new this.usersModel(createUserDto);

      return createdUser.save();
    }
  }
}
