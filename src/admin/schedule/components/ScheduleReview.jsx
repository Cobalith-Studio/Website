import { AlertTriangle, Check, ClipboardCheck, Plus, Trash2 } from "lucide-react";
import { DAYS, SERVICES, STATUS_OPTIONS } from "../scheduleTypes";
import { countReviewCells, getStatusLabel } from "../scheduleUtils";

function buildShiftValue(parts) {
  if (!parts.start || !parts.end) return "";
  const breakValue = parts.breakStart && parts.breakEnd ? ` (pause ${parts.breakStart}-${parts.breakEnd})` : "";
  return `${parts.start}-${parts.end}${breakValue}`;
}

const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0"));

function getHourOptions(serviceKey) {
  const start = serviceKey === "dinner" ? 17 : 10;
  const end = serviceKey === "dinner" ? 23 : 16;
  return Array.from({ length: end - start + 1 }, (_, index) => String(start + index).padStart(2, "0"));
}

function splitTime(value) {
  const [hour = "", minute = ""] = String(value || "").split(":");
  return { hour, minute };
}

function joinTime(hour, minute) {
  if (!hour || !minute) return "";
  return `${hour}:${minute}`;
}

function TimeField({ label, value, serviceKey, onChange }) {
  const { hour, minute } = splitTime(value);
  const hourOptions = getHourOptions(serviceKey);

  return (
    <label className="schedule-time-field">
      <span>{label}</span>
      <div className="schedule-time-selects">
        <select value={hour} onChange={(event) => onChange(joinTime(event.target.value, minute || "00"))}>
          <option value="">--</option>
          {hourOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select value={minute} onChange={(event) => onChange(joinTime(hour || hourOptions[0], event.target.value))}>
          <option value="">--</option>
          {MINUTE_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </label>
  );
}

function ServiceEditor({ cell, serviceKey, onChange }) {
  const shift = {
    start: cell.start || "",
    end: cell.end || "",
    breakStart: cell.breakStart || "",
    breakEnd: cell.breakEnd || ""
  };

  function updateShift(patch) {
    const next = { ...shift, ...patch };
    onChange({
      value: buildShiftValue(next),
      status: "work",
      start: next.start,
      end: next.end,
      breakStart: next.breakStart,
      breakEnd: next.breakEnd,
      confidence: next.start && next.end ? 1 : 0.45,
      needsReview: !(next.start && next.end)
    });
  }

  function setStatus(status) {
    if (status === "rest") {
      onChange({
        status: "rest",
        value: "Repos",
        start: "",
        end: "",
        breakStart: "",
        breakEnd: "",
        confidence: 1,
        needsReview: false
      });
      return;
    }

    onChange({
      status: "work",
      value: buildShiftValue(shift),
      start: shift.start,
      end: shift.end,
      breakStart: shift.breakStart,
      breakEnd: shift.breakEnd,
      confidence: shift.start && shift.end ? 1 : 0.45,
      needsReview: !(shift.start && shift.end)
    });
  }

  return (
    <div className={`schedule-service-editor schedule-service-editor--${cell.status} ${cell.needsReview ? "needs-review" : ""}`}>
      <div className="schedule-service-topline">
        <span>{getStatusLabel(cell.status)}</span>
        <em>{Math.round((cell.confidence || 0) * 100)}%</em>
      </div>
      <div className="schedule-status-segments">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cell.status === option.value ? "is-active" : ""}
            onClick={() => setStatus(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {cell.status !== "rest" ? (
        <div className="schedule-time-grid">
          <TimeField label="Debut" value={shift.start} serviceKey={serviceKey} onChange={(value) => updateShift({ start: value })} />
          <TimeField label="Fin" value={shift.end} serviceKey={serviceKey} onChange={(value) => updateShift({ end: value })} />
          <TimeField label="Pause debut" value={shift.breakStart} serviceKey={serviceKey} onChange={(value) => updateShift({ breakStart: value })} />
          <TimeField label="Pause fin" value={shift.breakEnd} serviceKey={serviceKey} onChange={(value) => updateShift({ breakEnd: value })} />
        </div>
      ) : null}
      {cell.needsReview ? (
        <button className="schedule-mark-checked" type="button" onClick={() => onChange({ confidence: 1, needsReview: false })}>
          <Check aria-hidden="true" /> OK
        </button>
      ) : null}
    </div>
  );
}

export default function ScheduleReview({ schedule, onCellChange, onPersonNameChange, onPersonDelete, onPersonAdd, onValidate }) {
  const reviewCount = countReviewCells(schedule);

  return (
    <section className="schedule-panel">
      <div className="schedule-section-head">
        <div>
          <span className="schedule-kicker">Vérification</span>
          <h2>{schedule.weekLabel}</h2>
        </div>
        <span className={`schedule-review-count ${reviewCount ? "has-warning" : ""}`}>
          {reviewCount ? <AlertTriangle aria-hidden="true" /> : <ClipboardCheck aria-hidden="true" />}
          {reviewCount} cellule{reviewCount > 1 ? "s" : ""} à vérifier
        </span>
      </div>

      <button className="schedule-button schedule-add-person-button" type="button" onClick={onPersonAdd}>
        <Plus aria-hidden="true" /> Ajouter une personne
      </button>

      <div className="schedule-review-list">
        {schedule.people.map((person) => (
          <article className="schedule-person-review" key={person.id}>
            <header>
              <input
                className="schedule-person-name-input"
                type="text"
                value={person.name}
                onChange={(event) => onPersonNameChange(person.id, event.target.value)}
                aria-label="Nom de la personne"
              />
              <span>{person.role}</span>
              <button className="schedule-person-delete" type="button" onClick={() => onPersonDelete(person.id)} aria-label="Supprimer cette personne">
                <Trash2 aria-hidden="true" />
              </button>
            </header>
            <div className="schedule-day-stack">
              {DAYS.map((day) => (
                <div className="schedule-review-day" key={day.key}>
                  <h3>{day.label}</h3>
                  <div className="schedule-service-grid">
                    {SERVICES.map((service) => (
                      <label key={service.key}>
                        <span>{service.label}</span>
                        <ServiceEditor
                          cell={person.days[day.key][service.key]}
                          serviceKey={service.key}
                          onChange={(patch) => onCellChange(person.id, day.key, service.key, patch)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="schedule-sticky-actions">
        <button className="schedule-button schedule-button--accent" type="button" onClick={onValidate}>
          <ClipboardCheck aria-hidden="true" /> Valider le planning
        </button>
      </div>
    </section>
  );
}
