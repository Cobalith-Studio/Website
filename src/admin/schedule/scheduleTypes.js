export const DAYS = [
  { key: "monday", label: "Lundi", short: "Lun." },
  { key: "tuesday", label: "Mardi", short: "Mar." },
  { key: "wednesday", label: "Mercredi", short: "Mer." },
  { key: "thursday", label: "Jeudi", short: "Jeu." },
  { key: "friday", label: "Vendredi", short: "Ven." },
  { key: "saturday", label: "Samedi", short: "Sam." },
  { key: "sunday", label: "Dimanche", short: "Dim." }
];

export const SERVICES = [
  { key: "lunch", label: "Midi" },
  { key: "dinner", label: "Soir" }
];

export const STATUS_OPTIONS = [
  { value: "work", label: "Travail" },
  { value: "rest", label: "Repos" }
];

export const EMPTY_SERVICE = {
  value: "",
  status: "unknown",
  confidence: 0,
  needsReview: true
};
