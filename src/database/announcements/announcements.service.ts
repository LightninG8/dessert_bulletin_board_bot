import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddAnnouncementDto } from 'src/auth';
import { Announcement, AnnouncementDocument } from '../schemas';
import { CountersService } from '../counters';
import { UsersService } from '../users';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(Announcement.name)
    private announcementModel: Model<AnnouncementDocument>,
    private countersService: CountersService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async addAnnouncement(
    addAnnouncementDto: AddAnnouncementDto,
  ): Promise<Announcement | null> {
    let id = 0;

    await this.countersService
      .getNextSequenceValue('announcements')
      .then((res) => {
        id = res;
      });

    const createdAnnouncement = new this.announcementModel({
      ...addAnnouncementDto,
      id: id,
      createdAt: new Date(),
    });

    this.usersService.addAnnouncementToUser(addAnnouncementDto.authorId, id);

    return createdAnnouncement.save();
  }

  async getAnnouncementById(announcementId: number) {
    let result = null;
    return await this.announcementModel.collection
      .findOne({
        id: announcementId,
      })
      .then((res) => {
        result = res;
      });

    return result;
  }

  async getManyAnnouncementsById(announcementId: number[]) {
    const docs = await this.announcementModel.collection
      .find({
        id: { $in: announcementId },
      })
      .toArray();

    return docs;
  }
}
