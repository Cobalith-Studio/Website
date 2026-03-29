import { useMemo, useState } from "react";
import CustomSelect from "../ui/CustomSelect";
import {
  findClosestWineRecipes,
  formatWineStepSummary,
  getAllWineAromaOptions,
  getCepageOptions,
  getSearchContextFields,
  getWineDistinctiveStyleOptions,
  wineOutputPalette
} from "../../lib/wineEngine";

const typeOptions = [
  { value: "", label: "Sans importance" },
  { value: "Effervescent", label: "Effervescent" },
  { value: "Blanc", label: "Blanc" },
  { value: "Blanc de Noirs", label: "Blanc de Noirs" },
  { value: "Vin Orange", label: "Vin orange" },
  { value: "Rose", label: "Rosé" },
  { value: "Rouge", label: "Rouge" },
  { value: "Liquoreux", label: "Liquoreux" }
];

const rangeDefinitions = [
  { key: "alcohol", label: "Alcool % vol", min: 0, max: 15.5, step: 0.5, suffix: "%" },
  { key: "sugar", label: "Sucre g/L", min: 0, max: 135, step: 0.1, suffix: " g/L" },
  { key: "acidity", label: "Acidité", min: 0, max: 13, step: 0.1, suffix: "" },
  { key: "tannins", label: "Tanins", min: 0, max: 265, step: 0.1, suffix: "" }
];

