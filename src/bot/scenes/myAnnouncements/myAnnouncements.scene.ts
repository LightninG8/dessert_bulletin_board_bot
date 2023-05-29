import {
  Action,
  Ctx,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Update } from 'telegraf/typings/core/types/typegram';
import { CALLBACK_NAMES, SCENES, MESSAGES } from 'src/commonConstants';
import { Context } from 'vm';
import {
  TelegrafExceptionFilter,
  announcementFormatter,
  getCallbackData,
  getIdFromCbQuery,
  getUserId,
} from 'src/common';
import { UseFilters } from '@nestjs/common';
import { AnnouncementsService, UsersService } from 'src/database';
import {
  iAmSellerKeyboards,
  myAnnouncementsKeyboards,
  newAnnouncementKeyboard,
} from 'src/bot/keyboards';

@UseFilters(TelegrafExceptionFilter)
@Scene(SCENES.MY_ANNOUNCEMENTS)
export class MyAnnouncementsScene {
  constructor(
    private usersService: UsersService,
    private announcementsService: AnnouncementsService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & any) {
    const userAnnouncements = await this.usersService.getUserAnnouncements(
      getUserId(ctx),
    );

    ctx.scene.state.isEditing = false;
    ctx.scene.state.editType = null;
    ctx.scene.state.editingId = null;
    ctx.scene.state.userAnnouncements = userAnnouncements;

    if (!ctx.scene.state.userAnnouncements.length) {
      await ctx.reply(MESSAGES.NO_ANNOUNCEMENTS);

      return;
    }
    await ctx.reply(
      MESSAGES.MY_ANNOUNCEMENTS,
      myAnnouncementsKeyboards.enter(ctx.scene.state.userAnnouncements),
    );
  }

  @Action(new RegExp(`${CALLBACK_NAMES.GET_ANNOUNCEMENT}:[0-9]+`))
  async onAction(@Ctx() ctx: Context & { update: Update.CallbackQueryUpdate }) {
    ctx.answerCbQuery();

    const id = getIdFromCbQuery(getCallbackData(ctx));

    const announcement = ctx.scene.state.userAnnouncements.find(
      (el) => el.id === id,
    );

    await ctx.deleteMessage();

    await ctx.replyWithPhoto(announcement.photo, {
      ...myAnnouncementsKeyboards.announcement(announcement),
      caption: announcementFormatter(announcement),
    });
  }

  @Action(new RegExp(`${CALLBACK_NAMES.EDIT_ANNOUNCEMENT}:[0-9]+`))
  async editAnnouncement(
    @Ctx() ctx: Context & { update: Update.CallbackQueryUpdate },
  ) {
    ctx.answerCbQuery();

    const id = getIdFromCbQuery(getCallbackData(ctx));

    const announcement = ctx.scene.state.userAnnouncements.find(
      (el) => el.id === id,
    );

    await ctx.editMessageReplyMarkup(
      myAnnouncementsKeyboards.edit(announcement).reply_markup,
    );
  }

  @Action(CALLBACK_NAMES.BACK_TO_ENTER)
  async backToEnter(@Ctx() ctx: SceneContext & any) {
    ctx.answerCbQuery();
    await ctx.deleteMessage();

    await ctx.reply(
      MESSAGES.MY_ANNOUNCEMENTS,
      myAnnouncementsKeyboards.enter(ctx.scene.state.userAnnouncements),
    );
  }

  @Action(new RegExp(`${CALLBACK_NAMES.BACK_TO_ANNOUNCEMENT}:[0-9]+`))
  async backToAnnouncement(
    @Ctx() ctx: Context & { update: Update.CallbackQueryUpdate },
  ) {
    ctx.answerCbQuery();

    const id = getIdFromCbQuery(getCallbackData(ctx));

    const announcement = ctx.scene.state.userAnnouncements.find(
      (el) => el.id === id,
    );

    await ctx.deleteMessage();

    await ctx.replyWithPhoto(announcement.photo, {
      ...myAnnouncementsKeyboards.announcement(announcement),
      caption: announcementFormatter(announcement),
    });
  }

