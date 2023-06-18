import {
  Action,
  Command,
  Ctx,
  Hears,
  InjectBot,
  Scene,
  SceneEnter,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import {
  CALLBACK_NAMES,
  SCENES,
  MESSAGES,
  BOT_NAME,
} from 'src/commonConstants';
import { TelegrafExceptionFilter, replyMainMenuMessage } from 'src/common';
import { UseFilters } from '@nestjs/common';
import { mainMenuKeyboard, sellersCabinetKeyboard } from 'src/bot/keyboards';
import { Context, Telegraf } from 'telegraf';

@UseFilters(TelegrafExceptionFilter)
@Scene(SCENES.SELLER_CABINET)
export class SellersCabinetScene {
  constructor(@InjectBot(BOT_NAME) private bot: Telegraf<Context>) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & any) {
    const message = await ctx.reply(
      MESSAGES.SELLER_CABINET,
      sellersCabinetKeyboard.enter(),
    );
    ctx.scene.state.messageId = message.message_id;
    ctx.scene.state.chatId = message.chat.id;
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
    await ctx.deleteMessage();

    await replyMainMenuMessage(ctx);

    await ctx.scene.leave();
  }

  @Action(CALLBACK_NAMES.EDIT_USER_CITY)
  async onUserEditCity(@Ctx() ctx: SceneContext & any) {
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup({
      reply_markup: { remove_keyboard: true },
    });

    await ctx.scene.enter(SCENES.EDIT_LOCATION_SCENE);
  }

  @Command('main_menu')
  async onMainMenu(@Ctx() ctx: SceneContext & any) {
    const { chatId, messageId } = ctx.scene.state;

    this.bot.telegram.deleteMessage(chatId, messageId);
    await replyMainMenuMessage(ctx);

    await ctx.scene.leave();
  }
}
