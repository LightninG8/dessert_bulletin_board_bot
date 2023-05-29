export const chunkArray = (arr, cnt) =>
  arr.reduce(
    (prev, cur, i, a) =>
      !(i % cnt) ? prev.concat([a.slice(i, i + cnt)]) : prev,
    [],
  );
