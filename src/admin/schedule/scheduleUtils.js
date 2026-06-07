import { DAYS, EMPTY_SERVICE, SERVICES } from "./scheduleTypes";

export function createScheduleId(prefix = "schedule") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getServiceWeekStart(date = new Date()) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  const day = value.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  value.setDate(value.getDate() + mondayOffset);
  return value;
}

export function sameWeekStart(first, second) {
  return toDateKey(first) === toDateKey(second);
}

export function getWeekLabelFromStart(weekStart) {
  return `Semaine du ${formatShortDate(weekStart)} au ${formatShortDate(addDays(weekStart, 6))}`;
}

export function getWeekRangeLabel(weekStart) {
  return `${formatLongDate(weekStart)} - ${formatLongDate(addDays(weekStart, 6))}`;
}

export function getWeekStartFromSchedule(schedule) {
  const parsed = parseWeekStartFromLabel(schedule?.weekLabel);
  if (parsed) return parsed;
  return getServiceWeekStart(schedule?.createdAt ? new Date(schedule.createdAt) : new Date());
}

function parseWeekStartFromLabel(label) {
  const text = String(label || "");
  const match = text.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
  if (!match) return null;

  const currentYear = new Date().getFullYear();
  const year = match[3] ? normalizeYear(match[3]) : currentYear;
  const date = new Date(year, Number(match[2]) - 1, Number(match[1]));
  if (Number.isNaN(date.getTime())) return null;
  return getServiceWeekStart(date);
}

function normalizeYear(value) {
  const year = Number(value);
  return year < 100 ? 2000 + year : year;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function toDateKey(date) {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" }).format(date);
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long" }).format(date);
}

export function normalizeTimeValue(value) {
  if (!value) return "";
  const text = String(value).trim();
  if (/^rep(os)?$/i.test(text)) return "Repos";

  const normalized = text
    .replace(/[hH]/g, ":")
    .replace(/\s*(>|-|\u2013|\u2014|a|à)\s*/gi, "-")
    .replace(/\./g, ":")
    .replace(/\s+/g, "");

  const match = normalized.match(/^(\d{1,2})(?::?(\d{2}))?-(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) return text;

  const [, startHour, startMinute = "00", endHour, endMinute = "00"] = match;
  return `${startHour.padStart(2, "0")}:${startMinute}-${endHour.padStart(2, "0")}:${endMinute}`;
}

export function normalizeServiceCell(cell) {
  const status = ["work", "rest", "unknown"].includes(cell?.status) ? cell.status : "unknown";
  const parts = extractShiftParts(cell);
  const value = status === "rest" ? "Repos" : buildShiftValue(parts, cell?.value || "");
  const confidence = Math.max(0, Math.min(1, Number(cell?.confidence) || 0));

  return {
    ...EMPTY_SERVICE,
    ...cell,
    ...parts,
    value,
    status,
    confidence,
    needsReview: Boolean(cell?.needsReview || status === "unknown" || confidence < 0.6)
  };
}

function extractShiftParts(cell) {
  if (!cell) {
    return { start: "", end: "", breakStart: "", breakEnd: "" };
  }

  if (cell.start || cell.end || cell.breakStart || cell.breakEnd) {
    return {
      start: normalizeTimePart(cell.start),
      end: normalizeTimePart(cell.end),
      breakStart: normalizeTimePart(cell.breakStart),
      breakEnd: normalizeTimePart(cell.breakEnd)
    };
  }

  const times = String(cell.value || "").match(/\d{1,2}:\d{2}/g) || [];
  return {
    start: normalizeTimePart(times[0]),
    end: normalizeTimePart(times[1]),
    breakStart: normalizeTimePart(times[2]),
    breakEnd: normalizeTimePart(times[3])
  };
}

function normalizeTimePart(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return "";
  const hour = Math.max(0, Math.min(23, Number(match[1])));
  const minute = Math.max(0, Math.min(59, Number(match[2])));
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function buildShiftValue(parts, fallback) {
  if (parts.start && parts.end) {
    const pause = parts.breakStart && parts.breakEnd ? ` (pause ${parts.breakStart}-${parts.breakEnd})` : "";
    return `${parts.start}-${parts.end}${pause}`;
  }

  return normalizeTimeValue(fallback || "");
}

export function normalizePerson(person, index = 0) {
  const days = DAYS.reduce((acc, day) => {
    const sourceDay = person?.days?.[day.key] || {};
    acc[day.key] = SERVICES.reduce((serviceAcc, service) => {
      serviceAcc[service.key] = normalizeServiceCell(sourceDay[service.key]);
      return serviceAcc;
    }, {});
    return acc;
  }, {});

  return {
    id: person?.id || createScheduleId(`person-${index + 1}`),
    name: person?.name || "Personne sans nom",
    role: person?.role || "SERVEUR",
    days
  };
}

export function normalizeSchedule(schedule) {
  const people = Array.isArray(schedule?.people) ? schedule.people : [];
  return {
    id: schedule?.id || createScheduleId(),
    weekLabel: schedule?.weekLabel || "Semaine à vérifier",
    createdAt: schedule?.createdAt || new Date().toISOString(),
    updatedAt: schedule?.updatedAt || schedule?.createdAt || new Date().toISOString(),
    validatedAt: schedule?.validatedAt || "",
    source: schedule?.source || "manual",
    people: people.map(normalizePerson)
  };
}

export function countReviewCells(schedule) {
  if (!schedule?.people?.length) return 0;
  return schedule.people.reduce((total, person) => {
    const personTotal = DAYS.reduce((dayTotal, day) => {
      return dayTotal + SERVICES.filter((service) => person.days?.[day.key]?.[service.key]?.needsReview).length;
    }, 0);
    return total + personTotal;
  }, 0);
}

export function updateScheduleCell(schedule, personId, dayKey, serviceKey, patch) {
  return {
    ...schedule,
    people: schedule.people.map((person) => {
      if (person.id !== personId) return person;
      const current = person.days[dayKey][serviceKey];
      return {
        ...person,
        days: {
          ...person.days,
          [dayKey]: {
            ...person.days[dayKey],
            [serviceKey]: normalizeServiceCell({ ...current, ...patch })
          }
        }
      };
    })
  };
}

export function getStatusLabel(status) {
  if (status === "work") return "Travail";
  if (status === "rest") return "Repos";
  return "A corriger";
}
