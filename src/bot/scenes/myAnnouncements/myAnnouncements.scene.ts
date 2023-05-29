import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Update } from 'telegraf/typings/core/types/typegram';
import { CALLBACK_NAMES, SCENES, MESSAGES } from 'src/commonConstants';
import { Context } from 'vm';
import { TelegrafExceptionFilter, getUserId } from 'src/common';
import { UseFilters } from '@nestjs/common';
import { UsersService } from 'src/database';
import { myAnnouncementsKeyboards } from 'src/bot/keyboards';

@UseFilters(TelegrafExceptionFilter)
@Scene(SCENES.MY_ANNOUNCEMENTS)
export class MyAnnouncementsScene {
  constructor(private usersService: UsersService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & any) {
    const userAnnouncements = await this.usersService.getUserAnnouncements(
      getUserId(ctx),
    );

    ctx.scene.state.userAnnouncements = userAnnouncements;

    await ctx.reply(
      MESSAGES.MY_ANNOUNCEMENTS,
      myAnnouncementsKeyboards.enter(ctx.scene.state.userAnnouncements),
    );
    // await ctx.reply(JSON.stringify(ctx.scene.state.userAnnouncements));

    await ctx.scene.leave();
  }

  @Action(CALLBACK_NAMES.I_AM_CONSUMER)
  async onIAmConsumer(
    @Ctx() ctx: Context & { update: Update.CallbackQueryUpdate },
  ) {
    // await ctx.scene.leave();
    await ctx.scene.enter(SCENES.I_AM_CONSUMER_SCENE);
  }
}
