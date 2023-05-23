import { Hears, InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { AppService } from './app.service';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    this.logger.info('hello!');

    await ctx.reply('Hello!');
  }
}
