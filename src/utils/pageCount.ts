export function calculatePageCount(limit, total) {
  const pages = Math.floor(total / limit);

  if (pages % 2 !== 0) {
    return pages + 1;
  }

  return pages > 0 ? pages : 1;
}
