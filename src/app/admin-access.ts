const ADMIN_SESSION_KEY = 'brightside-admin-access';
const ADMIN_PASSPHRASE = 'rootbeer';

function normalizePassphrase(value: string | null): string {
  return (value ?? '').trim().toLowerCase();
}

export function hasAdminAccess(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return normalizePassphrase(window.sessionStorage.getItem(ADMIN_SESSION_KEY)) === ADMIN_PASSPHRASE;
}

export function grantAdminAccess(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(ADMIN_SESSION_KEY, ADMIN_PASSPHRASE);
}

export function clearAdminAccess(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isValidAdminPassphrase(value: string): boolean {
  return normalizePassphrase(value) === ADMIN_PASSPHRASE;
}
