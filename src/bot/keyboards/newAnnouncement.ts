import { chunkArray } from 'src/common';
import { CALLBACK_NAMES, CATEGORIES, MESSAGES } from 'src/commonConstants';
import { Markup } from 'telegraf';

export const newAnnouncementKeyboard = {
  step4: () => ({
    reply_markup: {
      keyboard: chunkArray(CATEGORIES, 2).map((arr) =>
        arr.map((el) => ({
          text: `${CATEGORIES.indexOf(el) + 1}. ${el}`,
        })),
      ),
      resize_keyboard: true,
    },
  }),

  step6: () => ({
    reply_markup: {
      keyboard: [
        [
          {
            text: MESSAGES.EDIT_AGAIN,
          },
          {
            text: MESSAGES.CONFIRM,
          },
        ],
      ],
      resize_keyboard: true,
    },
  }),

  removeKeyboard: () => Markup.removeKeyboard(),
};
