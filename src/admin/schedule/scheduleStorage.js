import { normalizeSchedule } from "./scheduleUtils";

const STORAGE_KEY = "cobalith-admin-schedule-scanner";

export function loadStoredScheduleState() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      schedule: parsed.schedule ? normalizeSchedule(parsed.schedule) : null,
      selectedPersonId: parsed.selectedPersonId || "",
      validatedAt: parsed.validatedAt || ""
    };
  } catch {
    return null;
  }
}

export function saveStoredScheduleState(state) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
    schedule: state.schedule,
    selectedPersonId: state.selectedPersonId || "",
    validatedAt: state.validatedAt || ""
  }));
}

export function clearStoredScheduleState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
