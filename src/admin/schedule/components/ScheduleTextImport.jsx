import { Clipboard, FilePlus, Keyboard } from "lucide-react";
import { CHATGPT_SCHEDULE_PROMPT } from "../scheduleTextImport";

export default function ScheduleTextImport({ value, error, onChange, onImport, onCreateBlank }) {
  async function copyPrompt() {
    await navigator.clipboard.writeText(CHATGPT_SCHEDULE_PROMPT);
  }

  return (
    <section className="schedule-panel schedule-upload-panel">
      <div className="schedule-upload-copy">
        <span className="schedule-kicker">Import texte</span>
        <h2>Ajouter un planning</h2>
        <p>Copie le prompt, envoie-le a ChatGPT avec la photo du planning, puis colle ici le JSON obtenu.</p>
      </div>

      <div className="schedule-prompt-box">
        <div>
          <strong>Prompt ChatGPT</strong>
          <span>Utilise ce prompt avec ton image de planning.</span>
        </div>
        <button className="schedule-button schedule-button--primary" type="button" onClick={copyPrompt}>
          <Clipboard aria-hidden="true" /> Copier le prompt
        </button>
      </div>

      <textarea
        className="schedule-text-import"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder='Colle ici le JSON, par exemple: {"weekLabel":"Semaine du ...","people":[...]}'
      />

      {error ? <p className="schedule-error">{error}</p> : null}

      <div className="schedule-action-row">
        <button className="schedule-button schedule-button--accent" type="button" onClick={onImport}>
          <FilePlus aria-hidden="true" /> Importer le planning
        </button>
        <button className="schedule-button" type="button" onClick={onCreateBlank}>
          <Keyboard aria-hidden="true" /> Saisie manuelle
        </button>
      </div>
    </section>
  );
}
