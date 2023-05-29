import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth';
import { User, UsersDocument } from '../schemas';
import { AnnouncementsService } from '../announcements';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UsersDocument>,
    @Inject(forwardRef(() => AnnouncementsService))
    private announcementsService: AnnouncementsService,
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
      const createdUser = new this.usersModel({
        ...createUserDto,
        announcements: [],
      });

      return createdUser.save();
    }
  }

  async getUserById(userId: number) {
    let result = null;

    await this.usersModel.collection
      .findOne({
        telegram_id: userId,
      })
      .then((res) => {
        result = res;
      });

    return result;
  }

  async addAnnouncementToUser(userId: number, announcementId: number) {
    return this.usersModel.collection.updateOne(
      { telegram_id: userId },
      { $push: { announcements: announcementId } },
    );
  }

  async removeAnnouncementFromUser(userId: number, announcementId: number) {
    return this.usersModel.collection.updateOne(
      { telegram_id: userId },
      { $pull: { announcements: announcementId } },
    );
  }

  async getUserAnnouncements(userId: number) {
    let announcementsList = null;

    await this.getUserById(userId).then((res) => {
      announcementsList = res.announcements;
    });

    let result = null;

    await this.announcementsService
      .getManyAnnouncementsById(announcementsList)
      .then((res) => {
        result = res;
      });

    return result;
  }

  async changeUser(userId: number, obj: object) {
    await this.usersModel.collection.updateOne(
      { telegram_id: userId },
      {
        $set: obj,
      },
    );
  }
}
