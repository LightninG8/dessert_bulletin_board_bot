export const inputCityFormatter = (city: string) => {
  return city
    .split(' ')
    .map((el) => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase())
    .join(' ');
};
