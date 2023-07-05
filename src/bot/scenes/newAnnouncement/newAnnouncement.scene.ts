import { UseFilters } from '@nestjs/common';
import {
  Command,
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

  @Command('start')
  @Command('main_menu')
  @Command('seller_cabinet')
  onMainMenu(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.reply('Завершите добавление объявления');
  }

  // Введите название
  @WizardStep(1)
  async step1(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.announcement = {};

    let user = null;

    await this.usersService.getUserById(getUserId(ctx)).then((res) => {
      user = res;
    });

    ctx.wizard.state.user = user;

    await ctx.reply(
      MESSAGES.NEW_ANNOUNCEMENT_DESCRIPTION(
        ctx.wizard.state.user?.name || 'Кондитер',
      ),
      Markup.removeKeyboard(),
    );

    await ctx.reply(MESSAGES.INPUT_TITLE, newAnnouncementKeyboard.exit());

    await ctx.wizard.next();
  }

  // Введите описание
  @WizardStep(2)
  @On('text')
  async step2(@Ctx() ctx: Scenes.WizardContext & any) {
    if (ctx.update.message.text.length > 100) {
      await ctx.reply(MESSAGES.EDIT_LENGTH_ERROR(100));

      return;
    }

    ctx.wizard.state.announcement.title = ctx.update.message.text;

    await ctx.reply(MESSAGES.INPUT_DESCRIPTION, newAnnouncementKeyboard.exit());

    await ctx.wizard.next();
  }

  // Введите цену
  @WizardStep(3)
  async step3(@Ctx() ctx: Scenes.WizardContext & any) {
    if (ctx.update.message.text.length > 500) {
      await ctx.reply(MESSAGES.EDIT_LENGTH_ERROR(500));

      return;
    }

    ctx.wizard.state.announcement.description = ctx.update.message.text;

    await ctx.reply(MESSAGES.INPUT_PRICE, newAnnouncementKeyboard.exit());

    await ctx.wizard.next();
  }

  // Отправьте фото
  @WizardStep(4)
  @On('text')
  async step5(@Ctx() ctx: Scenes.WizardContext & any) {
    const inputPrice = Number(ctx.update.message.text);

    if (!inputPrice) {
      await ctx.reply('Введите корректное число');

      return;
    }

    ctx.wizard.state.announcement.price = inputPrice;

    await ctx.reply(MESSAGES.INPUT_PHOTOS, newAnnouncementKeyboard.exit());

    await ctx.wizard.next();
  }

  // Проверьте правильность
  @WizardStep(5)
  @On('photo')
  async step6(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.announcement.photo =
      ctx.update.message.photo.pop().file_id;

    const { contacts, city, location, telegram_id, about } =
      ctx.wizard.state.user;

    ctx.wizard.state.announcement.contacts = contacts;
    ctx.wizard.state.announcement.about = about;
    ctx.wizard.state.announcement.city = city;
    ctx.wizard.state.announcement.location = location;
    ctx.wizard.state.announcement.authorId = telegram_id;

    const { photo } = ctx.wizard.state.announcement;

    await ctx.reply(MESSAGES.CHECK_THE_CORRECTNESS);

    await ctx.replyWithPhoto(photo, {
      ...newAnnouncementKeyboard.step6(),
      caption: announcementFormatter(ctx.wizard.state.announcement, {
        showContacts: false,
        showInfo: false,
      }),
    });

    await ctx.wizard.next();
  }

  // Заполнить заново
  @WizardStep(6)
  @Hears(MESSAGES.EDIT_AGAIN)
  async editAgain(@Ctx() ctx: Scenes.WizardContext & any) {
    await ctx.scene.reenter();
  }

  // Объявление добавлено
  @WizardStep(6)
  @Hears(MESSAGES.CONFIRM)
  async confirm(@Ctx() ctx: Scenes.WizardContext & any) {
    this.announcementsService.addAnnouncement(ctx.wizard.state.announcement);

    await ctx.reply(
      MESSAGES.ANNOUNCEMENT_ADDED(ctx.wizard.state.user.name),
      Markup.removeKeyboard(),
    );

    await ctx.scene.enter(SCENES.SELLER_CABINET);
  }

  @Hears(MESSAGES.EXIT_FROM_NEW_ANNOUNCEMENT)
  async exit(@Ctx() ctx: Scenes.WizardContext & any) {
    await ctx.reply(
      'Вы вышли из добавления объявления',
      Markup.removeKeyboard(),
    );
    await ctx.scene.enter(SCENES.SELLER_CABINET);
  }
}
