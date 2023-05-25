import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth';
import { User, UsersDocument } from '../schemas';

@Injectable()
export class UsersServie {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UsersDocument>,
  ) {}

  async registration(createUserDto: CreateUserDto): Promise<User | null> {
    // Проверяем если юзер уже сущетсвует
    const existingUser = this.usersModel.collection.findOne({
      telegram_id: createUserDto.telegram_id,
    });

    if (existingUser) {
      return null;
    }

    const createdUser = new this.usersModel(createUserDto);

    return createdUser.save();
  }
}
