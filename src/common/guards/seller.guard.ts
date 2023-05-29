import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { Context } from '../../interfaces/context.interface';
import { MESSAGES } from 'src/commonConstants';

@Injectable()
export class SellerGuard implements CanActivate {
  private readonly ADMIN_IDS = [777795628];

  canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    const isAdmin = this.ADMIN_IDS.includes(from.id);
    // if (!isAdmin) {
    //   throw new TelegrafException(MESSAGES.REGISTRATION_PROHIBITED);
    // }

    return true;
  }
}
