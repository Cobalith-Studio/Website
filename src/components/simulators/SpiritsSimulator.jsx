import { useMemo, useState } from "react";
import CustomSelect from "../ui/CustomSelect";
import RadarChart from "../ui/RadarChart";
import { createInitialSpiritsState, simulateSpirit, spiritsOptions } from "../../lib/spirits";

function Gauge({ label, value, percent, helper, toneClass }) {
  return (
    <div className="metric-gauge">
      <div className="metric-gauge-head">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="metric-gauge-track">
        <div className={`metric-gauge-fill ${toneClass}`} style={{ width: `${percent}%` }} />
      </div>
      <small>{helper}</small>
    </div>
  );
}

export default function SpiritsSimulator() {
  const [state, setState] = useState(createInitialSpiritsState);
  const result = useMemo(() => simulateSpirit(state), [state]);

  function toggleBotanical(botanicalId) {
    setState((current) => ({
      ...current,
      botanicals: current.botanicals.includes(botanicalId)
        ? current.botanicals.filter((item) => item !== botanicalId)
        : current.botanicals.length >= 4
          ? [...current.botanicals.slice(1), botanicalId]
          : [...current.botanicals, botanicalId]
    }));
  }

  const isMash = state.base === "mash";
  const isNeutral = state.base === "neutral";
  const showBotanicals = isNeutral && state.aromaMode === "yes";
  const showAromaticsPanel = isNeutral;
  const showCask = state.aging !== "none";
  const showSecondPass = state.still === "repasse" && state.base !== "neutral";

  return (
    <div className="beer-simulator-grid">
      <section className="panel beer-panel beer-panel--input">
        <div className="panel-heading">
          <p className="panel-kicker">Distillation</p>
          <h2>Construction du spiritueux</h2>
          <p>On reprend les données clés de l’ancienne version: matière première, fermentation, aromatisation, type d’alambic, passes, dilution, élevage, sucre et filtration.</p>
        </div>

        <div className="beer-section-grid">
          <div className="beer-subpanel">
            <h3>Matiere de depart</h3>
            <div className="field-grid">
              <label className="field">
                <span>Base</span>
                <CustomSelect
                  value={state.base}
                  onChange={(value) => setState((current) => ({ ...current, base: value }))}
                  options={Object.entries(spiritsOptions.base).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              {isMash ? (
                <>
                  <label className="field">
                    <span>Cereale principale</span>
                    <CustomSelect
                      value={state.grain1}
                      onChange={(value) => setState((current) => ({ ...current, grain1: value }))}
                      options={Object.entries(spiritsOptions.grains).filter(([id]) => id !== "none").map(([id, option]) => ({ value: id, label: option.label }))}
                    />
                  </label>
                  <label className="field">
                    <span>Cereale secondaire</span>
                    <CustomSelect
                      value={state.grain2}
                      onChange={(value) => setState((current) => ({ ...current, grain2: value }))}
                      options={Object.entries(spiritsOptions.grains).map(([id, option]) => ({ value: id, label: option.label }))}
                    />
                  </label>
                </>
              ) : null}
            </div>
          </div>

          {isMash ? (
            <div className="beer-subpanel">
              <h3>Fermentation</h3>
              <div className="field-grid">
                <label className="field">
                  <span>Levure</span>
                  <CustomSelect
                    value={state.yeast}
                    onChange={(value) => setState((current) => ({ ...current, yeast: value }))}
                    options={Object.entries(spiritsOptions.yeast).map(([id, option]) => ({ value: id, label: option.label }))}
                  />
                </label>
                <label className="field">
                  <span>Temperature</span>
                  <CustomSelect
                    value={state.fermentationTemp}
                    onChange={(value) => setState((current) => ({ ...current, fermentationTemp: value }))}
                    options={Object.entries(spiritsOptions.fermentationTemp).map(([id, option]) => ({ value: id, label: option.label }))}
                  />
                </label>
                <label className="field">
                  <span>Duree</span>
                  <CustomSelect
                    value={state.fermentationDuration}
                    onChange={(value) => setState((current) => ({ ...current, fermentationDuration: value }))}
                    options={Object.entries(spiritsOptions.fermentationDuration).map(([id, option]) => ({ value: id, label: option.label }))}
                  />
                </label>
              </div>
            </div>
          ) : null}

          {showAromaticsPanel ? (
            <div className="beer-subpanel">
              <h3>Aromatisation</h3>
              <div className="field-grid">
                <label className="field">
                  <span>Aromatise</span>
                  <CustomSelect
                    value={state.aromaMode}
                    onChange={(value) => setState((current) => ({ ...current, aromaMode: value }))}
                    options={Object.entries(spiritsOptions.aromaMode).map(([id, option]) => ({ value: id, label: option.label }))}
                  />
                </label>
                {showBotanicals ? (
                  <label className="field">
                    <span>Methode d'extraction</span>
                    <CustomSelect
                      value={state.aromaTechnique}
                      onChange={(value) => setState((current) => ({ ...current, aromaTechnique: value }))}
                      options={Object.entries(spiritsOptions.aromaTechnique).map(([id, option]) => ({ value: id, label: option.label }))}
                    />
                  </label>
                ) : null}
              </div>
              {showBotanicals ? (
                <div className="chip-grid dense-chip-grid">
                  {Object.entries(spiritsOptions.botanicals).map(([id, option]) => (
                    <button
                      key={id}
                      type="button"
                      className={`chip${state.botanicals.includes(id) ? " is-selected" : ""}`}
                      onClick={() => toggleBotanical(id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="beer-subpanel">
            <h3>Distillation et elevage</h3>
            <div className="field-grid">
              <label className="field">
                <span>Alambic</span>
                <CustomSelect
                  value={state.still}
                  onChange={(value) => setState((current) => ({ ...current, still: value }))}
                  options={Object.entries(spiritsOptions.still).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              <label className="field">
                <span>1ere passe</span>
                <CustomSelect
                  value={state.pass1}
                  onChange={(value) => setState((current) => ({ ...current, pass1: value }))}
                  options={Object.entries(spiritsOptions.pass).filter(([id]) => id !== "none").map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              {showSecondPass ? (
                <label className="field">
                  <span>2e passe</span>
                  <CustomSelect
                    value={state.pass2}
                    onChange={(value) => setState((current) => ({ ...current, pass2: value }))}
                    options={Object.entries(spiritsOptions.pass).map(([id, option]) => ({ value: id, label: option.label }))}
                  />
                </label>
              ) : null}
              <label className="field">
                <span>Alcool vise</span>
                <CustomSelect
                  value={state.dilution}
                  onChange={(value) => setState((current) => ({ ...current, dilution: value }))}
                  options={Object.entries(spiritsOptions.dilution).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              <label className="field">
                <span>Vieillissement</span>
                <CustomSelect
                  value={state.aging}
                  onChange={(value) => setState((current) => ({ ...current, aging: value }))}
                  options={Object.entries(spiritsOptions.aging).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              {showCask ? (
                <label className="field">
                  <span>Contenant</span>
                  <CustomSelect
                    value={state.cask}
                    onChange={(value) => setState((current) => ({ ...current, cask: value }))}
                    options={Object.entries(spiritsOptions.cask).map(([id, option]) => ({ value: id, label: option.label }))}
                  />
                </label>
              ) : null}
              <label className="field">
                <span>Ajout de sucre</span>
                <CustomSelect
                  value={state.sweetness}
                  onChange={(value) => setState((current) => ({ ...current, sweetness: value }))}
                  options={Object.entries(spiritsOptions.sweetness).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              <label className="field">
                <span>Filtration</span>
                <CustomSelect
                  value={state.filtration}
                  onChange={(value) => setState((current) => ({ ...current, filtration: value }))}
                  options={Object.entries(spiritsOptions.filtration).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="panel beer-panel beer-panel--result">
        <div className="panel-heading">
          <p className="panel-kicker">Resultat</p>
          <h2>{result.type}</h2>
          <p>{result.style}</p>
        </div>

        <div className="beer-result-grid">
          <div className="result-card beer-result-card">
            <dl className="metric-list">
              <div><dt>Alcool</dt><dd>{result.alcohol}</dd></div>
              <div><dt>Sucre</dt><dd>{result.sugar}</dd></div>
              <div><dt>Couleur</dt><dd>{result.color}</dd></div>
              <div><dt>Profil</dt><dd>{result.profile[0] ?? "Net"}</dd></div>
            </dl>
          </div>

          <div className="result-card beer-result-card">
            <Gauge label="Puissance" value={result.alcohol} percent={result.gauges.alcohol.percent} helper={result.gauges.alcohol.label} toneClass="metric-gauge-fill--alcohol" />
            <Gauge label="Elevage" value={spiritsOptions.aging[state.aging].label} percent={result.gauges.age.percent} helper={result.gauges.age.label} toneClass="metric-gauge-fill--ibu" />
          </div>

          <div className="result-card beer-result-card">
            <RadarChart title="Carte sensorielle" items={result.radar} accentClass="radar-card--spirit" fill={false} />
          </div>

          <div className="result-card beer-result-card profile-card">
            <h3>Profil aromatique</h3>
            <div className="profile-pill-grid">
              {result.profile.map((item) => (
                <span className="profile-pill" key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
