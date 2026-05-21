import { useEffect, useRef, useState } from "react";
import { fetchAdminCollection, saveAdminCollection } from "./adminCloudStorage";
import {
  getStoredAssets,
  getStoredNotes,
  mergeSeedAssets,
  saveStoredAssets,
  saveStoredNotes
} from "./adminStorage";

export function useStoredAssets() {
  const [assets, setAssets] = useState(() => getStoredAssets());
  const [isCloudReady, setIsCloudReady] = useState(false);
  const didHydrateCloud = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateCloudAssets() {
      const result = await fetchAdminCollection("assets");

      if (!isMounted) return;

      if (result.ok && result.records.length) {
        const nextAssets = mergeSeedAssets(result.records);
        didHydrateCloud.current = true;
        saveStoredAssets(nextAssets);
        setAssets(nextAssets);
      }

      setIsCloudReady(result.ok);
    }

    hydrateCloudAssets();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    saveStoredAssets(assets);
    if (!isCloudReady) return;
    if (didHydrateCloud.current) {
      didHydrateCloud.current = false;
      return;
    }
    saveAdminCollection("assets", assets);
  }, [assets, isCloudReady]);

  return [assets, setAssets];
}

export function useStoredNotes() {
  const [notes, setNotes] = useState(() => getStoredNotes());
  const [isCloudReady, setIsCloudReady] = useState(false);
  const didHydrateCloud = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateCloudNotes() {
      const result = await fetchAdminCollection("notes");

      if (!isMounted) return;

      if (result.ok && result.records.length) {
        didHydrateCloud.current = true;
        saveStoredNotes(result.records);
        setNotes(result.records);
      }

      setIsCloudReady(result.ok);
    }

    hydrateCloudNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    saveStoredNotes(notes);
    if (!isCloudReady) return;
    if (didHydrateCloud.current) {
      didHydrateCloud.current = false;
      return;
    }
    saveAdminCollection("notes", notes);
  }, [notes, isCloudReady]);

  return [notes, setNotes];
}