  @Action(new RegExp(`${CALLBACK_NAMES.TRY_TO_DELETE_ANNOUNCEMENT}:[0-9]+`))
  async tryToDeleteAnnouncement(
    @Ctx() ctx: Context & { update: Update.CallbackQueryUpdate },
  ) {
    ctx.answerCbQuery();

    const id = getIdFromCbQuery(getCallbackData(ctx));

    const announcement = ctx.scene.state.userAnnouncements.find(
      (el) => el.id === id,
    );

    await ctx.deleteMessage();

    await ctx.reply(
      MESSAGES.TRY_TO_DELETE_ANNOUNCEMENT,
      myAnnouncementsKeyboards.tryToDelete(announcement),
    );
  }

  @Action(new RegExp(`${CALLBACK_NAMES.DELETE_ANNOUNCEMENT}:[0-9]+`))
  async deleteAnnouncement(
    @Ctx() ctx: Context & { update: Update.CallbackQueryUpdate },
  ) {
    ctx.answerCbQuery();

    const id = getIdFromCbQuery(getCallbackData(ctx));

    await this.announcementsService.deleteAnnouncement(id);

    await ctx.reply(MESSAGES.ANNOUNCEMENT_DELETED);

    await ctx.scene.reenter();
  }

  @Action(CALLBACK_NAMES.EXIT)
  async exit(@Ctx() ctx: Context & { update: Update.CallbackQueryUpdate }) {
    ctx.answerCbQuery();

    await ctx.deleteMessage();

    await ctx.scene.leave();
  }

  @Action(new RegExp(`EDIT_ANNOUNCEMENT_[A-Z]+:[0-9]+`))
  async editAnnouncementTitle(
    @Ctx() ctx: Context & { update: Update.CallbackQueryUpdate },
  ) {
    ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup({
      reply_markup: { remove_keyboard: true },
    });

    const callback = getCallbackData(ctx);
    const id = getIdFromCbQuery(callback);

    const type = callback.split(':')[0].split('_').pop();

    ctx.scene.state.editType = type;
    ctx.scene.state.isEditing = true;
    ctx.scene.state.editingId = id;

    const editMessages = {
      TITLE: MESSAGES.INPUT_TITLE,
      DESCRIPTION: MESSAGES.INPUT_DESCRIPTION,
      CATEGORY: MESSAGES.INPUT_CATEGORIES,
      PHOTO: MESSAGES.INPUT_PHOTOS,
      PRICE: MESSAGES.INPUT_PRICE,
    };

    const keyboard =
      type == 'CATEGORY' ? newAnnouncementKeyboard.step4() : null;

    await ctx.reply(editMessages[type], keyboard);
  }

  @On('text')
  @On('photo')
  async onEdit(@Ctx() ctx: SceneContext & any) {
    if (!ctx.scene.state.isEditing) {
      return;
    }

    const type = ctx.scene.state.editType;
    const id = ctx.scene.state.editingId;

    const userAnswer =
      type == 'PHOTO'
        ? ctx.update.message.photo.pop().file_id
        : ctx.update.message.text;

    const announcemetKeys = {
      TITLE: 'title',
      DESCRIPTION: 'description',
      CATEGORY: 'category',
      PRICE: 'price',
      PHOTO: 'photo',
    };

    await this.announcementsService.changeAnnouncement(id, {
      [announcemetKeys[type]]: userAnswer,
    });

    await ctx.reply(MESSAGES.CHANGES_SAVED);

    const userAnnouncements = await this.usersService.getUserAnnouncements(
      getUserId(ctx),
    );

    ctx.scene.state.isEditing = false;
    ctx.scene.state.editType = null;
    ctx.scene.state.editingId = null;
    ctx.scene.state.userAnnouncements = userAnnouncements;

    const announcement = ctx.scene.state.userAnnouncements.find(
      (el) => el.id === id,
    );

    await ctx.replyWithPhoto(announcement.photo, {
      ...myAnnouncementsKeyboards.announcement(announcement),
      caption: announcementFormatter(announcement),
    });
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: SceneContext & any) {
    // await ctx.reply(MESSAGES.EXIT_FROM_SELLER_CABINET);

    ctx.scene.state.isEditing = false;
    ctx.scene.state.editType = null;
    ctx.scene.state.editingId = null;

    await ctx.scene.enter(SCENES.SELLER_CABINET);
  }
}
