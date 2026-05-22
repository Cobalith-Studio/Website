import { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Plus, Save, Trash2, X } from "lucide-react";

const PALETTE = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#64748b"];

function EditableList({ items, onChange, addLabel }) {
  const [draggingId, setDraggingId] = useState(null);

  function addItem() {
    onChange([...items, { id: Date.now().toString(16), label: "", color: PALETTE[0] }]);
  }

  function updateItem(id, patch) {
    onChange(items.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  function removeItem(id) {
    onChange(items.filter((item) => item.id !== id));
  }

  function moveItem(targetId) {
    if (!draggingId || draggingId === targetId) return;
    const nextItems = [...items];
    const fromIndex = nextItems.findIndex((item) => item.id === draggingId);
    const toIndex = nextItems.findIndex((item) => item.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, moved);
    onChange(nextItems);
  }

  return (
    <div className="kanban-settings-list">
      {items.map((item) => (
        <div
          key={item.id}
          className="kanban-settings-item"
          draggable
          onDragStart={() => setDraggingId(item.id)}
          onDragEnd={() => setDraggingId(null)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => moveItem(item.id)}
        >
          <GripVertical aria-hidden="true" />
          <input value={item.label} onChange={(event) => updateItem(item.id, { label: event.target.value })} placeholder="Libellé..." />
          <div className="kanban-color-row">
            {PALETTE.map((color) => (
              <button
                type="button"
                key={color}
                className={item.color === color ? "is-selected" : ""}
                style={{ background: color }}
                onClick={() => updateItem(item.id, { color })}
                aria-label={`Couleur ${color}`}
              />
            ))}
          </div>
          <button type="button" className="kanban-settings-delete" onClick={() => removeItem(item.id)} aria-label="Supprimer">
            <Trash2 aria-hidden="true" />
          </button>
        </div>
      ))}
      <button type="button" className="kanban-settings-add" onClick={addItem}>
        <Plus aria-hidden="true" /> {addLabel}
      </button>
    </div>
  );
}

export default function KanbanSettings({ priorities, tags, onSave, onClose }) {
  const [priorityList, setPriorityList] = useState(priorities);
  const [tagList, setTagList] = useState(tags);

  function handleSave() {
    const cleanPriorities = priorityList.filter((item) => item.label.trim()).map((item) => ({ ...item, label: item.label.trim() }));
    const cleanTags = tagList.filter((item) => item.label.trim()).map((item) => ({ ...item, label: item.label.trim() }));
    onSave(cleanPriorities, cleanTags);
  }

  return (
    <div className="admin-modal-backdrop">
      <motion.div className="kanban-modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="kanban-modal-head">
          <h2>Paramètres du Kanban</h2>
          <button type="button" onClick={onClose} aria-label="Fermer">
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="kanban-settings-body">
          <section>
            <h3>Priorités <span>- glissez pour réordonner</span></h3>
            <EditableList items={priorityList} onChange={setPriorityList} addLabel="Ajouter une priorité" />
          </section>
          <section>
            <h3>Tags / Domaines <span>- glissez pour réordonner</span></h3>
            <EditableList items={tagList} onChange={setTagList} addLabel="Ajouter un tag" />
          </section>
        </div>

        <div className="kanban-modal-actions">
          <button className="admin-button admin-button--primary" type="button" onClick={handleSave}>
            <Save aria-hidden="true" /> Enregistrer
          </button>
          <button className="admin-button" type="button" onClick={onClose}>Annuler</button>
        </div>
      </motion.div>
    </div>
  );
}
