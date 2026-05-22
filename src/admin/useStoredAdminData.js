import { useEffect, useRef, useState } from "react";
import {
  deleteAdminRecord,
  fetchAdminCollection,
  fetchAdminRecord,
  saveAdminCollection,
  saveAdminRecord
} from "./adminCloudStorage";
import { DEFAULT_KANBAN_SETTINGS } from "../components/kanban/kanbanConfig";

const DEFAULT_ADMIN_PREFERENCES = {
  id: "default",
  targetPhase: "vertical_slice"
};

function createSyncState(status, label) {
  return { status, label };
}

function useCloudCollection(collection) {
  const [records, setRecords] = useState([]);
  const [isCloudReady, setIsCloudReady] = useState(false);
  const [syncState, setSyncState] = useState(createSyncState("loading", "Connexion cloud..."));
  const didHydrateCloud = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateCloudRecords() {
      const result = await fetchAdminCollection(collection);

      if (!isMounted) return;

      if (result.ok) {
        didHydrateCloud.current = true;
        setRecords(result.records);
      }

      setIsCloudReady(result.ok);
      setSyncState(result.ok
        ? createSyncState("synced", result.records.length ? "Cloud synchronisé" : "Cloud prêt")
        : createSyncState("error", "Cloud indisponible"));
    }

    hydrateCloudRecords();

    return () => {
      isMounted = false;
    };
  }, [collection]);

  useEffect(() => {
    if (!isCloudReady) return;
    if (didHydrateCloud.current) {
      didHydrateCloud.current = false;
      return;
    }

    let isCurrent = true;
    setSyncState(createSyncState("saving", "Sauvegarde cloud..."));
    saveAdminCollection(collection, records).then((result) => {
      if (!isCurrent) return;
      setSyncState(result.ok
        ? createSyncState("synced", "Cloud synchronisé")
        : createSyncState("error", "Sauvegarde cloud impossible"));
    });

    return () => {
      isCurrent = false;
    };
  }, [collection, records, isCloudReady]);

  return [records, setRecords, syncState];
}

export function useStoredAssets() {
  return useCloudCollection("assets");
}

export function useDeleteStoredAsset() {
  return (id) => deleteAdminRecord("assets", id);
}

export function useStoredNotes() {
  return useCloudCollection("notes");
}

export function useDeleteStoredNote() {
  return (id) => deleteAdminRecord("notes", id);
}

export function useStoredKanbanCards() {
  return useCloudCollection("kanban_cards");
}

export function useDeleteStoredKanbanCard() {
  return (id) => deleteAdminRecord("kanban_cards", id);
}

export function useStoredBudgetEntries() {
  return useCloudCollection("budget_entries");
}

export function useDeleteStoredBudgetEntry() {
  return (id) => deleteAdminRecord("budget_entries", id);
}

export function useStoredKanbanSettings() {
  const [settings, setSettings] = useState(DEFAULT_KANBAN_SETTINGS);
  const [isCloudReady, setIsCloudReady] = useState(false);
  const [syncState, setSyncState] = useState(createSyncState("loading", "Connexion cloud..."));
  const didHydrateCloud = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateCloudSettings() {
      const result = await fetchAdminRecord("kanban_settings", "default");

      if (!isMounted) return;

      if (result.ok) {
        didHydrateCloud.current = true;
        setSettings(result.record ? {
          ...DEFAULT_KANBAN_SETTINGS,
          ...result.record,
          priorities: result.record.priorities?.length ? result.record.priorities : DEFAULT_KANBAN_SETTINGS.priorities,
          tags: result.record.tags?.length ? result.record.tags : DEFAULT_KANBAN_SETTINGS.tags
        } : DEFAULT_KANBAN_SETTINGS);
        if (!result.record) {
          saveAdminRecord("kanban_settings", DEFAULT_KANBAN_SETTINGS);
        }
      }

      setIsCloudReady(result.ok);
      setSyncState(result.ok
        ? createSyncState("synced", result.record ? "Cloud synchronisé" : "Cloud prêt")
        : createSyncState("error", "Cloud indisponible"));
    }

    hydrateCloudSettings();

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
    setSyncState(createSyncState("saving", "Sauvegarde cloud..."));
    saveAdminRecord("kanban_settings", { ...settings, id: "default" }).then((result) => {
      if (!isCurrent) return;
      setSyncState(result.ok
        ? createSyncState("synced", "Cloud synchronisé")
        : createSyncState("error", "Sauvegarde cloud impossible"));
    });

    return () => {
      isCurrent = false;
    };
  }, [settings, isCloudReady]);

  return [settings, setSettings, syncState];
}

export function useStoredAdminPreferences() {
  const [preferences, setPreferences] = useState(DEFAULT_ADMIN_PREFERENCES);
  const [isCloudReady, setIsCloudReady] = useState(false);
  const [syncState, setSyncState] = useState(createSyncState("loading", "Connexion cloud..."));
  const didHydrateCloud = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateCloudPreferences() {
      const result = await fetchAdminRecord("admin_preferences", "default");

      if (!isMounted) return;

      if (result.ok) {
        didHydrateCloud.current = true;
        setPreferences(result.record ? { ...DEFAULT_ADMIN_PREFERENCES, ...result.record } : DEFAULT_ADMIN_PREFERENCES);
        if (!result.record) {
          saveAdminRecord("admin_preferences", DEFAULT_ADMIN_PREFERENCES);
        }
      }

      setIsCloudReady(result.ok);
      setSyncState(result.ok
        ? createSyncState("synced", result.record ? "Cloud synchronisé" : "Cloud prêt")
        : createSyncState("error", "Cloud indisponible"));
    }

    hydrateCloudPreferences();

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
    setSyncState(createSyncState("saving", "Sauvegarde cloud..."));
    saveAdminRecord("admin_preferences", { ...preferences, id: "default" }).then((result) => {
      if (!isCurrent) return;
      setSyncState(result.ok
        ? createSyncState("synced", "Cloud synchronisé")
        : createSyncState("error", "Sauvegarde cloud impossible"));
    });

    return () => {
      isCurrent = false;
    };
  }, [preferences, isCloudReady]);

  return [preferences, setPreferences, syncState];
}
