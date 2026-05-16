type AppConfig = {
  apiBaseUrl?: string;
};

const API_BASE_URL_STORAGE_KEY = 'brightside-api-base-url';
const API_BASE_URL_QUERY_PARAM = 'apiBaseUrl';

declare global {
  interface Window {
    __APP_CONFIG__?: AppConfig;
  }
}

function normalizeApiBaseUrl(value: string | undefined): string {
  const trimmed = (value ?? '').trim();

  if (!trimmed || trimmed.toLowerCase() === 'same-origin') {
    return '';
  }

  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

function getStoredApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return normalizeApiBaseUrl(window.localStorage.getItem(API_BASE_URL_STORAGE_KEY) ?? '');
}

function persistApiBaseUrlOverride(value: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!value) {
    window.localStorage.removeItem(API_BASE_URL_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(API_BASE_URL_STORAGE_KEY, value);
}

export function initializeRuntimeConfig(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  const queryValue = url.searchParams.get(API_BASE_URL_QUERY_PARAM);

  if (queryValue === null) {
    return;
  }

  const apiBaseUrl = normalizeApiBaseUrl(queryValue);
  persistApiBaseUrlOverride(apiBaseUrl);
  url.searchParams.delete(API_BASE_URL_QUERY_PARAM);

  window.history.replaceState({}, '', url.toString());
}

export function getApiUrl(path: string): string {
  const apiBaseUrl = getStoredApiBaseUrl() || normalizeApiBaseUrl(window.__APP_CONFIG__?.apiBaseUrl);

  if (!apiBaseUrl) {
    return path;
  }

  return `${apiBaseUrl}${path}`;
}
