import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { IAmConsumerScene, StartScene, IAmSellerScene } from './scenes';
import { GeocoderModule } from 'src/geocoder';

@Module({
  imports: [GeocoderModule],
  providers: [BotUpdate, StartScene, IAmConsumerScene, IAmSellerScene],
})
export class BotModule {}
