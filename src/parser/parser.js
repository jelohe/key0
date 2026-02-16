export const parseUris = (uris) => uris.map(parseUri);
export function parseUri(uri) {
  if (!uri.rawValue) return {};

  const url = new URL(uri.rawValue);

  const name = url.pathname.replace("/", "");
  const app = url.searchParams.get("issuer");
  const code = url.searchParams.get("secret");

  return {
    app,
    name,
    code,
  };
}
