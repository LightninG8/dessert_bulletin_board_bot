import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { Context } from '../../interfaces/context.interface';
import { MESSAGES } from 'src/commonConstants';
import { Markup } from 'telegraf';

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context>();

    const id = ctx.from.id;

    if (exception.message == MESSAGES.REGISTRATION_PROHIBITED) {
      await ctx.reply(
        MESSAGES.REGISTRATION_PROHIBITED,
        Markup.inlineKeyboard([
          Markup.button.url(
            'Получить доступ',
            `https://valeryrodimova.com/bot-registration?bot_id=${id}`,
          ),
        ]),
      );

      return;
    }
    await ctx.replyWithHTML(exception.message);
  }
}
