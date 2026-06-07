import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, ChevronLeft, Plus, Trash2, X } from "lucide-react";
import ScheduleFinalView from "../../admin/schedule/components/ScheduleFinalView";
import ScheduleReview from "../../admin/schedule/components/ScheduleReview";
import ScheduleTextImport from "../../admin/schedule/components/ScheduleTextImport";
import { clearStoredScheduleState, loadStoredScheduleState, saveStoredScheduleState } from "../../admin/schedule/scheduleStorage";
import { DAYS } from "../../admin/schedule/scheduleTypes";
import { createBlankSchedule, parseScheduleTextImport } from "../../admin/schedule/scheduleTextImport";
import {
  countReviewCells,
  getServiceWeekStart,
  getWeekLabelFromStart,
  getWeekRangeLabel,
  getWeekStartFromSchedule,
  normalizeSchedule,
  sameWeekStart,
  updateScheduleCell
} from "../../admin/schedule/scheduleUtils";
import { useDeleteStoredServiceSchedule, useStoredServiceSchedules } from "../../admin/useStoredAdminData";
import "../../admin/schedule/schedule.css";

const DEFAULT_PERSON_MATCH = "leo";

function findDefaultPersonId(schedule) {
  const preferred = schedule?.people?.find((person) => person.name.toLowerCase().includes(DEFAULT_PERSON_MATCH));
  return preferred?.id || schedule?.people?.[0]?.id || "global";
}

function addWeeks(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount * 7);
  return getServiceWeekStart(next);
}

