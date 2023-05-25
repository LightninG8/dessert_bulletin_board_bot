import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Logger } from 'winston';
import { Context } from 'src/interfaces';
import { SellerGuard, TelegrafExceptionFilter } from 'src/common';
import { SCENES } from 'src/commonConstants';
import { Scenes } from 'telegraf';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class BotUpdate {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.scene.enter(SCENES.START_SCENE);
  }

  @Command('admin')
  @UseGuards(SellerGuard)
  async onAdmin(ctx: Context) {
    await ctx.reply('Сообщение для админов');
  }
}
