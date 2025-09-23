import qs from "query-string";

export function setUrlQuery(params: string, key: string, value: string) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl({
    url: window.location.pathname,
    query,
  });
}

export function remUrlQuery(params: string, keys: string[]) {
  const query = qs.parse(params);

  keys.forEach((key) => {
    delete query[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    },
  );
}
