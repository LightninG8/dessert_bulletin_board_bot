import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { Context } from '../../interfaces/context.interface';
import { MESSAGES } from 'src/commonConstants';
import { Markup } from 'telegraf';
import { GuardsService } from 'src/database';

@Injectable()
export class SellerGuard implements CanActivate {
  constructor(private guardsService: GuardsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ADMIN_IDS =
      (await this.guardsService.touchGuard('sellers'))?.guardArray || [];

    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    const isAdmin = ADMIN_IDS.includes(from.id);

    if (!isAdmin) {
      throw new TelegrafException(MESSAGES.REGISTRATION_PROHIBITED);
    }

    return true;
  }
}
