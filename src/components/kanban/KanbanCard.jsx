import { useEffect, useRef, useState } from "react";
import { Calendar, Trash2 } from "lucide-react";
import { formatKanbanDate } from "./kanbanConfig";

function InlineSelect({ value, options, onSave, renderTrigger }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
    <div ref={ref} className="kanban-inline-select" data-quickedit="true">
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

export default function KanbanCard({ card, priorities, tags, onEdit, onDelete, onQuickUpdate, onDragStart, onDragEnd }) {
  const priority = priorities.find((item) => item.id === card.priority) || priorities[2];
  const tag = tags.find((item) => item.id === card.tag);
  const priorityOptions = priorities.map((item) => ({ value: item.id, label: item.label, dot: item.color }));
  const tagOptions = [{ value: "", label: "- Aucun -" }, ...tags.map((item) => ({ value: item.id, label: item.label, dot: item.color }))];

  return (
    <article
      className="kanban-card"
      draggable
      onDragStart={(event) => onDragStart(event, card.id)}
      onDragEnd={onDragEnd}
      onClick={(event) => {
        if (event.target.closest("[data-quickedit]")) return;
        onEdit(card);
      }}
    >
      <div className="kanban-card-head">
        <h3>{card.title}</h3>
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
          onSave={(value) => onQuickUpdate(card.id, { tag: value })}
          renderTrigger={() => tag ? (
            <span className="kanban-tag" style={{ background: tag.color }}>{tag.label}</span>
          ) : (
            <span className="kanban-add-tag">+ tag</span>
          )}
        />
      </div>

      <div className="kanban-card-foot" data-quickedit="true">
        <InlineSelect
          value={card.priority}
          options={priorityOptions}
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
