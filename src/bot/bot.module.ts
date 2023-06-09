import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import {
  IAmConsumerScene,
  StartScene,
  IAmSellerScene,
  MyAnnouncementsScene,
  SellersCabinetScene,
  MySellerProfileScene,
  EditLocationScene,
  FindAnnouncementScene,
} from './scenes';
import { GeocoderModule } from 'src/geocoder';
import {
  AnnouncementsModule,
  CountersModule,
  GuardsModule,
  UsersModule,
} from 'src/database';
import { NewAnnouncementScene } from './scenes/newAnnouncement';

@Module({
  imports: [
    GeocoderModule,
    UsersModule,
    AnnouncementsModule,
    CountersModule,
    GuardsModule,
  ],
  providers: [
    BotUpdate,
    StartScene,
    IAmConsumerScene,
    IAmSellerScene,
    NewAnnouncementScene,
    MyAnnouncementsScene,
    SellersCabinetScene,
    MySellerProfileScene,
    EditLocationScene,
    FindAnnouncementScene,
  ],
})
export class BotModule {}
