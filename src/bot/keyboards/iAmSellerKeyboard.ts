import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';
import { Markup } from 'telegraf';

export const iAmSellerKeyboards = {
  step1: () => ({
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

  step2: () => ({
    reply_markup: {
      keyboard: [
        [
          {
            text: MESSAGES.TAKE_FROM_PROFILE,
          },
        ],
      ],
      resize_keyboard: true,
    },
  }),

  step3: () => ({
    reply_markup: {
      keyboard: [
        [
          {
            text: MESSAGES.TAKE_FROM_PROFILE,
            // callback_data: CALLBACK_NAMES.REGISTRATION_EDIT_NAME,
          },
        ],
      ],
      resize_keyboard: true,
    },
  }),

  step6: () => ({
    reply_markup: {
      keyboard: [
        [
          {
            text: MESSAGES.EDIT_AGAIN,
            callback_data: CALLBACK_NAMES.REGISTRATION_EDIT_ALL,
          },
          {
            text: MESSAGES.CONFIRM,
            // callback_data: CALLBACK_NAMES.REGISTRATION_DONE,
          },
        ],
      ],
      resize_keyboard: true,
    },
  }),

  step7: () => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MESSAGES.ADD_ANNOUNCEMENT,
            callback_data: CALLBACK_NAMES.NEW_ANNOUNCEMENT,
          },
        ],
      ],
    },
  }),

  removeKeyboard: () => Markup.removeKeyboard(),
};
