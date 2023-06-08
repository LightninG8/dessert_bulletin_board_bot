import {
  Command,
  Context as Ctx,
  Hears,
  On,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf';
import { SCENES, MESSAGES } from 'src/commonConstants';
import {
  TelegrafExceptionFilter,
  getUserId,
  getUserName,
  mySellerProfileFormatter,
} from 'src/common';
import { UseFilters } from '@nestjs/common';
import { GeocoderService } from 'src/geocoder';
import { Markup, Scenes } from 'telegraf';
import { iAmSellerKeyboards } from 'src/bot/keyboards';
import { UsersService } from 'src/database';

@UseFilters(TelegrafExceptionFilter)
@Wizard(SCENES.I_AM_SELLER_SCENE)
export class IAmSellerScene {
  constructor(
    private geocoderService: GeocoderService,
    private usersService: UsersService,
  ) {}

  @Command('start')
  @Command('main_menu')
  @Command('seller_cabinet')
  onMainMenu(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.reply('Сначала завершите регистрацию');
  }

  // Имя
  @WizardStep(1)
  step1(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.user = {};

    ctx.wizard.state.user.telegram_id = getUserId(ctx);
    ctx.wizard.state.user.type = 'seller';

    ctx.reply(MESSAGES.REGISTRATION_3, iAmSellerKeyboards.step3());

    ctx.wizard.next();
  }

  // Город
  @WizardStep(2)
  @Hears(MESSAGES.TAKE_FROM_PROFILE)
  async takeNameFromProfile(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.user.name = getUserName(ctx);

    await ctx.reply(
      MESSAGES.REGISTRATION_1(ctx.wizard.state.user.name),
      iAmSellerKeyboards.step1(),
    );

    ctx.wizard.next();
  }

  @WizardStep(2)
  @On('text')
  async step2(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.user.name = ctx.update.message.text;

    await ctx.reply(
      MESSAGES.REGISTRATION_1(ctx.wizard.state.user.name),
      iAmSellerKeyboards.step1(),
    );

    ctx.wizard.next();
  }

  // О себе
  @WizardStep(3)
  @On('location')
  // Shitcode. Хз какой интерфейс под сообщение с локацией
  async step3Location(@Ctx() ctx: Scenes.WizardContext & any) {
    // Обратное геодекодирование
    const location = await this.geocoderService
      .reverse(ctx.update.message.location)
      .then((res) => {
        return res[0];
      });

    if (!location.city) {
      ctx.reply('Не получилось определить геолокацию. Напишите текстом');

      ctx.wizard.state.user.location = null;
    } else {
      ctx.wizard.state.user.city = location.city;
      ctx.wizard.state.user.location = location;

      await ctx.reply(
        MESSAGES.REGISTRATION_4(ctx.wizard.state.user.name),
        Markup.removeKeyboard(),
      );

      ctx.wizard.next();
    }
  }

  @WizardStep(3)
  @On('text')
  // Shitcode. Хз какой интерфейс под сообщение с локацией
  async step3Text(@Ctx() ctx: Scenes.WizardContext & any) {
    const text = String(ctx.update.message.text).toLowerCase();

    ctx.wizard.state.user.city = text.charAt(0).toUpperCase() + text.slice(1);
    ctx.wizard.state.user.location = null;

    await ctx.reply(
      MESSAGES.REGISTRATION_4(ctx.wizard.state.user.name),
      Markup.removeKeyboard(),
    );

    ctx.wizard.next();
  }

  // Контакты
  @WizardStep(4)
  @On('text')
  async step4(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.user.about = ctx.update.message.text;

    await ctx.reply(
      MESSAGES.REGISTRATION_5(ctx.wizard.state.user.name),
      Markup.removeKeyboard(),
    );

    ctx.wizard.next();
  }

  // Подтверждение
  @WizardStep(5)
  @On('text')
  async step5(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.user.contacts = ctx.update.message.text;

    await ctx.reply(MESSAGES.REGISTRATION_6);
    await ctx.reply(
      mySellerProfileFormatter(ctx.wizard.state.user),
      iAmSellerKeyboards.step6(),
    );

    ctx.wizard.next();
  }

  // Регистрация закончена
  @WizardStep(6)
  @Hears(MESSAGES.CONFIRM)
  async step6(@Ctx() ctx: Scenes.WizardContext & any) {
    // await ctx.reply(MESSAGES.REGISTRATION_7, Markup.removeKeyboard());

    await this.usersService.registration(ctx.wizard.state.user);

    await ctx.scene.enter(SCENES.NEW_ANNOUNCEMENT);
  }

  // Заполнить снова
  @WizardStep(6)
  @Hears(MESSAGES.EDIT_AGAIN)
  async editAgain(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.scene.reenter();
  }
}
