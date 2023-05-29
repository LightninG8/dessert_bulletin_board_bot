import { chunkArray } from 'src/common';
import { CALLBACK_NAMES, MESSAGES } from 'src/commonConstants';
import { Markup } from 'telegraf';

export const myAnnouncementsKeyboards = {
  enter: (announcemetsList) => ({
    reply_markup: {
      inline_keyboard: [
        ...chunkArray(
          announcemetsList.map((el) => ({
            text: el.title,
            callback_data: `${CALLBACK_NAMES.GET_ANNOUNCEMENT}:${el.id}`,
          })),
          2,
        ),
        [
          {
            text: MESSAGES.EXIT,
            callback_data: CALLBACK_NAMES.EXIT,
          },
        ],
      ],
    },
  }),

  announcement: (announcement) => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MESSAGES.EDIT,
            callback_data: `${CALLBACK_NAMES.EDIT_ANNOUNCEMENT}:${announcement.id}`,
          },
          {
            text: MESSAGES.DELETE,
            callback_data: `${CALLBACK_NAMES.TRY_TO_DELETE_ANNOUNCEMENT}:${announcement.id}`,
          },
        ],
        [
          {
            text: MESSAGES.BACK,
            callback_data: CALLBACK_NAMES.BACK_TO_ENTER,
          },
        ],
      ],
    },
  }),

  edit: (announcement) => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MESSAGES.NAME,
            callback_data: `${CALLBACK_NAMES.EDIT_ANNOUNCEMENT_TITLE}:${announcement.id}`,
          },
          {
            text: MESSAGES.DESCRIPTION,
            callback_data: `${CALLBACK_NAMES.EDIT_ANNOUNCEMENT_DESCRIPTION}:${announcement.id}`,
          },
        ],
        [
          {
            text: MESSAGES.PHOTO,
            callback_data: `${CALLBACK_NAMES.EDIT_ANNOUNCEMENT_PHOTO}:${announcement.id}`,
          },
          {
            text: MESSAGES.CATEGORIY,
            callback_data: `${CALLBACK_NAMES.EDIT_ANNOUNCEMENT_CATEGORY}:${announcement.id}`,
          },
        ],
        [
          {
            text: MESSAGES.PRICE,
            callback_data: `${CALLBACK_NAMES.EDIT_ANNOUNCEMENT_PRICE}:${announcement.id}`,
          },
        ],
        [
          {
            text: MESSAGES.BACK,
            callback_data: `${CALLBACK_NAMES.BACK_TO_ANNOUNCEMENT}:${announcement.id}`,
          },
        ],
      ],
    },
  }),

  tryToDelete: (announcement) => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MESSAGES.CANCEL,
            callback_data: `${CALLBACK_NAMES.BACK_TO_ANNOUNCEMENT}:${announcement.id}`,
          },
          {
            text: MESSAGES.DELETE,
            callback_data: `${CALLBACK_NAMES.DELETE_ANNOUNCEMENT}:${announcement.id}`,
          },
        ],
      ],
    },
  }),

  removeKeyboard: () => Markup.removeKeyboard(),
};
