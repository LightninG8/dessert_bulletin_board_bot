import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';

export const mainMenuKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: MESSAGES.FIND_DESSERT_BY_CATEGORY,
          callback_data: CALLBACK_NAMES.FIND_DESSERT_BY_CATEGORY,
        },
      ],
      [
        {
          text: MESSAGES.FIND_DESSERT_BY_TITLE,
          callback_data: CALLBACK_NAMES.FIND_DESSERT_BY_TITLE,
        },
      ],
      [
        {
          text: MESSAGES.RECOMMENDATIONS,
          callback_data: CALLBACK_NAMES.RECOMMENDATIONS,
        },
      ],
      [
        {
          text: MESSAGES.EDIT_LOCATION,
          callback_data: CALLBACK_NAMES.EDIT_LOCATION,
        },
      ],
    ],
  },
};
