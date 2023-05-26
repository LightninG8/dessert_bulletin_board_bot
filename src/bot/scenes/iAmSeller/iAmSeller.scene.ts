import {
  Action,
  Context as Ctx,
  On,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf';
import { SCENES, MESSAGES, CALLBACK_NAMES } from 'src/commonConstants';
import { TelegrafExceptionFilter, tabsFormatter } from 'src/common';
import { UseFilters } from '@nestjs/common';
import { GeocoderService } from 'src/geocoder';
import { Scenes } from 'telegraf';
import { iAmSellerKeyboards } from 'src/bot/keyboards';

@UseFilters(TelegrafExceptionFilter)
@Wizard(SCENES.I_AM_SELLER_SCENE)
export class IAmSellerScene {
  constructor(private geocoderService: GeocoderService) {}

  @WizardStep(1)
  step1(@Ctx() ctx: Scenes.WizardContext) {
    ctx.reply(MESSAGES.REGISTRATION_1);

    ctx.wizard.next();
  }

  @WizardStep(2)
  @On('location')
  // Shitcode. Хз какой интерфейс под сообщение с локацией
  async step2Location(@Ctx() ctx: Scenes.WizardContext & any) {
    // Обратное геодекодирование
    const city = await this.geocoderService
      .reverse(ctx.update.message.location)
      .then((res) => {
        return res[0].city;
      });

    if (city == null) {
      ctx.reply('Не получилось определить геолокацию. Напишите текстом');
    } else {
      ctx.wizard.state.city = city;

      await ctx.reply(MESSAGES.REGISTRATION_2, {
        reply_markup: iAmSellerKeyboards.step2(),
      });

      ctx.wizard.next();
    }
  }

  @WizardStep(2)
  @On('text')
  // Shitcode. Хз какой интерфейс под сообщение с локацией
  async step2Text(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.city = ctx.update.message.text;

    await ctx.reply(MESSAGES.REGISTRATION_2, {
      reply_markup: iAmSellerKeyboards.step2(),
    });

    ctx.wizard.next();
  }

  @WizardStep(3)
  @On('photo')
  async step3(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.photo = ctx.update.message.photo.pop().file_id;

    console.log();
    await ctx.reply(MESSAGES.REGISTRATION_3, {
      reply_markup: iAmSellerKeyboards.step3(),
    });

    ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(@Ctx() ctx: Scenes.WizardContext & any) {
    console.log(ctx.update.message.from);

    ctx.wizard.state.name = ctx.update.message.text;

    await ctx.reply(MESSAGES.REGISTRATION_4);

    ctx.wizard.next();
  }

  @WizardStep(5)
  async step5(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.about = ctx.update.message.text;

    await ctx.reply(MESSAGES.REGISTRATION_5);

    ctx.wizard.next();
  }

  @WizardStep(6)
  async step6(@Ctx() ctx: Scenes.WizardContext & any) {
    ctx.wizard.state.contacts = ctx.update.message.text;

    const { name, photo, city, about, contacts } = ctx.wizard.state;

    await ctx.replyWithPhoto(photo, {
      reply_markup: iAmSellerKeyboards.step6(),
      caption: tabsFormatter(
        `
${MESSAGES.REGISTRATION_6}

Имя: ${name}
Город: ${city}
Описание: ${about}
Контакты: ${contacts}
        `,
      ),
    });
  }

  @Action(CALLBACK_NAMES.REGISTRATION_DONE)
  async step7(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.reply(MESSAGES.REGISTRATION_7, {
      reply_markup: iAmSellerKeyboards.step7(),
    });

    console.log(ctx.session);
    ctx.scene.leave();
  }

  @Action(CALLBACK_NAMES.REGISTRATION_EDIT_ALL)
  async editAgain(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.scene.reenter();
  }

  @Action(CALLBACK_NAMES.REGISTRATION_EDIT_NAME)
  async editName(@Ctx() ctx: Scenes.WizardContext & any) {
    console.log('hello');
    ctx.wizard.state.name = 'from_aaaaa';

    await ctx.wizard.next();
  }
}
