import {
  Action,
  Command,
  Context as Ctx,
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
  announcementFormatter,
  getUserId,
  replyMainMenuMessage,
  shuffle,
} from 'src/common';
import {
  CALLBACK_NAMES,
  CATEGORIES,
  MESSAGES,
  SCENES,
} from 'src/commonConstants';
import { AnnouncementsService, UsersService } from 'src/database';
import { GeocoderService } from 'src/geocoder';
import { Markup, Scenes } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

// category
// title
// recommendations

@Scene(SCENES.FIND_ANNOUNCEMENT_SCENE)
export class FindAnnouncementScene {
  constructor(
    private announcementsService: AnnouncementsService,
    private usersService: UsersService,
  ) {}
  @SceneEnter()
  async onEnter(@Ctx() ctx: Scenes.SceneContext & any) {
    const user = await this.usersService.getUserById(getUserId(ctx));

    ctx.scene.state.user = user;
    ctx.scene.state.step = 0;

    switch (ctx.scene.state.type) {
      case 'category':
        ctx.scene.state.isInput = true;

        ctx.reply(MESSAGES.SELECT_CATEGORY, newAnnouncementKeyboard.step4());
        break;
      case 'title':
        ctx.scene.state.isInput = true;

        ctx.reply(MESSAGES.SELECT_TITLE, Markup.removeKeyboard());
        break;
      case 'recommendations':
        break;
    }
  }

  @Command('seller_cabinet')
  async onSellerCabinet(@Ctx() ctx: Scenes.WizardContext & any) {
    await ctx.scene.enter(SCENES.SELLER_CABINET);
  }

  @Command('main_menu')
  async onMainMenu(@Ctx() ctx: Scenes.WizardContext & any) {
    await ctx.scene.leave();

    replyMainMenuMessage(ctx);
  }

  @On('text')
  async onText(@Ctx() ctx: Scenes.WizardContext & any) {
    if (!ctx.scene.state.isInput) {
      return;
    }

    switch (ctx.scene.state.type) {
      case 'category':
        const category = ctx.update.message.text.split(' ').slice(1).join(' ');

        if (!CATEGORIES.includes(category)) {
          return;
        }

        ctx.scene.state.categoryToFind = category;

        await this.getAnnouncementsByCategory(ctx, category);

        break;
      case 'title':
        const title = ctx.update.message.text;

        ctx.scene.state.categoryToFind = title;

        await this.getAnnouncementsByTitle(ctx, title);

        break;
    }

    await ctx.reply(
      MESSAGES.ANNOUNCEMENTS_FOUND(ctx.scene.state.announcements.length),
      Markup.removeKeyboard(),
    );

    await this.showAnnouncement(ctx);
  }

  async getAnnouncementsByCategory(ctx: SceneContext & any, category: string) {
    const city = ctx.scene.state.user.city;

    const announcements =
      await this.announcementsService.findAnnouncementsByCategoryAndCity(
        city,
        category,
      );

    if (!announcements?.length) {
      await ctx.reply(
        MESSAGES.FIND_DESSERT_BY_CATEGORY_ERROR,
        Markup.removeKeyboard(),
      );

      await ctx.scene.leave();
    }

    ctx.scene.state.announcements = announcements;
  }

  async getAnnouncementsByTitle(ctx: SceneContext & any, title: string) {
    await ctx.reply(title + ' ' + ctx.scene.state.user.city);

    await ctx.scene.leave();
  }

  async showAnnouncement(@Ctx() ctx: Scenes.WizardContext & any) {
    const step = ctx.scene.state.step;
    const announcement = ctx.scene.state.announcements[step];

    await ctx.replyWithPhoto(announcement.photo, {
      caption: announcementFormatter(announcement),
      ...findAnnouncementsKeyboard.show(),
    });
  }

  @Action(CALLBACK_NAMES.EXIT)
  async onExit(@Ctx() ctx: Scenes.WizardContext & any) {
    await ctx.editMessageReplyMarkup(null);

    await ctx.scene.leave();
    await replyMainMenuMessage(ctx);
  }

  @Action(CALLBACK_NAMES.NEXT_ANNOUNCEMENT)
  async onNext(@Ctx() ctx: Scenes.WizardContext & any) {
    await ctx.editMessageReplyMarkup(null);

    const announcementsLength = ctx.scene.state.announcements.length;

    ctx.scene.state.step += 1;

    if (ctx.scene.state.step > announcementsLength - 1) {
      await ctx.scene.leave();

      await ctx.reply(
        MESSAGES.ALL_ANNOUNCEMENTS_VIEWED,
        Markup.removeKeyboard(),
      );
      await replyMainMenuMessage(ctx);

      return;
    }

    await this.showAnnouncement(ctx);
  }
}