function formatRangeValue(value, suffix = "") {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}${suffix}`;
}

function normalizeRangeValue(value) {
  const rounded = Number(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function clampRangeValue(value, min, max) {
  return Math.max(min, Math.min(max, Number(value.toFixed(1))));
}

function StepIcon({ type }) {
  return (
    <svg viewBox="0 0 12 12" className="wine-step-button-icon" aria-hidden="true">
      <path d="M2.5 6h7" />
      {type === "plus" ? <path d="M6 2.5v7" /> : null}
    </svg>
  );
}

function MultiAddField({
  label,
  options,
  selected,
  pendingValue,
  onPendingChange,
  onAdd,
  onRemove,
  placeholder,
  priorityMode,
  priorityKey,
  onPriorityToggle
}) {
  const isPriorityActive = priorityMode === priorityKey;
  return (
    <div className="field wine-add-field">
      <div className="wine-add-head">
        <span>{label}</span>
        <button
          type="button"
          className={`wine-priority-button ${isPriorityActive ? "wine-priority-button--active" : ""}`}
          onClick={onPriorityToggle}
          disabled={!selected.length}
        >
          Priorité
        </button>
      </div>
      <div className="wine-add-row">
        <CustomSelect value={pendingValue} onChange={onPendingChange} options={options} placeholder={placeholder} />
        <button type="button" className="button button-secondary wine-add-button" onClick={onAdd} disabled={!pendingValue}>
          Ajouter
        </button>
      </div>
      {selected.length ? (
        <div className="profile-pill-grid">
          {selected.map((item) => (
            <button key={item.value} type="button" className="profile-pill profile-pill-button" onClick={() => onRemove(item.value)}>
              {item.label} ×
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RangeSliderField({ definition, minValue, maxValue, onMinChange, onMaxChange }) {
  const span = definition.max - definition.min;
  const minPercent = ((minValue - definition.min) / span) * 100;
  const maxPercent = ((maxValue - definition.min) / span) * 100;
  const minDown = () => onMinChange(clampRangeValue(minValue - definition.step, definition.min, maxValue));
  const minUp = () => onMinChange(clampRangeValue(minValue + definition.step, definition.min, maxValue));
  const maxDown = () => onMaxChange(clampRangeValue(maxValue - definition.step, minValue, definition.max));
  const maxUp = () => onMaxChange(clampRangeValue(maxValue + definition.step, minValue, definition.max));
  return (
    <div className="wine-range-field wine-range-field--slider">
      <div className="wine-range-head">
        <span>{definition.label}</span>
        <div className="wine-range-values">
          <div className="wine-range-stepper">
            <small>Min</small>
            <button type="button" className="wine-step-button" onClick={minDown} disabled={minValue <= definition.min}><StepIcon type="minus" /></button>
            <strong>{formatRangeValue(minValue, definition.suffix)}</strong>
            <button type="button" className="wine-step-button" onClick={minUp} disabled={minValue >= maxValue}><StepIcon type="plus" /></button>
          </div>
          <div className="wine-range-stepper">
            <small>Max</small>
            <button type="button" className="wine-step-button" onClick={maxDown} disabled={maxValue <= minValue}><StepIcon type="minus" /></button>
            <strong>{formatRangeValue(maxValue, definition.suffix)}</strong>
            <button type="button" className="wine-step-button" onClick={maxUp} disabled={maxValue >= definition.max}><StepIcon type="plus" /></button>
          </div>
        </div>
      </div>
      <div className="wine-dual-range">
        <div className="wine-dual-range-track" />
        <div
          className="wine-dual-range-fill"
          style={{ left: `${minPercent}%`, width: `${Math.max(0, maxPercent - minPercent)}%` }}
        />
        <input
          type="range"
          min={definition.min}
          max={definition.max}
          step={definition.step}
          value={minValue}
          onChange={(event) => onMinChange(Number(event.target.value))}
          className="wine-dual-range-input"
        />
        <input
          type="range"
          min={definition.min}
          max={definition.max}
          step={definition.step}
          value={maxValue}
          onChange={(event) => onMaxChange(Number(event.target.value))}
          className="wine-dual-range-input"
        />
      </div>
      <div className="wine-range-extremes">
        <small>{formatRangeValue(definition.min, definition.suffix)}</small>
        <small>{formatRangeValue(definition.max, definition.suffix)}</small>
      </div>
    </div>
  );
}

export default function WineRecipeFinder() {
  const [context, setContext] = useState({ soil: "", sun: "", rain: "" });
  const [criteria, setCriteria] = useState({
    cepageId: "",
    type: "",
    distinctiveStyles: [],
    alcoholMin: 0,
    alcoholMax: 15.5,
    sugarMin: 0,
    sugarMax: 135,
    acidityMin: 0,
    acidityMax: 13,
    tanninsMin: 0,
    tanninsMax: 265,
    aromaNotes: [],
    priorityMode: ""
  });
  const [pendingAroma, setPendingAroma] = useState("");
  const [pendingStyle, setPendingStyle] = useState("");
  const [results, setResults] = useState(null);
  const [isComputing, setIsComputing] = useState(false);

  const contextFields = useMemo(() => getSearchContextFields(), []);
  const aromaOptions = useMemo(() => getAllWineAromaOptions(), []);
  const styleOptions = useMemo(() => getWineDistinctiveStyleOptions(), []);

  const selectedAromaItems = criteria.aromaNotes.map((value) => aromaOptions.find((option) => option.value === value) ?? { value, label: value });
  const selectedStyleItems = criteria.distinctiveStyles.map((value) => styleOptions.find((option) => option.value === value) ?? { value, label: value });

  function updateContext(key, value) {
    setContext((current) => ({ ...current, [key]: value }));
  }

  function updateCriteria(key, value) {
    setCriteria((current) => ({ ...current, [key]: value }));
  }

  function updateRange(key, bound, nextValue) {
    setCriteria((current) => {
      const minKey = `${key}Min`;
      const maxKey = `${key}Max`;
      if (bound === "Min") {
        return {
          ...current,
          [minKey]: Math.min(nextValue, current[maxKey])
        };
      }
      return {
        ...current,
        [maxKey]: Math.max(nextValue, current[minKey])
      };
    });
  }

  function addArrayValue(key, pendingValue, reset) {
    if (!pendingValue) {
      return;
    }
    setCriteria((current) => ({
      ...current,
      [key]: current[key].includes(pendingValue) ? current[key] : [...current[key], pendingValue]
    }));
    reset("");
  }

  function removeArrayValue(key, value) {
    setCriteria((current) => {
      const nextValues = current[key].filter((item) => item !== value);
      const nextPriorityMode =
        (key === "aromaNotes" && current.priorityMode === "aromas" && !nextValues.length) ||
        (key === "distinctiveStyles" && current.priorityMode === "styles" && !nextValues.length)
          ? ""
          : current.priorityMode;
      return {
        ...current,
        [key]: nextValues,
        priorityMode: nextPriorityMode
      };
    });
  }

  function togglePriorityMode(mode) {
    setCriteria((current) => ({
      ...current,
      priorityMode: current.priorityMode === mode ? "" : mode
    }));
  }

  function computeRecipes() {
    setIsComputing(true);

    window.setTimeout(() => {
      const normalizedCriteria = {
        ...criteria,
        alcoholMin: normalizeRangeValue(criteria.alcoholMin),
        alcoholMax: normalizeRangeValue(criteria.alcoholMax),
        sugarMin: normalizeRangeValue(criteria.sugarMin),
        sugarMax: normalizeRangeValue(criteria.sugarMax),
        acidityMin: normalizeRangeValue(criteria.acidityMin),
        acidityMax: normalizeRangeValue(criteria.acidityMax),
        tanninsMin: normalizeRangeValue(criteria.tanninsMin),
        tanninsMax: normalizeRangeValue(criteria.tanninsMax)
      };
      setResults(findClosestWineRecipes(context, normalizedCriteria));
      setIsComputing(false);
    }, 0);
  }

  const displayedResults = results?.slice(0, 3) ?? null;

  return (
    <div className="wine-finder-page">
      <section className="panel beer-panel beer-panel--input wine-finder-criteria-panel">
        <div className="panel-heading">
          <p className="panel-kicker">Trouver la recette</p>
          <h2>On part du vin final souhaité</h2>
          <p>Tu fixes les contraintes utiles, puis tu lances explicitement le calcul des recettes les plus proches.</p>
        </div>

        <div className="wine-finder-criteria-grid">
          <div className="beer-subpanel wine-finder-criteria-column">
            <h3>Contexte + profil</h3>
            <div className="field-grid">
              {contextFields.map((field) => (
                <label className="field" key={field.key}>
                  <span>{field.label}</span>
                  <CustomSelect
                    value={context[field.key]}
                    onChange={(value) => updateContext(field.key, value)}
                    options={field.options}
                  />
                </label>
              ))}
              <label className="field">
                <span>Cépage</span>
                <CustomSelect
                  value={criteria.cepageId}
                  onChange={(value) => updateCriteria("cepageId", value)}
                  options={[{ value: "", label: "Sans importance" }, ...getCepageOptions()]}
                />
              </label>
            </div>
            <MultiAddField
              label="Styles distinctifs"
              options={styleOptions.filter((option) => !criteria.distinctiveStyles.includes(option.value))}
              selected={selectedStyleItems}
              pendingValue={pendingStyle}
              onPendingChange={setPendingStyle}
              onAdd={() => addArrayValue("distinctiveStyles", pendingStyle, setPendingStyle)}
              onRemove={(value) => removeArrayValue("distinctiveStyles", value)}
              placeholder="Ajouter un style"
              priorityMode={criteria.priorityMode}
              priorityKey="styles"
              onPriorityToggle={() => togglePriorityMode("styles")}
            />
            <MultiAddField
              label="Notes aromatiques"
              options={aromaOptions.filter((option) => !criteria.aromaNotes.includes(option.value))}
              selected={selectedAromaItems}
              pendingValue={pendingAroma}
              onPendingChange={setPendingAroma}
              onAdd={() => addArrayValue("aromaNotes", pendingAroma, setPendingAroma)}
              onRemove={(value) => removeArrayValue("aromaNotes", value)}
              placeholder="Ajouter une note"
              priorityMode={criteria.priorityMode}
              priorityKey="aromas"
              onPriorityToggle={() => togglePriorityMode("aromas")}
            />
          </div>

          <div className="beer-subpanel wine-finder-criteria-column">
            <h3>Propriétés ciblées</h3>
            <div className="field-grid">
              <label className="field">
                <span>Type</span>
                <CustomSelect value={criteria.type} onChange={(value) => updateCriteria("type", value)} options={typeOptions} />
              </label>
            </div>
            <div className="wine-range-layout">
              {rangeDefinitions.map((definition) => (
                <RangeSliderField
                  key={definition.key}
                  definition={definition}
                  minValue={criteria[`${definition.key}Min`]}
                  maxValue={criteria[`${definition.key}Max`]}
                  onMinChange={(value) => updateRange(definition.key, "Min", value)}
                  onMaxChange={(value) => updateRange(definition.key, "Max", value)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="wine-finder-actions wine-finder-actions--full">
          <button type="button" className="button button-primary" onClick={computeRecipes} disabled={isComputing}>
            {isComputing ? "Calcul en cours..." : "Calculer les recettes"}
          </button>
        </div>
      </section>

      <section className="panel beer-panel beer-panel--result wine-finder-results-panel">
        <div className="panel-heading">
          <p className="panel-kicker">Suggestions</p>
          <h2>Top 3 des recettes proches</h2>
          <p>Classement par écart global entre ton objectif et les sorties calculables du système.</p>
        </div>

        {isComputing ? (
          <div className="wine-finder-empty">
            <div className="graph-loading-spinner" aria-hidden="true" />
            <p>Recherche des recettes les plus proches...</p>
          </div>
        ) : results === null ? (
          <div className="wine-finder-empty">
            <p>Renseigne les critères utiles puis clique sur le bouton de calcul pour lancer la recherche.</p>
          </div>
        ) : (
          <div className="wine-finder-grid">
            {displayedResults.map((recipe, index) => {
              const steps = formatWineStepSummary(recipe.assignment, recipe.context);
              const tags = [
                ...recipe.aromas.map((item) => ({ value: item, kind: "aroma" })),
                ...recipe.distinctiveStyles.map((item) => ({ value: item, kind: "style" }))
              ];
              return (
                <article className="result-card beer-result-card wine-match-card" key={`${recipe.cepage.id}-${index}-${recipe.score}`}>
                  <div className="beer-stat-row">
                    <div>
                      <p className="panel-kicker">Proposition {index + 1}</p>
                      <h3>{recipe.type === "Rose" ? "Rosé" : recipe.type}</h3>
                    </div>
                    <div className="wine-color-chip" style={{ background: wineOutputPalette[recipe.type] ?? recipe.color }} />
                  </div>
                  <p className="wine-match-title">{recipe.cepage.name} · adéquation {recipe.scorePercent.toFixed(1)}%</p>
                  <dl className="metric-list">
                    <div><dt>Alcool</dt><dd>{recipe.alcohol.toFixed(1)}%</dd></div>
                    <div><dt>Sucre</dt><dd>{recipe.sugar.toFixed(1)} g/L</dd></div>
                    <div><dt>Acidité</dt><dd>{recipe.acidity.toFixed(1)}</dd></div>
                    <div><dt>Tanins</dt><dd>{recipe.tannins.toFixed(1)}</dd></div>
                  </dl>
                  {tags.length ? (
                    <div className="profile-pill-grid">
                      {tags.map((item) => (
                        <span className={`profile-pill ${item.kind === "style" ? "wine-style-pill" : ""}`} key={`${item.kind}-${item.value}`}>{item.value}</span>
                      ))}
                    </div>
                  ) : null}
                  <div className="wine-step-summary">
                    {steps.map((step) => (
                      <div className="wine-step-row" key={step.id}>
                        <span>{step.label}</span>
                        <strong>{step.value}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
