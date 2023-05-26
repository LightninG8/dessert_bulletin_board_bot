import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';

export const iAmSellerKeyboards = {
  step2: () => ({
    inline_keyboard: [
      [
        {
          text: MESSAGES.TAKE_FROM_PROFILE,
          callback_data: CALLBACK_NAMES.REGISTRATION_EDIT_PHOTO,
        },
      ],
    ],
  }),

  step3: () => ({
    inline_keyboard: [
      [
        {
          text: MESSAGES.TAKE_FROM_PROFILE,
          callback_data: CALLBACK_NAMES.REGISTRATION_EDIT_NAME,
        },
      ],
    ],
  }),

  step6: () => ({
    inline_keyboard: [
      [
        {
          text: MESSAGES.EDIT_AGAIN,
          callback_data: CALLBACK_NAMES.REGISTRATION_EDIT_ALL,
        },
        {
          text: MESSAGES.CONFIRM,
          callback_data: CALLBACK_NAMES.REGISTRATION_DONE,
        },
      ],
    ],
  }),

  step7: () => ({
    inline_keyboard: [
      [
        {
          text: MESSAGES.ADD_ANNOUNCEMENT,
          callback_data: CALLBACK_NAMES.NEW_ANNOUNCEMENT,
        },
      ],
    ],
  }),
};
