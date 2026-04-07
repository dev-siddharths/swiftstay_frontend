const DEFAULT_LOCAL_API_URL = "http://localhost:4000";
const DEFAULT_PRODUCTION_API_URL = "https://swiftstay-backend-henna.vercel.app";

function stripTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

function isLocalhost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function getApiBaseUrl() {
  const localApiUrl =
    process.env.NEXT_PUBLIC_API_URL_LOCAL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    DEFAULT_LOCAL_API_URL;
  const productionApiUrl =
    process.env.NEXT_PUBLIC_API_URL_PRODUCTION?.trim() ||
    DEFAULT_PRODUCTION_API_URL;

  if (typeof window !== "undefined") {
    return stripTrailingSlash(
      isLocalhost(window.location.hostname) ? localApiUrl : productionApiUrl,
    );
  }

  return stripTrailingSlash(
    process.env.NODE_ENV === "production" ? productionApiUrl : localApiUrl,
  );
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
