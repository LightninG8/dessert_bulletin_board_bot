import { chunkArray } from 'src/common';
import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';
import { Markup } from 'telegraf';

export const myAnnouncementsKeyboards = {
  enter: (announcemetsList) => ({
    reply_markup: {
      inline_keyboard: chunkArray(
        announcemetsList.map((el) => ({
          text: el.title,
          callback_data: `${CALLBACK_NAMES.GET_ANNOUNCEMENT}:${el.id}`,
        })),
        2,
      ),
    },
  }),

  removeKeyboard: () => Markup.removeKeyboard(),
};
