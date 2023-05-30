import {
  Context as Ctx,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { iAmConsumerKeyboards, mainMenuKeyboard } from 'src/bot/keyboards';
import { getUserId, replyMainMenuMessage } from 'src/common';
import { MESSAGES, SCENES } from 'src/commonConstants';
import { UsersService } from 'src/database';
import { GeocoderService } from 'src/geocoder';
import { Scenes } from 'telegraf';

@Scene(SCENES.I_AM_CONSUMER_SCENE)
export class IAmConsumerScene {
  constructor(
    private geocoderService: GeocoderService,
    private usersService: UsersService,
  ) {}
  @SceneEnter()
  async onEnter(@Ctx() ctx: Scenes.SceneContext & any) {
    const user = await this.usersService.getUserById(getUserId(ctx));
    const { first_name, last_name } = ctx.from;

    ctx.scene.state.inputType = 'location';
    ctx.scene.state.user = {
      telegram_id: getUserId(ctx),
      type: user?.type || 'consumer',
      name: user?.name || `${first_name} ${last_name}`,
    };

    ctx.reply(MESSAGES.REGISTRARION_CONSUMER, iAmConsumerKeyboards.enter());
  }

  // Фото
  @On('location')
  // Shitcode. Хз какой интерфейс под сообщение с локацией
  async step2Location(@Ctx() ctx: Scenes.WizardContext & any) {
    if (!(ctx.scene.state.inputType === 'location')) {
      return;
    }

    // Обратное геодекодирование
    const location = await this.geocoderService
      .reverse(ctx.update.message.location)
      .then((res) => {
        return res[0];
      });

    if (!location.city) {
      ctx.reply('Не получилось определить геолокацию. Напишите текстом');

      ctx.scene.state.user.location = null;
    } else {
      ctx.scene.state.user.city = location.city;
      ctx.scene.state.user.location = location;

      await ctx.scene.leave();
    }
  }

  // Фото
  @On('text')
  // Shitcode. Хз какой интерфейс под сообщение с локацией
  async step2Text(@Ctx() ctx: Scenes.WizardContext & any) {
    if (!(ctx.scene.state.inputType === 'location')) {
      return;
    }

    const text = String(ctx.update.message.text).toLowerCase();

    ctx.scene.state.user.city = text.charAt(0).toUpperCase() + text.slice(1);
    ctx.scene.state.user.location = null;

    await ctx.scene.leave();
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Scenes.WizardContext & any) {
    await ctx.reply(
      `${MESSAGES.CHANGES_SAVED}. Ваш город - ${ctx.scene.state.user.city}`,
      iAmConsumerKeyboards.removeKeyboard(),
    );

    replyMainMenuMessage(ctx);

    await this.usersService.registration(ctx.scene.state.user);
  }
}
