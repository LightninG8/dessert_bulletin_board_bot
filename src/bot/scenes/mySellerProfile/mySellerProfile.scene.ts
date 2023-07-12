import {
  Action,
  Command,
  Ctx,
  InjectBot,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import {
  CALLBACK_NAMES,
  SCENES,
  MESSAGES,
  BOT_NAME,
} from 'src/commonConstants';
import {
  AuthGuard,
  SellerGuard,
  TelegrafExceptionFilter,
  deleteMessage,
  getCallbackData,
  getIdFromCbQuery,
  getUserId,
  getUserName,
  mySellerProfileFormatter,
  replyMainMenuMessage,
} from 'src/common';
import { UseFilters, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/database';
import { iAmSellerKeyboards, mySellerProfileKeyboard } from 'src/bot/keyboards';
import { GeocoderService } from 'src/geocoder';
import { Context, Telegraf } from 'telegraf';

@UseFilters(TelegrafExceptionFilter)
@Scene(SCENES.MY_SELLER_PROFILE)
export class MySellerProfileScene {
  constructor(
    private usersService: UsersService,
    private geocoderService: GeocoderService,
    @InjectBot(BOT_NAME) private bot: Telegraf<Context>,
  ) {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & any) {
    const user = await this.usersService.getUserById(getUserId(ctx));

    ctx.scene.state.user = user;
    ctx.scene.state.isEditing = false;
    ctx.scene.state.editType = null;

    if (user.photo) {
      await ctx.replyWithPhoto(user.photo, {
        ...mySellerProfileKeyboard.enter(user),
        caption: mySellerProfileFormatter(user),
      });
    } else {
      await ctx.reply(
        mySellerProfileFormatter(user),
        mySellerProfileKeyboard.enter(user),
      );
    }
  }

  @Action(CALLBACK_NAMES.BACK_TO_SELLER_CABINET)
  async onBackToSellerCabinet(@Ctx() ctx: SceneContext & any) {
    await ctx.answerCbQuery();

    await deleteMessage(ctx);

    ctx.scene.enter(SCENES.SELLER_CABINET);
  }

  @Action(CALLBACK_NAMES.BACK_TO_MY_SELLER_PROFILE)
  async onBackToMySellerProfile(@Ctx() ctx: SceneContext & any) {
    await ctx.answerCbQuery();

    await ctx.editMessageReplyMarkup(
      mySellerProfileKeyboard.enter(ctx.scene.state.user).reply_markup,
    );
  }

  @Action(CALLBACK_NAMES.EDIT_USER)
  async onEditUser(@Ctx() ctx: SceneContext & any) {
    await ctx.answerCbQuery();

    await ctx.editMessageReplyMarkup(
      mySellerProfileKeyboard.edit(ctx.scene.state.user).reply_markup,
    );
  }

  @Action(new RegExp(`EDIT_USER_[A-Z]+`))
  async editUser(@Ctx() ctx: SceneContext & any) {
    await ctx.answerCbQuery();

    await ctx.editMessageReplyMarkup({
      reply_markup: { remove_keyboard: true },
    });

    const callback = getCallbackData(ctx);

    const type = callback.split('_').pop();

    ctx.scene.state.editType = type;
    ctx.scene.state.isEditing = true;

    const editMessages = {
      CITY: MESSAGES.EDIT_PROFILE_1,
      PHOTO: MESSAGES.EDIT_PROFILE_2,
      NAME: MESSAGES.EDIT_PROFILE_3,
      ABOUT: MESSAGES.EDIT_PROFILE_4,
      CONTACTS: MESSAGES.EDIT_PROFILE_5,
    };

    const editKeyboards = {
      CITY: iAmSellerKeyboards.step1(),
      PHOTO: iAmSellerKeyboards.step2(),
      NAME: iAmSellerKeyboards.step3(),
    };

    const keyboard = editKeyboards[type] || null;

    await ctx.reply(editMessages[type], keyboard);
  }

  @On('text')
  @On('photo')
  @On('location')
  async onEdit(@Ctx() ctx: SceneContext & any) {
    if (!ctx.scene.state.isEditing) {
      return;
    }

    if (
      ctx.update.message.text.length > 100 &&
      ctx.scene.state.editType == 'NAME'
    ) {
      await ctx.reply(MESSAGES.EDIT_LENGTH_ERROR(100));

      return;
    }

    if (
      ctx.update.message.text.length > 300 &&
      ctx.scene.state.editType == 'ABOUT'
    ) {
      await ctx.reply(MESSAGES.EDIT_LENGTH_ERROR(300));

      return;
    }

    const type = ctx.scene.state.editType;

    let userAnswer = null;
    let userLocation = null;

    switch (type) {
      case 'PHOTO':
        if (ctx.update.message.text == MESSAGES.TAKE_FROM_PROFILE) {
          const user = await ctx.telegram.getUserProfilePhotos(ctx.from.id, 0);
          const photo = user.photos[0][0]?.file_id;

          userAnswer = photo;
        } else {
          userAnswer = ctx.update.message.photo.pop().file_id;
        }
        break;
      case 'NAME':
        if (ctx.update.message.text == MESSAGES.TAKE_FROM_PROFILE) {
          userAnswer = getUserName(ctx);
        } else {
          userAnswer = ctx.update.message.text;
        }
        break;
      case 'CITY':
        if (ctx.update.message.location) {
          const location = await this.geocoderService
            .reverse(ctx.update.message.location)
            .then((res) => {
              return res[0];
            });

          userAnswer = location.city;
          userLocation = location;
        } else {
          userAnswer = ctx.update.message.text;
        }
        break;
      default:
        userAnswer = ctx.update.message.text;

        break;
    }

    const userKeys = {
      CITY: 'city',
      PHOTO: 'photo',
      NAME: 'name',
      ABOUT: 'about',
      CONTACTS: 'contacts',
    };

    await this.usersService.changeUser(getUserId(ctx), {
      [userKeys[type]]: userAnswer,
    });

    if (userLocation) {
      await this.usersService.changeUser(getUserId(ctx), {
        location: userLocation,
      });
    }

    await ctx.reply(
      MESSAGES.CHANGES_SAVED,
      mySellerProfileKeyboard.removeKeyboard(),
    );

    const user = await this.usersService.getUserById(getUserId(ctx));

    ctx.scene.state.user = user;
    ctx.scene.state.isEditing = false;
    ctx.scene.state.editType = null;

    if (user.photo) {
      await ctx.replyWithPhoto(user.photo, {
        ...mySellerProfileKeyboard.enter(user),
        caption: mySellerProfileFormatter(user),
      });
    } else {
      await ctx.reply(
        mySellerProfileFormatter(user),
        mySellerProfileKeyboard.enter(user),
      );
    }
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: SceneContext & any) {
    ctx.scene.state.isEditing = false;
    ctx.scene.state.editType = null;
    ctx.scene.state.editingId = null;
  }

  @Command('main_menu')
  async onMainMenu(@Ctx() ctx: SceneContext & any) {
    // const { chatId, messageId } = ctx.scene.state;

    // await this.bot.telegram.deleteMessage(chatId, messageId);
    await replyMainMenuMessage(ctx);

    await ctx.scene.leave();
  }

  @UseGuards(SellerGuard)
  @UseGuards(AuthGuard)
  @Command('seller_cabinet')
  async sellersCabinet(@Ctx() ctx: Context & any) {
    const { chatId, messageId } = ctx.scene.state;

    await this.bot.telegram.deleteMessage(chatId, messageId);

    await ctx.scene.enter(SCENES.SELLER_CABINET);
  }
}
