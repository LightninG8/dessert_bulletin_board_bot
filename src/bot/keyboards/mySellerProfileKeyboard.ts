import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';
import { Markup } from 'telegraf';

export const mySellerProfileKeyboard = {
  enter: (user) => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MESSAGES.EDIT,
            callback_data: CALLBACK_NAMES.EDIT_USER,
          },
        ],
        [
          {
            text: MESSAGES.BACK,
            callback_data: CALLBACK_NAMES.BACK_TO_SELLER_CABINET,
          },
        ],
      ],
    },
  }),

  edit: (user) => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MESSAGES.NAME,
            callback_data: CALLBACK_NAMES.EDIT_USER_NAME,
          },
          {
            text: MESSAGES.PHOTO,
            callback_data: CALLBACK_NAMES.EDIT_USER_PHOTO,
          },
        ],
        [
          {
            text: MESSAGES.ABOUT,
            callback_data: CALLBACK_NAMES.EDIT_USER_ABOUT,
          },
          {
            text: MESSAGES.CONTACTS,
            callback_data: CALLBACK_NAMES.EDIT_USER_CONTACTS,
          },
        ],
        [
          {
            text: MESSAGES.CITY,
            callback_data: CALLBACK_NAMES.EDIT_USER_CITY,
          },
        ],
        [
          {
            text: MESSAGES.BACK,
            callback_data: CALLBACK_NAMES.BACK_TO_MY_SELLER_PROFILE,
          },
        ],
      ],
    },
  }),

  removeKeyboard: () => Markup.removeKeyboard(),
};
