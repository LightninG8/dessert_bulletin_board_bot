import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Announcement, AnnouncementSchema } from '../schemas';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { Connection } from 'mongoose';
import { AnnouncementsService } from './announcements.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CountersModule } from '../counters';
import { UsersModule } from '../users';

@Module({
  imports: [
    CountersModule,
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: Announcement.name,
        schema: AnnouncementSchema,
      },
    ]),
  ],
  providers: [AnnouncementsService],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}
