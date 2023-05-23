import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Announcement, AnnouncementSchema } from 'src/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Announcement.name, schema: AnnouncementSchema },
    ]),
  ],
})
export class AnnouncementsModule {}
