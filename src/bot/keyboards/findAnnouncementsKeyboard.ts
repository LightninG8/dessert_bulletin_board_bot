import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';

export const findAnnouncementsKeyboard = {
  show: () => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MESSAGES.BACK,
            callback_data: CALLBACK_NAMES.BACK,
          },
          {
            text: MESSAGES.NEXT,
            callback_data: CALLBACK_NAMES.NEXT_ANNOUNCEMENT,
          },
        ],
        [
          {
            text: MESSAGES.SHOW_INFO,
            callback_data: CALLBACK_NAMES.SHOW_INFO,
          },
          {
            text: MESSAGES.SHOW_CONTACTS,
            callback_data: CALLBACK_NAMES.SHOW_CONTACTS,
          },
        ],
        [
          {
            text: MESSAGES.ADD_TO_FAVORITED,
            callback_data: CALLBACK_NAMES.ADD_TO_FAVORITED,
          },
          {
            text: MESSAGES.EXIT,
            callback_data: CALLBACK_NAMES.EXIT,
          },
        ],
        [
          {
            text: MESSAGES.COMPLAIN,
            callback_data: CALLBACK_NAMES.COMPLAIN_ANNOUNCEMENT,
          },
        ],
      ],
    },
  }),

  showFavourited: () => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MESSAGES.BACK,
            callback_data: CALLBACK_NAMES.BACK,
          },
          {
            text: MESSAGES.NEXT,
            callback_data: CALLBACK_NAMES.NEXT_ANNOUNCEMENT,
          },
        ],
        [
          {
            text: MESSAGES.SHOW_INFO,
            callback_data: CALLBACK_NAMES.SHOW_INFO,
          },
          {
            text: MESSAGES.SHOW_CONTACTS,
            callback_data: CALLBACK_NAMES.SHOW_CONTACTS,
          },
        ],
        [
          {
            text: MESSAGES.REMOVE_FROM_FAVORITED,
            callback_data: CALLBACK_NAMES.REMOVE_FROM_FAVORITED,
          },
          {
            text: MESSAGES.EXIT,
            callback_data: CALLBACK_NAMES.EXIT,
          },
        ],
        [
          {
            text: MESSAGES.COMPLAIN,
            callback_data: CALLBACK_NAMES.COMPLAIN_ANNOUNCEMENT,
          },
        ],
      ],
    },
  }),

  complain: () => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Мошеничество',
            callback_data: `${CALLBACK_NAMES.COMPLAIN}:0`,
          },
          {
            text: 'Контакты недоступны',
            callback_data: `${CALLBACK_NAMES.COMPLAIN}:1`,
          },
        ],
        [
          {
            text: 'Чужие работы/фото',
            callback_data: `${CALLBACK_NAMES.COMPLAIN}:2`,
          },
          {
            text: 'Другое',
            callback_data: `${CALLBACK_NAMES.COMPLAIN}:3`,
          },
        ],
        [
          {
            text: MESSAGES.BACK,
            callback_data: CALLBACK_NAMES.BACK_FROM_COMPLAIN,
          },
        ],
      ],
    },
  }),
};
