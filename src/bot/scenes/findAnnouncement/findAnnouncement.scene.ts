import { UseGuards } from '@nestjs/common';
import {
  Action,
  Command,
  Context as Ctx,
  InjectBot,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import {
  findAnnouncementsKeyboard,
  iAmConsumerKeyboards,
  iAmSellerKeyboards,
  mainMenuKeyboard,
  newAnnouncementKeyboard,
} from 'src/bot/keyboards';
import {
  AuthGuard,
  SellerGuard,
  announcementFormatter,
  complainAnnouncementFormatter,
  deleteMessage,
  getCallbackData,
  getIdFromCbQuery,
  getUserId,
  replyMainMenuMessage,
  shuffle,
} from 'src/common';
import {
  BOT_NAME,
  CALLBACK_NAMES,
  CATEGORIES,
  MESSAGES,
  SCENES,
} from 'src/commonConstants';
import { AnnouncementsService, UsersService } from 'src/database';
import { GeocoderService } from 'src/geocoder';
import { Context, Markup, Scenes, Telegraf } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

// category
// title
// recommendations

@Scene(SCENES.FIND_ANNOUNCEMENT_SCENE)
export class FindAnnouncementScene {
  constructor(
    private announcementsService: AnnouncementsService,
    private usersService: UsersService,
    @InjectBot(BOT_NAME) private bot: Telegraf<Context>,
  ) {}
  @SceneEnter()
  async onEnter(@Ctx() ctx: Scenes.SceneContext & any) {
    const user = await this.usersService.getUserById(getUserId(ctx));

    ctx.scene.state.user = user;
    ctx.scene.state.step = 0;
    ctx.scene.state.showInfo = false;
    ctx.scene.state.showContacts = false;

    switch (ctx.scene.state.type) {
      case 'all':
        await this.getRecommendedAnnouncements(ctx);
        break;
      case 'favourited':
        await this.getFavouritedAnnouncements(ctx);
        break;
    }

    if (!ctx.scene.state.announcements?.length) {
      return;
    }

    await ctx.reply(
      MESSAGES.ANNOUNCEMENTS_FOUND(ctx.scene.state.announcements?.length),
      Markup.removeKeyboard(),
    );

    await this.showAnnouncement(ctx);
  }

  @UseGuards(SellerGuard)
  @UseGuards(AuthGuard)
  @Command('seller_cabinet')
  async onSellerCabinet(@Ctx() ctx: Scenes.SceneContext & any) {
    await ctx.scene.enter(SCENES.SELLER_CABINET);
  }

  @Command('main_menu')
  async onMainMenu(@Ctx() ctx: Scenes.SceneContext & any) {
    await ctx.scene.leave();

    replyMainMenuMessage(ctx);
  }

  async getRecommendedAnnouncements(ctx: SceneContext & any) {
    const city = ctx.scene.state.user.city;

    const announcements =
      await this.announcementsService.findRecommendedAnnouncements(city);

    if (announcements?.length == 0) {
      await ctx.reply(
        MESSAGES.RECOMMENDATIONS_CITY_ERROR,
        Markup.removeKeyboard(),
      );

      await this.onMainMenu(ctx);
    }

    ctx.scene.state.announcements = shuffle(announcements);
  }

  async getFavouritedAnnouncements(ctx: SceneContext & any) {
    const announcements =
      await this.announcementsService.getManyAnnouncementsById(
        ctx.scene.state.user.favouritedAnnouncements,
      );

    if (!announcements?.length) {
      await ctx.reply(MESSAGES.RECOMMENDATIONS_ERROR, Markup.removeKeyboard());

      await this.onMainMenu(ctx);
    }

    ctx.scene.state.announcements = announcements.reverse();
  }

  async showAnnouncement(@Ctx() ctx: Scenes.SceneContext & any) {
    const step = ctx.scene.state.step;
    const announcement = ctx.scene.state.announcements[step];
    const keyboard = await this.getKeyboard(ctx);

    ctx.scene.state.showInfo = false;
    ctx.scene.state.showContacts = false;

    await ctx.replyWithPhoto(announcement.photo, {
      caption: announcementFormatter(announcement, {
        showInfo: false,
        showContacts: false,
      }),
      ...keyboard,
    });
  }

  async updateAnnouncement(@Ctx() ctx: Scenes.SceneContext & any) {
    const step = ctx.scene.state.step;
    const announcement = ctx.scene.state.announcements[step];
    const keyboard = await this.getKeyboard(ctx);

    ctx.scene.state.showInfo = false;
    ctx.scene.state.showContacts = false;

    await ctx.editMessageMedia({
      type: 'photo',
      media: announcement.photo,
    });
    await ctx.editMessageCaption(
      announcementFormatter(announcement, {
        showInfo: false,
        showContacts: false,
      }),
    );
    await ctx.editMessageReplyMarkup(keyboard.reply_markup);
  }

  @Action(CALLBACK_NAMES.EXIT)
  async onExit(@Ctx() ctx: Scenes.SceneContext & any) {
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(null);

    await ctx.scene.leave();
    await replyMainMenuMessage(ctx);
  }

  @Action(CALLBACK_NAMES.NEXT_ANNOUNCEMENT)
  async onNext(@Ctx() ctx: Scenes.SceneContext & any) {
    await ctx.answerCbQuery();

    const announcementsLength = ctx.scene.state.announcements?.length;

    ctx.scene.state.step += 1;

    if (ctx.scene.state.step > announcementsLength - 1) {
      await ctx.scene.leave();
      await ctx.editMessageReplyMarkup(null);

      await ctx.reply(
        MESSAGES.ALL_ANNOUNCEMENTS_VIEWED,
        Markup.removeKeyboard(),
      );
      await replyMainMenuMessage(ctx);

      return;
    }

    await this.updateAnnouncement(ctx);
  }

  @Action(CALLBACK_NAMES.BACK)
  async onBack(@Ctx() ctx: Scenes.SceneContext & any) {
    await ctx.answerCbQuery();
    ctx.scene.state.step -= 1;

    if (ctx.scene.state.step < 0) {
      return;
    }

    await this.updateAnnouncement(ctx);
  }

  @Action(CALLBACK_NAMES.SHOW_INFO)
  async showInfo(@Ctx() ctx: Scenes.SceneContext & any) {
    await ctx.answerCbQuery();

    ctx.scene.state.showInfo = true;

    await this.updateMessage(ctx);
  }

  @Action(CALLBACK_NAMES.SHOW_CONTACTS)
  async showContacts(@Ctx() ctx: Scenes.SceneContext & any) {
    await ctx.answerCbQuery();

    ctx.scene.state.showContacts = true;

    await this.updateMessage(ctx);
  }

  async updateMessage(@Ctx() ctx: Scenes.SceneContext & any) {
    const step = ctx.scene.state.step;
    const announcement = ctx.scene.state.announcements[step];

    const keyboard = await this.getKeyboard(ctx);
    const { showContacts, showInfo } = ctx.scene.state;

    await ctx.editMessageCaption(
      announcementFormatter(announcement, {
        showContacts,
        showInfo,
      }),
      keyboard,
    );
  }

  @Action(CALLBACK_NAMES.ADD_TO_FAVORITED)
  async addToFavorited(@Ctx() ctx: Scenes.SceneContext & any) {
    const step = ctx.scene.state.step;
    const announcement = ctx.scene.state.announcements[step];

    await this.usersService.addFavoritedAnnouncementToUser(
      getUserId(ctx),
      announcement.id,
    );

    if (
      ctx.scene.state.user.favouritedAnnouncements.includes(announcement.id)
    ) {
      await ctx.answerCbQuery('Объявление уже добавлено в избранное');

      return;
    }
    await ctx.answerCbQuery('Объявление добавлено в избранное');

    ctx.scene.state.user = await this.usersService.getUserById(getUserId(ctx));

    await this.updateMessage(ctx);
  }

  @Action(CALLBACK_NAMES.REMOVE_FROM_FAVORITED)
  async removeFromFavorited(@Ctx() ctx: Scenes.SceneContext & any) {
    const step = ctx.scene.state.step;
    const announcement = ctx.scene.state.announcements[step];

    await this.usersService.removeFavoritedAnnouncementFromUser(
      getUserId(ctx),
      announcement.id,
    );

    await ctx.answerCbQuery('Объявление удалено из избранного');

    ctx.scene.state.user = await this.usersService.getUserById(getUserId(ctx));

    await this.updateMessage(ctx);
  }

  async getKeyboard(@Ctx() ctx: Scenes.SceneContext & any) {
    const step = ctx.scene.state.step;
    const announcement = ctx.scene.state.announcements[step];

    const keyboard = ctx.scene.state.user.favouritedAnnouncements.includes(
      announcement.id,
    )
      ? findAnnouncementsKeyboard.showFavourited()
      : findAnnouncementsKeyboard.show();

    if (step == 0) {
      keyboard.reply_markup.inline_keyboard = [
        [keyboard.reply_markup.inline_keyboard[0]?.pop()],
        ...keyboard.reply_markup.inline_keyboard.splice(1),
      ];
    }

    return keyboard;
  }

  @Action(CALLBACK_NAMES.COMPLAIN_ANNOUNCEMENT)
  async onComplainAnnouncement(@Ctx() ctx: Scenes.SceneContext & any) {
    await ctx.answerCbQuery();

    await ctx.editMessageReplyMarkup(
      findAnnouncementsKeyboard.complain().reply_markup,
    );
  }

  @Action(CALLBACK_NAMES.BACK_FROM_COMPLAIN)
  async onBackFromComplain(@Ctx() ctx: Scenes.SceneContext & any) {
    await ctx.answerCbQuery();

    const keyboard = await this.getKeyboard(ctx);
    await ctx.editMessageReplyMarkup(keyboard.reply_markup);
  }

  @Action(new RegExp(`${CALLBACK_NAMES.COMPLAIN}:[0-9]+`))
  async onComplain(@Ctx() ctx: Scenes.SceneContext & any) {
    const id = getIdFromCbQuery(getCallbackData(ctx));
    const types = [
      'Мошеничество',
      'Контакты недоступны',
      'Чужие работы/фото',
      'Другое',
    ];
    const type = types[id];

    const step = ctx.scene.state.step;
    const announcement = ctx.scene.state.announcements[step];

    const author = await this.usersService.getUserById(announcement.authorId);

    try {
      await this.bot.telegram.sendPhoto(-1001951628623, announcement.photo, {
        caption: complainAnnouncementFormatter(announcement, {
          type,
          author,
        }),
      });
    } catch (e) {
      console.log(e);
    }

    await ctx.answerCbQuery('Жалоба отправлена');

    const keyboard = await this.getKeyboard(ctx);
    await ctx.editMessageReplyMarkup(keyboard.reply_markup);
  }
}
