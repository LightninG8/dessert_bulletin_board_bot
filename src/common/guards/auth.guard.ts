import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { Context } from '../../interfaces/context.interface';
import { MESSAGES } from 'src/commonConstants';
import { UsersService } from 'src/database';
import { getUserId } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = TelegrafExecutionContext.create(context).getContext<Context>();

    let user = null;

    await this.userService.getUserById(getUserId(ctx)).then((res) => {
      user = res;
    });

    if (!user) {
      throw new TelegrafException(MESSAGES.NEED_REGISTRATION);
    }

    return true;
  }
}
