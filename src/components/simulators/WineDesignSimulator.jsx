import { useMemo, useState } from "react";
import CustomSelect from "../ui/CustomSelect";
import RadarChart from "../ui/RadarChart";
import {
  createDefaultAssignment,
  createDefaultContext,
  getCepageOptions,
  getContextFields,
  getOrderedWineSteps,
  simulateWineRecipe,
  wineOutputPalette
} from "../../lib/wineEngine";

const elevageTypeOptions = [
  { value: "inox", label: "Cuve inox" },
  { value: "french_oak", label: "Fût français" },
  { value: "american_oak", label: "Fût américain" }
];

const elevageDurationOptions = [
  { value: "short", label: "Courte" },
  { value: "long", label: "Longue" }
];

const elevageChauffeOptions = [
  { value: "light", label: "Légère" },
  { value: "medium", label: "Moyenne" },
  { value: "strong", label: "Forte" }
];

function Gauge({ label, value, suffix, percent, helper, toneClass }) {
  return (
    <div className="metric-gauge">
      <div className="metric-gauge-head">
        <span>{label}</span>
        <strong>
          {value}
          {suffix}
        </strong>
      </div>
      <div className="metric-gauge-track">
        <div className={`metric-gauge-fill ${toneClass}`} style={{ width: `${percent}%` }} />
      </div>
      <small>{helper}</small>
    </div>
  );
}

