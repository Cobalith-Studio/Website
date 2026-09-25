// Bump this version whenever the purpose, provider or collected fields change.
export const CONSENT_VERSION = '2026-09-first-party-audience-v1';
export const CONSENT_KEY = 'cobalith.cookie-preferences';
export const AUDIENCE_AVAILABLE = true;
export function makeChoice(action, audience = false, now = Date.now()) {
  const expiry = new Date(now); expiry.setUTCMonth(expiry.getUTCMonth() + 6);
  return { version: CONSENT_VERSION, action, necessary: true, audience: AUDIENCE_AVAILABLE && audience === true, savedAt: now, expiresAt: expiry.getTime() };
}
export function validChoice(value, now = Date.now()) {
  return Boolean(value && value.version === CONSENT_VERSION && ['accept','reject','custom'].includes(value.action) && value.necessary === true && typeof value.audience === 'boolean' && Number.isFinite(value.savedAt) && Number.isFinite(value.expiresAt) && value.savedAt <= now && value.expiresAt > now && value.expiresAt <= new Date(new Date(value.savedAt).setUTCMonth(new Date(value.savedAt).getUTCMonth()+6)).getTime() && (!value.audience || AUDIENCE_AVAILABLE));
}
export function readChoice(storage, now = Date.now()) {
  try { const parsed = JSON.parse(storage.getItem(CONSENT_KEY)); return validChoice(parsed, now) ? parsed : null; } catch { return null; }
}
export function mayMeasureAudience(choice, now = Date.now()) {
  return AUDIENCE_AVAILABLE && validChoice(choice, now) && choice.audience === true;
}
