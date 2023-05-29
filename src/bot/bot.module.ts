import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import {
  IAmConsumerScene,
  StartScene,
  IAmSellerScene,
  MyAnnouncementsScene,
} from './scenes';
import { GeocoderModule } from 'src/geocoder';
import { AnnouncementsModule, CountersModule, UsersModule } from 'src/database';
import { NewAnnouncementScene } from './scenes/newAnnouncement';

@Module({
  imports: [GeocoderModule, UsersModule, AnnouncementsModule, CountersModule],
  providers: [
    BotUpdate,
    StartScene,
    IAmConsumerScene,
    IAmSellerScene,
    NewAnnouncementScene,
    MyAnnouncementsScene,
  ],
})
export class BotModule {}
