const extractQueries = (search: string): Record<string, string> => {
  const parts = search.split('?')[1].split('&');
  let queries: Record<string, string> = {};
  parts.forEach((p) => {
    const pParts = p.split('=');
    queries[`${pParts[0]}`] = pParts[1];
  });
  return queries;
};

export { extractQueries };
