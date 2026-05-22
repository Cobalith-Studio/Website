export const KANBAN_COLUMNS = [
  { id: "todo", label: "À faire", dot: "#60a5fa", className: "kanban-dot--blue" },
  { id: "in_progress", label: "En cours", dot: "#fbbf24", className: "kanban-dot--amber" },
  { id: "review", label: "En révision", dot: "#c084fc", className: "kanban-dot--purple" },
  { id: "done", label: "Terminé", dot: "#4ade80", className: "kanban-dot--green" }
];

export const DEFAULT_PRIORITIES = [
  { id: "urgent", label: "Urgent", color: "#ef4444" },
  { id: "important", label: "Important", color: "#f97316" },
  { id: "normal", label: "Normal", color: "#3b82f6" },
  { id: "low", label: "Basse", color: "#64748b" },
  { id: "watch", label: "À suivre", color: "#8b5cf6" },
  { id: "optional", label: "Optionnel", color: "#10b981" }
];

export const DEFAULT_TAGS = [
  { id: "system", label: "Système", color: "#9b6a3d" },
  { id: "environment", label: "Environnement", color: "#6f716b" },
  { id: "shop", label: "Shop", color: "#8b5bb0" },
  { id: "progression", label: "Progression", color: "#b56799" },
  { id: "ui", label: "UI", color: "#a18443" },
  { id: "simulation", label: "Simulation", color: "#b66a34" },
  { id: "assets", label: "Assets", color: "#4a9a72" },
  { id: "items", label: "Items", color: "#477da5" },
  { id: "models_sprites", label: "Modèles & Sprites", color: "#c26464" },
  { id: "player", label: "Player", color: "#8d735c" }
];

export const DEFAULT_KANBAN_SETTINGS = {
  id: "default",
  priorities: DEFAULT_PRIORITIES,
  tags: DEFAULT_TAGS
};

export const KANBAN_SORT_OPTIONS = [
  { value: "order", label: "Manuel (drag)" },
  { value: "priority", label: "Priorité" },
  { value: "due_date", label: "Date d'échéance" },
  { value: "start_date", label: "Date de début" },
  { value: "tag", label: "Tag / Domaine" },
  { value: "title", label: "Titre A-Z" }
];

export function formatKanbanDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function sortKanbanCards(cards, sortBy, priorities) {
  if (sortBy === "order") {
    return [...cards].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  if (sortBy === "priority") {
    const index = (card) => {
      const priorityIndex = priorities.findIndex((priority) => priority.id === card.priority);
      return priorityIndex === -1 ? priorities.length : priorityIndex;
    };
    return [...cards].sort((a, b) => index(a) - index(b));
  }

  if (sortBy === "due_date" || sortBy === "start_date") {
    return [...cards].sort((a, b) => {
      if (!a[sortBy]) return 1;
      if (!b[sortBy]) return -1;
      return a[sortBy].localeCompare(b[sortBy]);
    });
  }

  if (sortBy === "tag") {
    return [...cards].sort((a, b) => (a.tag || "").localeCompare(b.tag || ""));
  }

  if (sortBy === "title") {
    return [...cards].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }

  return cards;
}
