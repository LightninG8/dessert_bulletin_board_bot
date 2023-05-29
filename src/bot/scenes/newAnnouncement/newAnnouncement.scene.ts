import { UseFilters } from '@nestjs/common';
import {
  Context as Ctx,
  Hears,
  InjectBot,
  On,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf';
import { newAnnouncementKeyboard } from 'src/bot/keyboards';
import {
  TelegrafExceptionFilter,
  announcementFormatter,
  getUserId,
} from 'src/common';
import { BOT_NAME, CATEGORIES, MESSAGES, SCENES } from 'src/commonConstants';
import { AnnouncementsService, UsersService } from 'src/database';
import { Scenes, Markup, Telegraf, Context } from 'telegraf';

@UseFilters(TelegrafExceptionFilter)
@Wizard(SCENES.NEW_ANNOUNCEMENT)
export class NewAnnouncementScene {
  constructor(
    private usersService: UsersService,
    private announcementsService: AnnouncementsService,
  ) {}

  // Введите название
  @WizardStep(1)
  async step1(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.announcement = {};

    let user = null;

    await this.usersService.getUserById(getUserId(ctx)).then((res) => {
      user = res;
    });

    ctx.wizard.state.user = user;

    await ctx.reply(MESSAGES.INPUT_TITLE, Markup.removeKeyboard());

    await ctx.wizard.next();
  }

  // Введите описание
  @WizardStep(2)
  @On('text')
  async step2(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.announcement.title = ctx.update.message.text;

    await ctx.reply(MESSAGES.INPUT_DESCRIPTION, Markup.removeKeyboard());

    await ctx.wizard.next();
  }

  // Отправьте фото
  @WizardStep(3)
  @On('text')
  async step3(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.announcement.description = ctx.update.message.text;

    await ctx.reply(MESSAGES.INPUT_PHOTOS, Markup.removeKeyboard());

    await ctx.wizard.next();
  }

  // Выберите категорию
  @WizardStep(4)
  @On('photo')
  async step4(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.announcement.photo =
      ctx.update.message.photo.pop().file_id;

    await ctx.reply(MESSAGES.INPUT_CATEGORIES, newAnnouncementKeyboard.step4());

    await ctx.wizard.next();
  }

  // Введите цену
  @WizardStep(5)
  @On('text')
  async step5(@Ctx() ctx: Scenes.WizardContext & any) {
    const category = ctx.update.message.text.split(' ').slice(1).join(' ');

    if (!CATEGORIES.includes(category)) {
      return;
    }

    ctx.wizard.state.announcement.category = category;

    await ctx.reply(MESSAGES.INPUT_PRICE, Markup.removeKeyboard());

    await ctx.wizard.next();
  }

  // Проверьте правильность
  @WizardStep(6)
  async step6(@Ctx() ctx: Scenes.WizardContext & any) {
    const inputPrice = Number(ctx.update.message.text);

    if (!inputPrice) {
      await ctx.reply('Введите корректное число');

      return;
    }

    const { contacts, city, location, telegram_id } = ctx.wizard.state.user;

    ctx.wizard.state.announcement.price = inputPrice;
    ctx.wizard.state.announcement.contacts = contacts;
    ctx.wizard.state.announcement.city = city;
    ctx.wizard.state.announcement.location = location;
    ctx.wizard.state.announcement.authorId = telegram_id;

    const { photo } = ctx.wizard.state.announcement;

    await ctx.reply(MESSAGES.CHECK_THE_CORRECTNESS);

    await ctx.replyWithPhoto(photo, {
      ...newAnnouncementKeyboard.step6(),
      caption: announcementFormatter(ctx.wizard.state.announcement),
    });

    await ctx.wizard.next();
  }

  // Заполнить заново
  @WizardStep(7)
  @Hears(MESSAGES.EDIT_AGAIN)
  async editAgain(@Ctx() ctx: Scenes.WizardContext & any) {
    await ctx.scene.reenter();
  }

  // Объявление добавлено
  @WizardStep(7)
  @Hears(MESSAGES.CONFIRM)
  async confirm(@Ctx() ctx: Scenes.WizardContext & any) {
    this.announcementsService.addAnnouncement(ctx.wizard.state.announcement);

    await ctx.reply(MESSAGES.ANNOUNCEMENT_ADDED, Markup.removeKeyboard());

    await ctx.scene.enter(SCENES.SELLER_CABINET);
  }
}
