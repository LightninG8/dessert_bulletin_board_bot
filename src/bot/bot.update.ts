import {
  Action,
  Command,
  Ctx,
  InjectBot,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Logger } from 'winston';
import { Context } from 'src/interfaces';
import {
  AnnouncementsLimitGuard,
  AuthGuard,
  SellerGuard,
  TelegrafExceptionFilter,
  replyMainMenuMessage,
} from 'src/common';
import { BOT_NAME, CALLBACK_NAMES, SCENES } from 'src/commonConstants';
import { Scenes, Telegraf } from 'telegraf';
import { CountersService } from 'src/database';
import { ReplyKeyboardRemove } from 'telegraf/typings/core/types/typegram';
@Update()
@UseFilters(TelegrafExceptionFilter)
export class BotUpdate {
  constructor(
    @InjectBot(BOT_NAME) private bot: Telegraf<Context>,
    @Inject('winston') private readonly logger: Logger,
    private countersService: CountersService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.scene.enter(SCENES.START_SCENE);
  }

  @Command('admin')
  @UseGuards(SellerGuard)
  async onAdmin(ctx: Context) {
    await ctx.reply('Сообщение для админов');
  }

  @UseGuards(AnnouncementsLimitGuard)
  @UseGuards(SellerGuard)
  @Action(CALLBACK_NAMES.NEW_ANNOUNCEMENT)
  async newAnnouncementAction(@Ctx() ctx: Scenes.WizardContext & any) {
    await ctx.editMessageReplyMarkup({
      reply_markup: { remove_keyboard: true },
    });

    await ctx.scene.enter(SCENES.NEW_ANNOUNCEMENT);
  }

  @UseGuards(AnnouncementsLimitGuard)
  @UseGuards(SellerGuard)
  @UseGuards(AuthGuard)
  @Command('new_announcement')
  async newAnnouncement(@Ctx() ctx: Context) {
    await ctx.scene.enter(SCENES.NEW_ANNOUNCEMENT);
  }

  // @UseGuards(SellerGuard)
  // @UseGuards(AuthGuard)
  // @Command('my_announcements')
  // async myAnnouncements(@Ctx() ctx: Context) {
  //   await ctx.scene.enter(SCENES.MY_ANNOUNCEMENTS);
  // }

  @UseGuards(SellerGuard)
  @UseGuards(AuthGuard)
  @Command('seller_cabinet')
  async sellersCabinet(@Ctx() ctx: Context & any) {
    await ctx.scene.enter(SCENES.SELLER_CABINET);
  }

  @Command('main_menu')
  async onMainMenu(@Ctx() ctx: Context & any) {
    await replyMainMenuMessage(ctx);
  }

  @Action(CALLBACK_NAMES.FIND_DESSERT_BY_CATEGORY)
  async onFindByCategory(@Ctx() ctx: Context) {
    await ctx.editMessageReplyMarkup(null);

    await ctx.scene.enter(SCENES.FIND_ANNOUNCEMENT_SCENE, { type: 'category' });
  }

  @Action(CALLBACK_NAMES.FIND_DESSERT_BY_TITLE)
  async onFindByTitle(@Ctx() ctx: Context & any) {
    await ctx.editMessageReplyMarkup(null);

    await ctx.scene.enter(SCENES.FIND_ANNOUNCEMENT_SCENE, { type: 'title' });
  }

  @Action(CALLBACK_NAMES.RECOMMENDATIONS)
  async onRecommendations(@Ctx() ctx: Context & any) {
    await ctx.editMessageReplyMarkup(null);

    await ctx.scene.enter(SCENES.FIND_ANNOUNCEMENT_SCENE, {
      type: 'recommendations',
    });
  }

  @Action(CALLBACK_NAMES.EDIT_LOCATION)
  async onEditLocation(@Ctx() ctx: Context & any) {
    await ctx.editMessageReplyMarkup(null);

    await ctx.scene.enter(SCENES.EDIT_LOCATION_SCENE);
  }
}
