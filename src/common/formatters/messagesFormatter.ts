export const announcementFormatter = ({
  title,
  description,
  price,
  category,
}) => {
  return `
${title}

Описание: ${description}

Категория: ${category}

Стоимость: ${price} рублей
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
