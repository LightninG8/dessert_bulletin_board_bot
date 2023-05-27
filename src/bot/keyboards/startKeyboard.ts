import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';

export const startKeyboards = {
  start: () => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MESSAGES.I_AM_CONSUMER,
            callback_data: CALLBACK_NAMES.I_AM_CONSUMER,
          },
        ],
        [
          {
            text: MESSAGES.I_AM_SELLER,
            callback_data: CALLBACK_NAMES.I_AM_SELLER,
          },
        ],
      ],
    },
  }),
};
