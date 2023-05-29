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
