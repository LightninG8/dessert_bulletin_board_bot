import { Context as Ctx, Hears, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { SCENES, MESSAGES } from 'src/commonConstants';
import {
  TelegrafExceptionFilter,
  getUserId,
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

  // Отправьте геолокацию
  @WizardStep(1)
  step1(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.user = {};

    ctx.wizard.state.user.telegram_id = getUserId(ctx);
    ctx.wizard.state.user.type = 'seller';

    ctx.reply(MESSAGES.REGISTRATION_1, iAmSellerKeyboards.step1());

    ctx.wizard.next();
  }

  // Фото
  @WizardStep(2)
  @On('location')
  // Shitcode. Хз какой интерфейс под сообщение с локацией
  async step2Location(@Ctx() ctx: Scenes.WizardContext & any) {
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

      await ctx.reply(MESSAGES.REGISTRATION_2, iAmSellerKeyboards.step2());

      ctx.wizard.next();
    }
  }

  // Фото
  @WizardStep(2)
  @On('text')
  // Shitcode. Хз какой интерфейс под сообщение с локацией
  async step2Text(@Ctx() ctx: Scenes.WizardContext & any) {
    const text = String(ctx.update.message.text).toLowerCase();

    ctx.wizard.state.user.city = text.charAt(0).toUpperCase() + text.slice(1);
    ctx.wizard.state.user.location = null;

    await ctx.reply(MESSAGES.REGISTRATION_2, iAmSellerKeyboards.step2());

    ctx.wizard.next();
  }

  // Имя
  @WizardStep(3)
  @On('photo')
  async step3(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.user.photo =
      ctx.update.message.photo.pop().file_id || null;

    await ctx.reply(MESSAGES.REGISTRATION_3, iAmSellerKeyboards.step3());

    ctx.wizard.next();
  }

  @WizardStep(3)
  @Hears(MESSAGES.TAKE_FROM_PROFILE)
  async takePhotoFromProfile(@Ctx() ctx: Scenes.WizardContext & any) {
    const user = await ctx.telegram.getUserProfilePhotos(ctx.from.id, 0);
    const photo = user.photos[0][0]?.file_id;

    ctx.wizard.state.user.photo = photo || null;

    await ctx.reply(MESSAGES.REGISTRATION_3, iAmSellerKeyboards.step3());

    ctx.wizard.next();
  }

  // Описание
  @WizardStep(4)
  @On('text')
  @Hears(MESSAGES.TAKE_FROM_PROFILE)
  async takeNameFromProdile(@Ctx() ctx: Scenes.WizardContext & any) {
    const { first_name, last_name } = ctx.update.message.from;

    ctx.wizard.state.user.name = `${first_name} ${last_name}`;

    await ctx.reply(MESSAGES.REGISTRATION_4, Markup.removeKeyboard());

    ctx.wizard.next();
  }

  @WizardStep(4)
  @On('text')
  async step4(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.user.name = ctx.update.message.text;

    await ctx.reply(MESSAGES.REGISTRATION_4, Markup.removeKeyboard());

    ctx.wizard.next();
  }

  // Контакты
  @WizardStep(5)
  @On('text')
  async step5(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.user.about = ctx.update.message.text;

    await ctx.reply(MESSAGES.REGISTRATION_5, Markup.removeKeyboard());

    ctx.wizard.next();
  }

  // Подтверждение
  @WizardStep(6)
  @On('text')
  async step6(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.user.contacts = ctx.update.message.text;

    const { photo } = ctx.wizard.state.user;

    await ctx.reply(MESSAGES.REGISTRATION_6);
    await ctx.replyWithPhoto(photo, {
      ...iAmSellerKeyboards.step6(),
      caption: mySellerProfileFormatter(ctx.wizard.state.user),
    });

    ctx.wizard.next();
  }

  // Регистрация закончена
  @WizardStep(7)
  @Hears(MESSAGES.CONFIRM)
  async step7(@Ctx() ctx: Scenes.WizardContext & any) {
    await ctx.reply(MESSAGES.REGISTRATION_7, Markup.removeKeyboard());

    this.usersService.registration(ctx.wizard.state.user);

    await ctx.reply(MESSAGES.REGISTRATION_8, iAmSellerKeyboards.step7());

    await ctx.scene.leave();
  }

  // Заполнить снова
  @WizardStep(7)
  @Hears(MESSAGES.EDIT_AGAIN)
  async editAgain(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.scene.reenter();
  }
}
