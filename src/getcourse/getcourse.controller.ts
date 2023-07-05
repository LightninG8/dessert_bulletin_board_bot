import { Controller, Post, Query } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { BOT_NAME, CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';
import { GuardsService } from 'src/database';
import { Context, Telegraf } from 'telegraf';

@Controller('getcourse')
export class GetcourseController {
  constructor(
    private guardsService: GuardsService,
    @InjectBot(BOT_NAME) private bot: Telegraf<Context>,
  ) {}

  @Post('/add')
  async addUserIdToSellerGuard(@Query() params: any): Promise<boolean> {
    await this.guardsService.addValueToGuardArray('sellers', +params.id);

    await this.bot.telegram.sendMessage(+params.id, MESSAGES.GUARD_ACCEPTED, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Зарегистрироваться',
              callback_data: CALLBACK_NAMES.START_REGISTRATION,
            },
          ],
        ],
      },
    });

    return true;
  }

  @Post('/remove')
  async removeUserIdFromSellerGuard(@Query() params: any): Promise<boolean> {
    await this.guardsService.removeValueFromGuardArray('sellers', +params.id);

    return true;
  }
}
