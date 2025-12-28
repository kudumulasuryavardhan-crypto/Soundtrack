export function paginate(data, page = 1, perPage = 10) {
  const start = (page - 1) * perPage;
  return data.slice(start, start + perPage);
}
