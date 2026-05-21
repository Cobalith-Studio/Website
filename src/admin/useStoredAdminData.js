import { useEffect, useRef, useState } from "react";
import { fetchAdminCollection, saveAdminCollection } from "./adminCloudStorage";
import {
  clearStoredAssets,
  getStoredAssets,
  getStoredNotes,
  saveStoredNotes
} from "./adminStorage";

export function useStoredAssets() {
  const [assets, setAssets] = useState(() => getStoredAssets());
  const [isCloudReady, setIsCloudReady] = useState(false);
  const [syncState, setSyncState] = useState({ status: "loading", label: "Connexion cloud..." });
  const didHydrateCloud = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateCloudAssets() {
      const result = await fetchAdminCollection("assets");

      if (!isMounted) return;

      if (result.ok) {
        const nextAssets = result.records;
        didHydrateCloud.current = true;
        clearStoredAssets();
        setAssets(nextAssets);
      }

      setIsCloudReady(result.ok);
      setSyncState(result.ok
        ? { status: "synced", label: result.records.length ? "Cloud synchronisé" : "Cloud prêt" }
        : { status: "local", label: "Sauvegarde locale" });
    }

    hydrateCloudAssets();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isCloudReady) return;
    if (didHydrateCloud.current) {
      didHydrateCloud.current = false;
      return;
    }
    let isCurrent = true;
    setSyncState({ status: "saving", label: "Sauvegarde cloud..." });
    saveAdminCollection("assets", assets).then((result) => {
      if (!isCurrent) return;
      setSyncState(result.ok
        ? { status: "synced", label: "Cloud synchronisé" }
        : { status: "local", label: "Sauvegarde locale" });
    });

    return () => {
      isCurrent = false;
    };
  }, [assets, isCloudReady]);

  return [assets, setAssets, syncState];
}

export function useStoredNotes() {
  const [notes, setNotes] = useState(() => getStoredNotes());
  const [isCloudReady, setIsCloudReady] = useState(false);
  const [syncState, setSyncState] = useState({ status: "loading", label: "Connexion cloud..." });
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
      setSyncState(result.ok
        ? { status: "synced", label: result.records.length ? "Cloud synchronisé" : "Cloud prêt" }
        : { status: "local", label: "Sauvegarde locale" });
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
    let isCurrent = true;
    setSyncState({ status: "saving", label: "Sauvegarde cloud..." });
    saveAdminCollection("notes", notes).then((result) => {
      if (!isCurrent) return;
      setSyncState(result.ok
        ? { status: "synced", label: "Cloud synchronisé" }
        : { status: "local", label: "Sauvegarde locale" });
    });

    return () => {
      isCurrent = false;
    };
  }, [notes, isCloudReady]);

  return [notes, setNotes, syncState];
}
