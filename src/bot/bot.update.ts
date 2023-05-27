import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Logger } from 'winston';
import { Context } from 'src/interfaces';
import { SellerGuard, TelegrafExceptionFilter } from 'src/common';
import { CALLBACK_NAMES, SCENES } from 'src/commonConstants';
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

  @UseGuards(SellerGuard)
  @Action(CALLBACK_NAMES.NEW_ANNOUNCEMENT)
  async newAnnouncement(@Ctx() ctx: Scenes.WizardContext & any) {
    await ctx.editMessageReplyMarkup({
      reply_markup: { remove_keyboard: true },
    });

    ctx.reply('!!!! Перевод на новое объявление');
  }
}
