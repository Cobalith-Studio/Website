const ASSETS_KEY = "cobalith_admin_assets";
const NOTES_KEY = "cobalith_admin_notes";

function readJson(key, fallback) {
  try {
    if (typeof window === "undefined") return fallback;
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredAssets() {
  return readJson(ASSETS_KEY, []);
}

export function saveStoredAssets(assets) {
  writeJson(ASSETS_KEY, assets);
}

export function getStoredNotes() {
  return readJson(NOTES_KEY, []);
}

export function saveStoredNotes(notes) {
  writeJson(NOTES_KEY, notes);
}

export function createAdminId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
