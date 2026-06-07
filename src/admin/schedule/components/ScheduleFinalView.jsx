import { CalendarPlus, ChevronLeft, ChevronRight, Edit3, Trash2, UserRound } from "lucide-react";
import { DAYS, SERVICES } from "../scheduleTypes";

function getShiftText(cell) {
  if (!cell || cell.status === "unknown") return "A corriger";
  if (cell.status === "rest") return "Repos";
  if (cell.start && cell.end) return `${cell.start}-${cell.end}`;
  return cell.value?.replace(/\s*\(pause[^)]*\)/i, "") || "Travail";
}

function getBreakText(cell) {
  if (!cell?.breakStart || !cell?.breakEnd) return "";
  return `Pause ${cell.breakStart}-${cell.breakEnd}`;
}

function ShiftLine({ service, cell, compact = false }) {
  const isWork = cell?.status === "work";
  const isUnknown = !cell || cell.status === "unknown" || cell.needsReview;

  return (
    <div className={`schedule-week-shift schedule-week-shift--${cell?.status || "unknown"} ${isUnknown ? "needs-review" : ""} ${compact ? "is-compact" : ""}`}>
      <span>{service.label}</span>
      <strong>{getShiftText(cell)}</strong>
      {isWork && getBreakText(cell) ? <em>{getBreakText(cell)}</em> : null}
    </div>
  );
}

function getWorkingColleagues(schedule, selectedPersonId, dayKey, serviceKey) {
  return schedule.people.filter((person) => {
    if (person.id === selectedPersonId) return false;
    return person.days?.[dayKey]?.[serviceKey]?.status === "work";
  });
}

function DayCard({ schedule, day, selectedPerson, showGlobal }) {
  if (showGlobal) {
    return (
      <article className="schedule-week-day-card">
        <header>
          <strong>{day.label}</strong>
          <span>{schedule.people.length} personnes</span>
        </header>
        <div className="schedule-global-service-list">
          {SERVICES.map((service) => (
            <section key={service.key}>
              <h3>{service.label}</h3>
              {schedule.people.map((person) => (
                <div className="schedule-colleague-row" key={`${person.id}-${service.key}`}>
                  <span>{person.name}</span>
                  <ShiftLine service={service} cell={person.days?.[day.key]?.[service.key]} compact />
                </div>
              ))}
            </section>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article className="schedule-week-day-card">
      <header>
        <strong>{day.label}</strong>
        <span>{selectedPerson?.name || "Personne"}</span>
      </header>

      <div className="schedule-day-service-stack">
        {SERVICES.map((service) => {
          const selectedCell = selectedPerson?.days?.[day.key]?.[service.key];
          const selectedWorks = selectedCell?.status === "work";
          const colleagues = selectedWorks ? getWorkingColleagues(schedule, selectedPerson?.id, day.key, service.key) : [];

          return (
            <section className={`schedule-day-service-block ${selectedWorks ? "is-working" : ""}`} key={service.key}>
              <h3>{service.label}</h3>
              <ShiftLine service={service} cell={selectedCell} />
              {selectedWorks ? (
                <div className="schedule-colleagues-block">
                  <h4>Collegues sur ce service</h4>
                  {colleagues.length ? colleagues.map((person) => (
                    <div className="schedule-colleague-row" key={`${person.id}-${service.key}`}>
                      <span>{person.name}</span>
                      <ShiftLine service={service} cell={person.days[day.key][service.key]} compact />
                    </div>
                  )) : <p>Aucun collegue en service.</p>}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </article>
  );
}

export default function ScheduleFinalView({ schedule, selectedPersonId, weekLabel, onSelectedPersonChange, onPreviousWeek, onNextWeek, onEdit, onDelete, onCreate }) {
  const selectedPerson = schedule?.people?.find((person) => person.id === selectedPersonId) || schedule?.people?.find((person) => person.name.toLowerCase().includes("leo")) || schedule?.people?.[0];
  const showGlobal = selectedPersonId === "global";

  return (
    <section className="schedule-panel schedule-week-panel">
      <div className="schedule-week-nav">
        <button className="schedule-icon-button" type="button" onClick={onPreviousWeek} aria-label="Semaine precedente">
          <ChevronLeft aria-hidden="true" />
        </button>
        <div>
          <span className="schedule-kicker">Semaine affichee</span>
          <h2>{schedule?.weekLabel || weekLabel}</h2>
        </div>
        <button className="schedule-icon-button" type="button" onClick={onNextWeek} aria-label="Semaine suivante">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>

      {!schedule ? (
        <div className="schedule-empty-state schedule-empty-state--week">
          <CalendarPlus aria-hidden="true" />
          <strong>Aucun planning pour cette semaine</strong>
          <p>Utilise Ajouter pour importer le JSON de cette semaine.</p>
          <button className="schedule-button schedule-button--accent" type="button" onClick={onCreate}>
            <CalendarPlus aria-hidden="true" /> Ajouter ce planning
          </button>
        </div>
      ) : (
        <>
          <div className="schedule-focus-toolbar">
            <label className="schedule-focus-select">
              <UserRound aria-hidden="true" />
              <select value={showGlobal ? "global" : selectedPerson?.id || ""} onChange={(event) => onSelectedPersonChange(event.target.value)}>
                <option value="global">Planning global</option>
                {schedule.people.map((person) => (
                  <option key={person.id} value={person.id}>{person.name}</option>
                ))}
              </select>
            </label>
            <div className="schedule-week-actions">
              <button className="schedule-button" type="button" onClick={onEdit}>
                <Edit3 aria-hidden="true" /> Modifier
              </button>
              <button className="schedule-button schedule-button--danger" type="button" onClick={onDelete}>
                <Trash2 aria-hidden="true" /> Supprimer
              </button>
            </div>
          </div>

          <div className="schedule-week-days">
            {DAYS.map((day) => (
              <DayCard key={day.key} schedule={schedule} day={day} selectedPerson={selectedPerson} showGlobal={showGlobal} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