export default function WineDesignSimulator() {
  const [context, setContext] = useState(createDefaultContext);
  const [cepageId, setCepageId] = useState("chardonnay");
  const [assignment, setAssignment] = useState(createDefaultAssignment);

  const steps = useMemo(() => getOrderedWineSteps(assignment), [assignment]);
  const result = useMemo(() => simulateWineRecipe(cepageId, context, assignment), [assignment, cepageId, context]);

  function updateContext(key, value) {
    setContext((current) => ({ ...current, [key]: value }));
  }

  function updateStep(key, value) {
    setAssignment((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="beer-simulator-grid wine-design-grid">
      <section className="panel beer-panel beer-panel--input">
        <div className="panel-heading">
          <p className="panel-kicker">Concevoir un vin</p>
          <h2>Parcours direct d&apos;une recette unique</h2>
          <p>On suit un seul chemin de vinification du terroir jusqu&apos;à l&apos;élevage, avec un résultat final unique et complet.</p>
        </div>

        <div className="beer-section-grid">
          <div className="beer-subpanel">
            <h3>Base et terroir</h3>
            <div className="field-grid">
              <label className="field">
                <span>Cépage</span>
                <CustomSelect value={cepageId} onChange={setCepageId} options={getCepageOptions()} />
              </label>
              {getContextFields().map((field) => (
                <label className="field" key={field.key}>
                  <span>{field.label}</span>
                  <CustomSelect
                    value={context[field.key]}
                    onChange={(value) => updateContext(field.key, value)}
                    options={field.options}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="beer-subpanel">
            <h3>Processus de vinification</h3>
            <div className="field-grid">
              {steps.map((step) => (
                <label className="field" key={step.id}>
                  <span>{step.label}</span>
                  <CustomSelect
                    value={step.value}
                    onChange={(value) => updateStep(step.id, value)}
                    options={step.options}
                  />
                </label>
              ))}
              {assignment.elevage === "yes" ? (
                <>
                  <label className="field">
                    <span>Type d&apos;élevage</span>
                    <CustomSelect
                      value={assignment.elevageType}
                      onChange={(value) => updateStep("elevageType", value)}
                      options={elevageTypeOptions}
                    />
                  </label>
                  <label className="field">
                    <span>Durée d&apos;élevage</span>
                    <CustomSelect
                      value={assignment.elevageDuration}
                      onChange={(value) => updateStep("elevageDuration", value)}
                      options={elevageDurationOptions}
                    />
                  </label>
                  {assignment.elevageType !== "inox" ? (
                    <label className="field">
                      <span>Chauffe</span>
                      <CustomSelect
                        value={assignment.elevageChauffe}
                        onChange={(value) => updateStep("elevageChauffe", value)}
                        options={elevageChauffeOptions}
                      />
                    </label>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="panel beer-panel beer-panel--result">
        <div className="panel-heading">
          <p className="panel-kicker">Résultat</p>
          <p>Données déterminées à partir de votre recette.</p>
        </div>

        <div className="beer-result-grid wine-result-grid">
          <div className="result-card beer-result-card wine-profile-result-card">
            <div className="wine-profile-head">
              <div>
                <p className="panel-kicker">Profil final</p>
                <h3>{result.cepage.name}</h3>
              </div>
              <div className="wine-color-chip" style={{ background: wineOutputPalette[result.type] ?? result.color }} />
            </div>
            <div className="wine-profile-stack">
              <div className="wine-profile-block">
                <span>Type</span>
                <strong>{result.type}</strong>
              </div>
              <div className="wine-profile-block">
                <span>Arômes primaires</span>
                <strong>{result.aromaProfile.primary.join(", ") || "Aucun marqueur dominant"}</strong>
              </div>
              <div className="wine-profile-block">
                <span>Arômes secondaires</span>
                <strong>{result.aromaProfile.secondary.join(", ") || "Discrets"}</strong>
              </div>
              <div className="wine-profile-block">
                <span>Arômes tertiaires</span>
                <strong>{result.aromaProfile.tertiary.join(", ") || "Absents"}</strong>
              </div>
              {result.distinctiveStyles.length ? (
                <div className="wine-profile-block">
                  <span>Styles distinctifs</span>
                  <strong>{result.distinctiveStyles.join(", ")}</strong>
                </div>
              ) : null}
              <div className="wine-aroma-balance">
                <span className="wine-aroma-balance-title">Équilibre aromatique</span>
                <div className="wine-aroma-balance-bar">
                  {result.aromaRatios.primary > 0 ? (
                    <i className="wine-aroma-balance-segment wine-aroma-balance-segment--primary" style={{ width: `${result.aromaRatios.primary * 100}%` }} />
                  ) : null}
                  {result.aromaRatios.secondary > 0 ? (
                    <i className="wine-aroma-balance-segment wine-aroma-balance-segment--secondary" style={{ width: `${result.aromaRatios.secondary * 100}%` }} />
                  ) : null}
                  {result.aromaRatios.tertiary > 0 ? (
                    <i className="wine-aroma-balance-segment wine-aroma-balance-segment--tertiary" style={{ width: `${result.aromaRatios.tertiary * 100}%` }} />
                  ) : null}
                </div>
                <div className="wine-aroma-balance-legend">
                  <span><i className="wine-aroma-balance-dot wine-aroma-balance-dot--primary" /> Primaire <strong>{Math.round(result.aromaRatios.primary * 100)}%</strong></span>
                  <span><i className="wine-aroma-balance-dot wine-aroma-balance-dot--secondary" /> Secondaire <strong>{Math.round(result.aromaRatios.secondary * 100)}%</strong></span>
                  <span><i className="wine-aroma-balance-dot wine-aroma-balance-dot--tertiary" /> Tertiaire <strong>{Math.round(result.aromaRatios.tertiary * 100)}%</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="result-card beer-result-card wine-properties-card">
            <div className="wine-properties-stack">
              <div className="wine-properties-head">
                <div>
                  <p className="panel-kicker">Propriétés</p>
                </div>
              </div>
              <Gauge
                label="Alcool"
                value={result.alcohol.toFixed(1)}
                suffix="% vol"
                percent={result.gauges.alcohol.percent}
                helper={result.gauges.alcohol.label}
                toneClass="metric-gauge-fill--alcohol"
              />
              <Gauge
                label="Sucre"
                value={result.sugar.toFixed(1)}
                suffix=" g/L"
                percent={result.gauges.sugar.percent}
                helper={result.gauges.sugar.label}
                toneClass="metric-gauge-fill--wine-sugar"
              />
              <Gauge
                label="Tanins"
                value={result.tannins.toFixed(1)}
                suffix=""
                percent={result.gauges.tannins.percent}
                helper={result.gauges.tannins.label}
                toneClass="metric-gauge-fill--wine-tannins"
              />
              <Gauge
                label="Acidité"
                value={result.acidity.toFixed(1)}
                suffix=""
                percent={result.gauges.acidity.percent}
                helper={result.gauges.acidity.label}
                toneClass="metric-gauge-fill--wine-acidity"
              />
            </div>
            <div className="wine-sensory-panel">
              <RadarChart title="Profil sensoriel" items={result.radar} accentClass="radar-card--wine" fill={false} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
