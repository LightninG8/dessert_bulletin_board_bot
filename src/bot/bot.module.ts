import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { IAmConsumerScene, StartScene, IAmSellerScene } from './scenes';
import { GeocoderModule } from 'src/geocoder';
import { UsersModule } from 'src/database';

@Module({
  imports: [GeocoderModule, UsersModule],
  providers: [BotUpdate, StartScene, IAmConsumerScene, IAmSellerScene],
})
export class BotModule {}
