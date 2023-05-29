import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { CALLBACK_NAMES, SCENES, MESSAGES } from 'src/commonConstants';
import { TelegrafExceptionFilter } from 'src/common';
import { UseFilters } from '@nestjs/common';
import { sellersCabinetKeyboard } from 'src/bot/keyboards';

@UseFilters(TelegrafExceptionFilter)
@Scene(SCENES.SELLER_CABINET)
export class SellersCabinetScene {
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & any) {
    await ctx.reply(MESSAGES.SELLER_CABINET, sellersCabinetKeyboard.enter());
  }

  @Action(CALLBACK_NAMES.MY_ANNOUNCEMENTS)
  async onMyAnnouncements(@Ctx() ctx: SceneContext & any) {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();

    await ctx.scene.enter(SCENES.MY_ANNOUNCEMENTS);
  }

  @Action(CALLBACK_NAMES.MY_SELLER_PROFILE)
  async onMySellerProfile(@Ctx() ctx: SceneContext & any) {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();

    await ctx.scene.enter(SCENES.MY_SELLER_PROFILE);
  }

  @Action(CALLBACK_NAMES.NEW_ANNOUNCEMENT)
  async onNewAnnouncement(@Ctx() ctx: SceneContext & any) {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();

    await ctx.scene.enter(SCENES.NEW_ANNOUNCEMENT);
  }

  @Action(CALLBACK_NAMES.EXIT)
  async onSceneLeave(@Ctx() ctx: SceneContext & any) {
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup({
      reply_markup: { remove_keyboard: true },
    });

    await ctx.reply(MESSAGES.EXIT_FROM_SELLER_CABINET);

    await ctx.scene.leave();
  }
}
