// Demo-only "session" helpers. There is no real backend or auth: this just
// remembers where a parent left off in the browser, as explicitly allowed
// for this prototype (no real credential checking happens anywhere).

const AUTH_KEY = 'shadu_auth';
const ONBOARDED_KEY = 'shadu_onboarded';

export function isAuthed() {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function setAuthed(value) {
  localStorage.setItem(AUTH_KEY, value ? 'true' : 'false');
}

export function isOnboarded() {
  return localStorage.getItem(ONBOARDED_KEY) === 'true';
}

export function setOnboarded(value) {
  localStorage.setItem(ONBOARDED_KEY, value ? 'true' : 'false');
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
