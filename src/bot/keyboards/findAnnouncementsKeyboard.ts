import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';

export const findAnnouncementsKeyboard = {
  show: () => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MESSAGES.NEXT,
            callback_data: CALLBACK_NAMES.NEXT_ANNOUNCEMENT,
          },
          {
            text: MESSAGES.EXIT,
            callback_data: CALLBACK_NAMES.EXIT,
          },
        ],
      ],
    },
  }),
};
