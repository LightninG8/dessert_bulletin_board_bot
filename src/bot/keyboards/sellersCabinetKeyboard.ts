import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';
import { Markup } from 'telegraf';

export const sellersCabinetKeyboard = {
  enter: () => ({
    reply_markup: {
      keyboard: null,
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
            text: MESSAGES.ADD_ANNOUNCEMENT,
            callback_data: CALLBACK_NAMES.NEW_ANNOUNCEMENT,
          },

          {
            text: MESSAGES.EDIT_LOCATION,
            callback_data: CALLBACK_NAMES.EDIT_USER_CITY,
          },
        ],
        [
          Markup.button.url('Поддержка', `https://t.me/rodimova_otdel_zaboty`),
          {
            text: MESSAGES.EXIT,
            callback_data: CALLBACK_NAMES.EXIT,
          },
        ],
      ],
    },
  }),
};
