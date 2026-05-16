export function parse(uri) {
  if (!uri || !uri.rawValue) return {};

  let url;
  try {
    url = new URL(uri.rawValue);
  } catch {
    return {};
  }

  const name = url.pathname.replace(/^\/+/, "");
  const app = url.searchParams.get("issuer");
  const code = url.searchParams.get("secret");

  return {
    app,
    name,
    code,
  };
}

export function validate(secret) {
  return !!(
    secret &&
    secret.name &&
    secret.app &&
    secret.code
  )
}
