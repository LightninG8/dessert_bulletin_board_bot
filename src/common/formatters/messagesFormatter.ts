export const announcementFormatter = ({
  title,
  description,
  price,
  category,
  city,
  location,
  contacts,
}) => {
  const address = location ? location.formattedAddress : city;

  return `
${title}

Описание: ${description}

Категория: ${category}

Стоимость: ${price} рублей

Адрес: ${address}

Контакты: ${contacts}
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
