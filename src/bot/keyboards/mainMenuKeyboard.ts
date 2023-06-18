import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';

export const mainMenuKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: MESSAGES.FIND_DESSERT,
          callback_data: CALLBACK_NAMES.FIND_DESSERT,
        },
        {
          text: MESSAGES.FAVORITED_ANNOUNCEMENTS,
          callback_data: CALLBACK_NAMES.FAVORITED_ANNOUNCEMENTS,
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
