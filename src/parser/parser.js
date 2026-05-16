export function parse(uri) {
  if (!uri || !uri.rawValue) return {};

  let url;
  try {
    url = new URL(uri.rawValue);
  } catch {
    return {};
  }

  let name = url.pathname.replace(/^\/+/, "");
  try {
    name = decodeURIComponent(name);
  } catch {
    // leave as-is if decoding fails
  }
  const code = url.searchParams.get("secret");
  let app = url.searchParams.get("issuer");

  const colonIndex = name.indexOf(":");
  if (colonIndex !== -1) {
    if (!app) app = name.slice(0, colonIndex);
    name = name.slice(colonIndex + 1);
  }

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
