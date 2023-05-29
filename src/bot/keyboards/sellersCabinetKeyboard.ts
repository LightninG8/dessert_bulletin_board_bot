import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';

export const sellersCabinetKeyboard = {
  enter: () => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MESSAGES.MY_SELLER_PROFILE,
            callback_data: CALLBACK_NAMES.MY_SELLER_PROFILE,
          },
          {
            text: MESSAGES.MY_ANNOUNCEMENTS_BUTTON,
            callback_data: CALLBACK_NAMES.MY_ANNOUNCEMENTS,
          },
        ],
        [
          {
            text: MESSAGES.EXIT,
            callback_data: CALLBACK_NAMES.EXIT,
          },
        ],
      ],
    },
  }),
};
