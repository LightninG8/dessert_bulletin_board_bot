import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { Context } from '../../interfaces/context.interface';
import { ANNOUNCEMENTS_LIMIT, MESSAGES } from 'src/commonConstants';
import { UsersService } from 'src/database';
import { getUserId } from '../utils';

@Injectable()
export class AnnouncementsLimitGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = TelegrafExecutionContext.create(context).getContext<Context>();

    let user = null;

    await this.userService.getUserById(getUserId(ctx)).then((res) => {
      user = res;
    });

    if (!(user.announcements.length < ANNOUNCEMENTS_LIMIT)) {
      throw new TelegrafException(MESSAGES.ANNOUNCEMENTS_LIMIT_REACHED);
    }

    return true;
  }
}
