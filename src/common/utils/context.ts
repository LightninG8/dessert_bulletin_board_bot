import { Update } from 'telegraf/typings/core/types/typegram';
import { Context } from 'vm';

export const getUserId = (ctx: Context): number => {
  if ('callback_query' in ctx.update) {
    return ctx.update.callback_query.from.id;
  }

  if ('message' in ctx.update) {
    return ctx.update.message.from.id;
  }

  if ('my_chat_member' in ctx.update) {
    return ctx.update.my_chat_member.from.id;
  }

  return -1;
};

export const getUserName = (ctx: Context) => {
  const { first_name, last_name } = ctx.from;

  return `${first_name || ''} ${last_name || ''}`.trim();
};

export const getCallbackData = (
  ctx: Context & { update: Update.CallbackQueryUpdate },
): string => {
  const cbQuery = ctx.update.callback_query;
  const userAnswer = 'data' in cbQuery ? cbQuery.data : null;

  return userAnswer;
};
