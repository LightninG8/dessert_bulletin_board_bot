import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'vm';

export const StateGuard = (stateCondition: object) => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const ctx = TelegrafExecutionContext.create(context);
      const { session } = ctx.getContext<Context>();

      const key = Object.keys(stateCondition)[0];
      const value = stateCondition[key];

      return session.__scenes.state[key] == value;
    }
  }

  const guard = mixin(RoleGuardMixin);
  return guard;
};
