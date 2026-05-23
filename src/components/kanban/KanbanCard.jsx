import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Calendar, Trash2 } from "lucide-react";
import { formatKanbanDate } from "./kanbanConfig";

function InlineSelect({ value, options, onSave, renderTrigger, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open) return undefined;

    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className={`kanban-inline-select ${open ? "is-open" : ""}`} data-quickedit="true">
      <div
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((current) => !current);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((current) => !current);
          }
        }}
      >
        {renderTrigger()}
      </div>
      {open ? (
        <div className="kanban-inline-menu">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={value === option.value ? "is-selected" : ""}
              onClick={(event) => {
                event.stopPropagation();
                onSave(option.value);
                setOpen(false);
              }}
            >
              {option.dot ? <i style={{ background: option.dot }} aria-hidden="true" /> : null}
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function withAlpha(hexColor, alphaHex) {
  if (!hexColor || !hexColor.startsWith("#") || hexColor.length !== 7) return `#64748b${alphaHex}`;
  return `${hexColor}${alphaHex}`;
}

export default function KanbanCard({ card, priorities, tags, onEdit, onDelete, onQuickUpdate, onDragStart, onDragEnd, onQuickEditOpenChange }) {
  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const priority = priorities.find((item) => item.id === card.priority) || priorities[2];
  const tag = tags.find((item) => item.id === card.tag);
  const priorityOptions = priorities.map((item) => ({ value: item.id, label: item.label, dot: item.color }));
  const tagOptions = [{ value: "", label: "- Aucun -" }, ...tags.map((item) => ({ value: item.id, label: item.label, dot: item.color }))];
  const tagColor = tag?.color || "#334155";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = Boolean(card.due_date && card.column !== "done" && new Date(`${card.due_date}T00:00:00`) < today);
  const handleQuickEditOpenChange = (open) => {
    setQuickEditOpen(open);
    onQuickEditOpenChange?.(card.id, open);
  };

  return (
    <article
      className={`kanban-card ${tag ? "kanban-card--tagged" : "kanban-card--neutral"} ${isOverdue ? "is-overdue" : ""} ${quickEditOpen ? "is-quick-edit-open" : ""}`}
      style={{
        "--kanban-card-tag": tagColor,
        "--kanban-card-bg": tag ? withAlpha(tagColor, "15") : "hsl(222 47% 9%)",
        "--kanban-card-border": tag ? withAlpha(tagColor, "60") : "hsl(222 47% 16%)",
        "--kanban-card-hover-shadow": tag ? withAlpha(tagColor, "32") : "#3b82f620"
      }}
      draggable
      onDragStart={(event) => onDragStart(event, card.id)}
      onDragEnd={onDragEnd}
      onClick={(event) => {
        if (event.target.closest("[data-quickedit]")) return;
        onEdit(card);
      }}
    >
      <div className="kanban-card-head">
        <div className="kanban-card-title-row">
          {isOverdue ? <AlertTriangle className="kanban-card-alert" aria-label="En retard" /> : null}
          <h3>{card.title}</h3>
        </div>
        <button
          type="button"
          data-quickedit="true"
          aria-label="Supprimer"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(card.id);
          }}
        >
          <Trash2 aria-hidden="true" />
        </button>
      </div>

      {card.description ? <p className="kanban-card-description">{card.description}</p> : null}

      <div className="kanban-card-tag">
        <InlineSelect
          value={card.tag || ""}
          options={tagOptions}
          onOpenChange={handleQuickEditOpenChange}
          onSave={(value) => onQuickUpdate(card.id, { tag: value })}
          renderTrigger={() => tag ? (
            <span className="kanban-tag" style={{ color: withAlpha(tag.color, "cc") }}>
              <i style={{ background: tag.color }} aria-hidden="true" />
              {tag.label}
            </span>
          ) : (
            <span className="kanban-add-tag">+ tag</span>
          )}
        />
      </div>

      <div className="kanban-card-foot">
        <InlineSelect
          value={card.priority}
          options={priorityOptions}
          onOpenChange={handleQuickEditOpenChange}
          onSave={(value) => onQuickUpdate(card.id, { priority: value })}
          renderTrigger={() => (
            <span
              className="kanban-priority"
              style={{
                background: `${priority?.color || "#64748b"}22`,
                borderColor: `${priority?.color || "#64748b"}55`,
                color: priority?.color || "#94a3b8"
              }}
            >
              {priority?.label || "Normal"}
            </span>
          )}
        />

        <div className="kanban-card-dates">
          {card.start_date ? (
            <span>
              <Calendar aria-hidden="true" />
              {formatKanbanDate(card.start_date)}
            </span>
          ) : null}
          {card.due_date ? (
            <span>
              {card.start_date ? <i aria-hidden="true">-&gt;</i> : <Calendar aria-hidden="true" />}
              {formatKanbanDate(card.due_date)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
