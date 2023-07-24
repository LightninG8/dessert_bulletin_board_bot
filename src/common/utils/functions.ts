export const chunkArray = (arr, cnt) =>
  arr.reduce(
    (prev, cur, i, a) =>
      !(i % cnt) ? prev.concat([a.slice(i, i + cnt)]) : prev,
    [],
  );

export const getIdFromCbQuery = (cbQuery: string) => +cbQuery.split(':')?.pop();

export const shuffle = (array) => {
  let currentIndex = array?.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};
