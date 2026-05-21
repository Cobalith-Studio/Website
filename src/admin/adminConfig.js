import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

export const PHASE_OPTIONS = [
  { value: "vertical_slice", label: "Vertical Slice", short: "VS", className: "admin-chip--primary" },
  { value: "demo", label: "Démo publique", short: "Démo", className: "admin-chip--purple" },
  { value: "release", label: "Version 1.0", short: "1.0", className: "admin-chip--green" }
];

export const STATUS_CONFIG = {
  missing: { label: "Manquant", className: "admin-status--red", icon: AlertCircle },
  found_pack: { label: "Pack trouvé", className: "admin-status--amber", icon: Clock },
  temporary: { label: "Temporaire", className: "admin-status--blue", icon: Clock },
  done: { label: "Terminé", className: "admin-status--green", icon: CheckCircle2 }
};

export const MILESTONE_CONFIG = {
  vertical_slice: { label: "VS", fullLabel: "Vertical Slice", className: "admin-status--blue" },
  demo: { label: "Démo", fullLabel: "Démo publique", className: "admin-status--purple" },
  release: { label: "Sortie", fullLabel: "Version 1.0", className: "admin-status--green" }
};

export const ASSET_CATEGORIES = [
  "Basics",
  "Tools & Equipment",
  "Consumables",
  "Wine Stations",
  "Storage & Logistics",
  "Environment",
  "UI & FX"
];

export const NOTE_CATEGORIES = {
  production: { label: "Production", className: "admin-status--blue" },
  design: { label: "Design", className: "admin-status--purple" },
  business: { label: "Business", className: "admin-status--green" },
  tech: { label: "Tech", className: "admin-status--amber" },
  general: { label: "Général", className: "admin-status--slate" }
};
