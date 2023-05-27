import {
  Action,
  Command,
  Ctx,
  Hears,
  Scene,
  SceneEnter,
  Start,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Update } from 'telegraf/typings/core/types/typegram';
import { CALLBACK_NAMES, SCENES, MESSAGES } from 'src/commonConstants';
import { Context } from 'vm';
import {
  SellerGuard,
  TelegrafExceptionFilter,
  getCallbackData,
} from 'src/common';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Markup, Scenes } from 'telegraf';
import { startKeyboards } from 'src/bot/keyboards';

@UseFilters(TelegrafExceptionFilter)
@Scene(SCENES.START_SCENE)
export class StartScene {
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & any) {
    console.log(ctx.update.message.from);
    await ctx.reply(MESSAGES.START, startKeyboards.start());
  }

  @Action(CALLBACK_NAMES.I_AM_CONSUMER)
  async onIAmConsumer(
    @Ctx() ctx: Context & { update: Update.CallbackQueryUpdate },
  ) {
    // await ctx.scene.leave();
    await ctx.scene.enter(SCENES.I_AM_CONSUMER_SCENE);
  }

  @UseGuards(SellerGuard)
  @Action(CALLBACK_NAMES.I_AM_SELLER)
  async onIAmSeller(
    @Ctx()
    ctx: Scenes.SceneContext & { update: Update.CallbackQueryUpdate } & any,
  ) {
    ctx.answerCbQuery();

    await ctx.editMessageReplyMarkup(null);

    await ctx.scene.enter(SCENES.I_AM_SELLER_SCENE);
  }
}
