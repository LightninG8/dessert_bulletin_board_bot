import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';
import { Markup } from 'telegraf';

export const iAmConsumerKeyboards = {
  enter: () => ({
    reply_markup: {
      keyboard: [
        [
          {
            text: MESSAGES.SEND_LOCATION,
            request_location: true,
          },
        ],
      ],
      resize_keyboard: true,
    },
  }),

  leave: () => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MESSAGES.FIND_DESSERT,
            callback_data: CALLBACK_NAMES.FIND_DESSERT,
          },
        ],
      ],
      resize_keyboard: true,
    },
  }),

  removeKeyboard: () => Markup.removeKeyboard(),
};
