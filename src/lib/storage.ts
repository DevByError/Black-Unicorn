/** Storage can be blocked (private mode, policy). Every access is wrapped; failure means "no value". */
export function readLocal(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
export function writeLocal(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* blocked storage: the preference simply does not persist */
  }
}
export function removeLocal(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* blocked storage */
  }
}
export function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
export function writeSession(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* blocked storage */
  }
}
