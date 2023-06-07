export const announcementFormatter = ({
  title,
  description,
  price,
  category,
  city,
  location,
  contacts,
}) => {
  const address = location
    ? `${location.city}, ${location.streetName} ${location.streetNumber}`
    : city;

  return `
Название: ${title}

Описание: ${description}

Категория: ${category}

Стоимость: ${price} рублей

Адрес, где можно забрать десерт: ${address}

Контакты для связи: ${contacts}
`;
};

export const mySellerProfileFormatter = ({ name, city, about, contacts }) => {
  return `
Имя: ${name}

Город: ${city}

Описание: ${about}

Контакты: ${contacts}
`;
};
