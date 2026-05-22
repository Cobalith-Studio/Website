import { useState } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { createAdminId } from "../../admin/adminStorage";
import { KANBAN_COLUMNS } from "./kanbanConfig";
import KanbanDatePicker from "./KanbanDatePicker";
import KanbanSelect from "./KanbanSelect";

export default function CardForm({ card, defaultColumn, priorities, tags, onClose, onSave }) {
  const [form, setForm] = useState(card ? { ...card } : {
    id: createAdminId("kanban"),
    title: "",
    description: "",
    column: defaultColumn || "todo",
    priority: priorities[2]?.id || "normal",
    tag: "",
    start_date: "",
    due_date: "",
    order: Date.now()
  });
  const [descHeight, setDescHeight] = useState(250);
  const [error, setError] = useState("");
  const columnOptions = KANBAN_COLUMNS.map((column) => ({ value: column.id, label: column.label, dot: column.dot }));
  const priorityOptions = priorities.map((priority) => ({ value: priority.id, label: priority.label, dot: priority.color }));
  const tagOptions = [{ value: "", label: "- Aucun -" }, ...tags.map((tag) => ({ value: tag.id, label: tag.label, dot: tag.color }))];

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    if (!form.title.trim()) {
      setError("Titre requis.");
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim()
    });
  }

  return (
    <div className="admin-modal-backdrop">
      <motion.div className="kanban-modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="kanban-modal-head">
          <h2>{card ? "Modifier la carte" : "Nouvelle carte"}</h2>
          <button type="button" onClick={onClose} aria-label="Fermer">
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="kanban-form">
          <label>
            <span>Titre *</span>
            <input
              value={form.title}
              onChange={(event) => {
                updateField("title", event.target.value);
                setError("");
              }}
              placeholder="Titre de la tâche..."
              autoFocus
            />
            {error ? <small>{error}</small> : null}
          </label>

          <label>
            <span>Description</span>
            <div className="kanban-resize-wrap">
              <textarea
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                style={{ height: descHeight }}
                placeholder="Détails, notes, sous-tâches..."
              />
              <button
                type="button"
                className="kanban-resize-handle"
                aria-label="Redimensionner la description"
                onMouseDown={(event) => {
                  event.preventDefault();
                  const startY = event.clientY;
                  const startHeight = descHeight;
                  const handleMove = (moveEvent) => setDescHeight(Math.max(60, startHeight + moveEvent.clientY - startY));
                  const handleUp = () => {
                    document.removeEventListener("mousemove", handleMove);
                    document.removeEventListener("mouseup", handleUp);
                  };
                  document.addEventListener("mousemove", handleMove);
                  document.addEventListener("mouseup", handleUp);
                }}
              />
            </div>
          </label>

          <div className="kanban-form-grid">
            <label>
              <span>État</span>
              <KanbanSelect value={form.column} onChange={(value) => updateField("column", value)} options={columnOptions} />
            </label>
            <label>
              <span>Priorité</span>
              <KanbanSelect value={form.priority} onChange={(value) => updateField("priority", value)} options={priorityOptions} />
            </label>
          </div>

          <label>
            <span>Tag / Domaine</span>
            <KanbanSelect value={form.tag || ""} onChange={(value) => updateField("tag", value)} options={tagOptions} placeholder="Aucun tag" />
          </label>

          <div className="kanban-form-grid">
            <label>
              <span>Date de début</span>
              <KanbanDatePicker value={form.start_date || ""} onChange={(value) => updateField("start_date", value)} placeholder="JJ/MM/AA" />
            </label>
            <label>
              <span>Date d'échéance</span>
              <KanbanDatePicker value={form.due_date || ""} onChange={(value) => updateField("due_date", value)} placeholder="JJ/MM/AA" />
            </label>
          </div>
        </div>

        <div className="kanban-modal-actions">
          <button className="admin-button admin-button--primary" type="button" onClick={handleSave}>
            <Save aria-hidden="true" /> {card ? "Enregistrer" : "Créer"}
          </button>
          <button className="admin-button" type="button" onClick={onClose}>Annuler</button>
        </div>
      </motion.div>
    </div>
  );
}
