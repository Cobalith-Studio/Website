import { CalendarPlus, Edit3, Eye, Trash2 } from "lucide-react";
import { countReviewCells } from "../scheduleUtils";

function formatSavedDate(value) {
  if (!value) return "Non validé";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default function ScheduleLibrary({ schedules, syncState, onCreate, onOpen, onEdit, onDelete }) {
  return (
    <section className="schedule-panel">
      <div className="schedule-library-head">
        <div>
          <span className="schedule-kicker">Plannings sauvegardés</span>
          <h2>Mes plannings</h2>
          <p>{syncState?.label || "Stockage local/cloud"}</p>
        </div>
        <button className="schedule-button schedule-button--accent" type="button" onClick={onCreate}>
          <CalendarPlus aria-hidden="true" /> Ajouter
        </button>
      </div>

      {schedules.length ? (
        <div className="schedule-library-list">
          {schedules.map((schedule) => {
            const reviewCount = countReviewCells(schedule);

            return (
              <article className="schedule-library-card" key={schedule.id}>
                <div>
                  <strong>{schedule.weekLabel}</strong>
                  <span>{schedule.people.length} personnes · validé le {formatSavedDate(schedule.validatedAt)}</span>
                  {reviewCount ? <em>{reviewCount} cellules encore à vérifier</em> : null}
                </div>
                <div className="schedule-library-actions">
                  <button type="button" onClick={() => onOpen(schedule)} aria-label="Voir le planning">
                    <Eye aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => onEdit(schedule)} aria-label="Modifier le planning">
                    <Edit3 aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => onDelete(schedule)} aria-label="Supprimer le planning">
                    <Trash2 aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="schedule-empty-state">
          <CalendarPlus aria-hidden="true" />
          <strong>Aucun planning sauvegardé</strong>
          <p>Ajoute une photo, vérifie les cellules ambiguës, puis valide pour conserver la semaine.</p>
        </div>
      )}
    </section>
  );
}
