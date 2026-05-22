import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function KanbanSelect({ value, onChange, options, placeholder = "Choisir...", className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={`kanban-select ${className}`}>
      <button type="button" className="kanban-select-trigger" onClick={() => setOpen((current) => !current)}>
        <span>
          {selected?.dot ? <i style={{ background: selected.dot }} aria-hidden="true" /> : null}
          {selected?.label || <em>{placeholder}</em>}
        </span>
        <ChevronDown className={open ? "is-open" : ""} aria-hidden="true" />
      </button>

      {open ? (
        <div className="kanban-select-menu">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={option.value === value ? "is-selected" : ""}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.dot ? <i style={{ background: option.dot }} aria-hidden="true" /> : null}
              <span>{option.label}</span>
              {option.value === value ? <Check aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
