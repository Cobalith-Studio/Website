import { useEffect, useState } from "react";
import {
  getStoredAssets,
  getStoredNotes,
  saveStoredAssets,
  saveStoredNotes
} from "./adminStorage";

export function useStoredAssets() {
  const [assets, setAssets] = useState(() => getStoredAssets());

  useEffect(() => {
    saveStoredAssets(assets);
  }, [assets]);

  return [assets, setAssets];
}

export function useStoredNotes() {
  const [notes, setNotes] = useState(() => getStoredNotes());

  useEffect(() => {
    saveStoredNotes(notes);
  }, [notes]);

  return [notes, setNotes];
}
