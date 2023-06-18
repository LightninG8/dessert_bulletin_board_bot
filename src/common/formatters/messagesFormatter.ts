export const announcementFormatter = (
  { title, description, price, about, city, location, contacts },
  { showInfo, showContacts },
) => {
  const address = location
    ? `${location.city}, ${location.streetName} ${location.streetNumber}`
    : city;

  return `
Название: ${title}

Описание: ${description}

Стоимость: ${price} рублей

Адрес, где можно забрать десерт: ${address}
${
  showInfo
    ? `
О кондитере: ${about || ''}`
    : ''
}
${
  showContacts
    ? `
Контакты для связи: ${contacts}`
    : ''
}

`;
};

export const complainAnnouncementFormatter = (
  { id, title, description, price, about, city, location, contacts },
  { type, author },
) => {
  const address = location
    ? `${location.city}, ${location.streetName} ${location.streetNumber}`
    : city;

  return `
Новая жалоба (${type}):

id объявления: ${id}
id автора: ${author.telegram_id}
Имя кондитера: ${author.name}

Название: ${title}

Описание: ${description}

Стоимость: ${price} рублей

Адрес, где можно забрать десерт: ${address}

О кондитере: ${about || ''}

Контакты для связи: ${contacts}
`;
};

export const mySellerProfileFormatter = ({ name, city, about }) => {
  return `
Имя: ${name}

Город: ${city}

Описание: ${about}
`;
};