export default function ScheduleScanner() {
  const [savedSchedules, setSavedSchedules, syncState] = useStoredServiceSchedules();
  const deleteStoredServiceSchedule = useDeleteStoredServiceSchedule();
  const [visibleWeekStart, setVisibleWeekStart] = useState(() => getServiceWeekStart(new Date()));
  const [textImport, setTextImport] = useState("");
  const [draftSchedule, setDraftSchedule] = useState(null);
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [mode, setMode] = useState("view");
  const [error, setError] = useState("");

  const normalizedSavedSchedules = useMemo(() => savedSchedules.map(normalizeSchedule), [savedSchedules]);
  const currentSchedule = useMemo(() => {
    return normalizedSavedSchedules.find((item) => sameWeekStart(getWeekStartFromSchedule(item), visibleWeekStart)) || null;
  }, [normalizedSavedSchedules, visibleWeekStart]);

  useEffect(() => {
    const stored = loadStoredScheduleState();
    if (!stored?.schedule) return;

    const normalized = normalizeSchedule(stored.schedule);
    setDraftSchedule(normalized);
    setSelectedPersonId(stored.selectedPersonId || findDefaultPersonId(normalized));
    setVisibleWeekStart(getWeekStartFromSchedule(normalized));
    setMode(stored.validatedAt ? "view" : "review");
  }, []);

  useEffect(() => {
    if (draftSchedule) {
      saveStoredScheduleState({ schedule: draftSchedule, selectedPersonId, validatedAt: draftSchedule.validatedAt || "" });
    }
  }, [draftSchedule, selectedPersonId]);

  useEffect(() => {
    if (mode !== "view") return;
    setSelectedPersonId(findDefaultPersonId(currentSchedule));
  }, [currentSchedule, mode]);

  function clearDraft() {
    clearStoredScheduleState();
    setTextImport("");
    setDraftSchedule(null);
    setError("");
  }

  function handleAdd() {
    clearDraft();
    setMode("import");
  }

  function handleImportText() {
    setError("");

    try {
      const result = normalizeSchedule(parseScheduleTextImport(textImport));
      const weekStart = getWeekStartFromSchedule(result);
      setVisibleWeekStart(weekStart);
      setDraftSchedule({ ...result, weekLabel: result.weekLabel || getWeekLabelFromStart(weekStart) });
      setSelectedPersonId(findDefaultPersonId(result));
      setMode("review");
    } catch (importError) {
      setError(importError.message || "Impossible d'importer ce planning.");
    }
  }

  function handleCreateBlank() {
    const schedule = normalizeSchedule({
      ...createBlankSchedule(),
      weekLabel: getWeekLabelFromStart(visibleWeekStart)
    });
    setDraftSchedule(schedule);
    setSelectedPersonId(findDefaultPersonId(schedule));
    setError("");
    setMode("review");
  }

  function handleEditCurrent() {
    if (!currentSchedule) return;
    const normalized = normalizeSchedule(currentSchedule);
    setDraftSchedule(normalized);
    setSelectedPersonId(findDefaultPersonId(normalized));
    setMode("review");
  }

  async function handleDeleteCurrent() {
    if (!currentSchedule) return;
    setSavedSchedules((current) => current.filter((item) => item.id !== currentSchedule.id));
    await deleteStoredServiceSchedule(currentSchedule.id);
    clearDraft();
    setMode("view");
  }

  function handleCancelFlow() {
    clearDraft();
    setMode("view");
  }

  function handleCellChange(personId, dayKey, serviceKey, patch) {
    setDraftSchedule((current) => updateScheduleCell(current, personId, dayKey, serviceKey, patch));
  }

  function handlePersonNameChange(personId, name) {
    setDraftSchedule((current) => ({
      ...current,
      people: current.people.map((person) => person.id === personId ? { ...person, name } : person)
    }));
  }

  function handlePersonDelete(personId) {
    setDraftSchedule((current) => ({
      ...current,
      people: current.people.filter((person) => person.id !== personId)
    }));
  }

  function handlePersonAdd() {
    setDraftSchedule((current) => {
      const days = DAYS.reduce((acc, day) => {
        acc[day.key] = {
          lunch: { value: "", status: "work", confidence: 0.4, needsReview: true },
          dinner: { value: "", status: "work", confidence: 0.4, needsReview: true }
        };
        return acc;
      }, {});

      return {
        ...current,
        people: [
          ...current.people,
          {
            id: `person-${Date.now()}`,
            name: "",
            role: "SERVEUR",
            days
          }
        ]
      };
    });
  }

  function handleValidate() {
    const date = new Date().toISOString();
    const weekStart = getWeekStartFromSchedule(draftSchedule);
    const validatedSchedule = normalizeSchedule({
      ...draftSchedule,
      weekLabel: draftSchedule.weekLabel || getWeekLabelFromStart(weekStart),
      validatedAt: date,
      updatedAt: date,
      source: draftSchedule.source || "manual"
    });

    setVisibleWeekStart(weekStart);
    setSelectedPersonId(findDefaultPersonId(validatedSchedule));
    setSavedSchedules((current) => {
      const withoutSameWeek = current.filter((item) => !sameWeekStart(getWeekStartFromSchedule(normalizeSchedule(item)), weekStart));
      return [validatedSchedule, ...withoutSameWeek];
    });
    clearStoredScheduleState();
    setDraftSchedule(null);
    setMode("view");
  }

  const displayedSchedule = mode === "view" ? currentSchedule : draftSchedule;
  const reviewCount = countReviewCells(displayedSchedule);

  return (
    <main className="admin-shell schedule-shell">
      <div className="admin-container schedule-container">
        <header className="admin-page-head schedule-page-head schedule-page-head--weekly">
          <Link to="/equipe" className="admin-back-link" aria-label="Retour">
            <ChevronLeft aria-hidden="true" />
          </Link>
          <span className="admin-page-icon admin-tool-icon--cyan"><CalendarClock aria-hidden="true" /></span>
          <div>
            <h1>Planning Service</h1>
            <p>{syncState?.label || "Planning synchronise"}</p>
          </div>
          {mode === "view" ? (
            <button className="schedule-button schedule-button--accent schedule-add-top" type="button" onClick={handleAdd}>
              <Plus aria-hidden="true" /> Ajouter
            </button>
          ) : null}
          {mode !== "view" ? (
            <button className="schedule-icon-button" type="button" onClick={handleCancelFlow} aria-label="Fermer">
              <X aria-hidden="true" />
            </button>
          ) : null}
        </header>

        {mode === "view" ? (
          <ScheduleFinalView
            schedule={currentSchedule}
            selectedPersonId={selectedPersonId}
            weekLabel={getWeekRangeLabel(visibleWeekStart)}
            onSelectedPersonChange={setSelectedPersonId}
            onPreviousWeek={() => setVisibleWeekStart((current) => addWeeks(current, -1))}
            onNextWeek={() => setVisibleWeekStart((current) => addWeeks(current, 1))}
            onEdit={handleEditCurrent}
            onDelete={handleDeleteCurrent}
            onCreate={handleAdd}
          />
        ) : null}

        {mode === "import" ? (
          <ScheduleTextImport
            value={textImport}
            error={error}
            onChange={setTextImport}
            onImport={handleImportText}
            onCreateBlank={handleCreateBlank}
          />
        ) : null}

        {mode === "review" && draftSchedule ? (
          <ScheduleReview
            schedule={draftSchedule}
            onCellChange={handleCellChange}
            onPersonNameChange={handlePersonNameChange}
            onPersonDelete={handlePersonDelete}
            onPersonAdd={handlePersonAdd}
            onValidate={handleValidate}
          />
        ) : null}

        {mode !== "view" && displayedSchedule ? (
          <p className={`schedule-review-count ${reviewCount ? "has-warning" : ""}`}>
            {reviewCount} cellule{reviewCount > 1 ? "s" : ""} a verifier
          </p>
        ) : null}
      </div>
    </main>
  );
}
