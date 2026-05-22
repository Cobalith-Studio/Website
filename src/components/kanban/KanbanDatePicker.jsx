import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { formatKanbanDate } from "./kanbanConfig";

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

export default function KanbanDatePicker({ value, onChange, placeholder = "Choisir une date" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const today = new Date();
  const initialDate = value ? new Date(`${value}T00:00:00`) : today;
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

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

  useEffect(() => {
    if (!value) return;
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return;
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
  }, [value]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  const selectedDay = value ? new Date(`${value}T00:00:00`) : null;

  function isSelected(day) {
    return selectedDay
      && selectedDay.getFullYear() === viewYear
      && selectedDay.getMonth() === viewMonth
      && selectedDay.getDate() === day;
  }

  function isToday(day) {
    return today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
  }

  function pickDate(day) {
    onChange(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    setOpen(false);
  }

  function previousMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
    } else {
      setViewMonth((month) => month - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
    } else {
      setViewMonth((month) => month + 1);
    }
  }

  return (
    <div ref={ref} className="kanban-date">
      <button type="button" className="kanban-date-trigger" onClick={() => setOpen((current) => !current)}>
        <Calendar aria-hidden="true" />
        <span className={value ? "" : "is-placeholder"}>{formatKanbanDate(value) || placeholder}</span>
        {value ? (
          <button
            type="button"
            aria-label="Effacer la date"
            onClick={(event) => {
              event.stopPropagation();
              onChange("");
            }}
          >
            <X aria-hidden="true" />
          </button>
        ) : null}
      </button>

      {open ? (
        <div className="kanban-calendar">
          <div className="kanban-calendar-head">
            <button type="button" onClick={previousMonth} aria-label="Mois précédent">
              <ChevronLeft aria-hidden="true" />
            </button>
            <strong>{MONTHS[viewMonth]} {viewYear}</strong>
            <button type="button" onClick={nextMonth} aria-label="Mois suivant">
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
          <div className="kanban-calendar-days">
            {DAYS.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="kanban-calendar-grid">
            {cells.map((day, index) => day ? (
              <button
                type="button"
                key={`${day}-${index}`}
                className={`${isSelected(day) ? "is-selected" : ""} ${isToday(day) ? "is-today" : ""}`}
                onClick={() => pickDate(day)}
              >
                {day}
              </button>
            ) : <span key={`empty-${index}`} />)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
