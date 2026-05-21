import { seedAssets } from "./adminConfig";

const ASSETS_KEY = "cobalith_admin_assets";
const NOTES_KEY = "cobalith_admin_notes";

function readJson(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredAssets() {
  const storedAssets = readJson(ASSETS_KEY, []);
  const storedById = new Map(storedAssets.map((asset) => [asset.id, asset]));
  const mergedSeed = seedAssets.map((asset) => storedById.get(asset.id) ?? asset);
  const customAssets = storedAssets.filter((asset) => !seedAssets.some((seedAsset) => seedAsset.id === asset.id));
  return [...mergedSeed, ...customAssets];
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
