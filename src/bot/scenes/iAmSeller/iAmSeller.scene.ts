import { Context, Wizard, WizardStep } from 'nestjs-telegraf';
import { SCENES, MESSAGES } from 'src/commonConstants';
import { TelegrafExceptionFilter } from 'src/common';
import { UseFilters } from '@nestjs/common';
import { GeocoderService } from 'src/geocoder';
import { Scenes } from 'telegraf';

@UseFilters(TelegrafExceptionFilter)
@Wizard(SCENES.I_AM_SELLER_SCENE)
export class IAmSellerScene {
  constructor(private geocoderService: GeocoderService) {}

  @WizardStep(1)
  step1(@Context() ctx: Scenes.WizardContext) {
    ctx.reply(MESSAGES.REGISTRATION_1);

    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Context() ctx: Scenes.WizardContext) {
    ctx.reply(MESSAGES.REGISTRATION_2);

    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(@Context() ctx: Scenes.WizardContext) {
    ctx.reply(MESSAGES.REGISTRATION_3);

    ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(@Context() ctx: Scenes.WizardContext) {
    ctx.reply(MESSAGES.REGISTRATION_4);

    ctx.wizard.next();
  }

  @WizardStep(5)
  async step5(@Context() ctx: Scenes.WizardContext) {
    ctx.reply(MESSAGES.REGISTRATION_5);

    ctx.scene.leave();
  }

  // @On('location')
  // async onLocation(@Ctx() ctx: Context<any>) {
  //   await ctx.reply(JSON.stringify(ctx.update.message.location));

  //   this.geocoderService.reverse(ctx.update.message.location).then((res) => {
  //     ctx.reply(JSON.stringify(res[0].city).toString());
  //   });
  // }

  // @On('text')
  // async onText(@Ctx() ctx: Context<any>) {
  //   const prompt = ctx.update.message.text;

  //   const result = this.geocoderService.geocode(prompt);

  //   console.log(result);

  //   await ctx.reply(result.toString());
  // }
}
