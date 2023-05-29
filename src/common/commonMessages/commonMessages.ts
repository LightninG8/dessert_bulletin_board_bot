import { mainMenuKeyboard } from 'src/bot';
import { MESSAGES } from 'src/commonConstants';

export const replyMainMenuMessage = async (ctx) => {
  await ctx.reply(MESSAGES.MAIN_MENU, mainMenuKeyboard);
};
