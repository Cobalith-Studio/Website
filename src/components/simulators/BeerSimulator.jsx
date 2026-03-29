import { useMemo, useState } from "react";
import CustomSelect from "../ui/CustomSelect";
import RadarChart from "../ui/RadarChart";
import {
  beerOptions,
  createInitialBeerState,
  getConditioningOptions,
  hopProfiles,
  maltCategories,
  simulateBeer
} from "../../lib/beer";

function ToggleChipGroup({ items, selected, onToggle }) {
  return (
    <div className="chip-grid dense-chip-grid">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={`chip${selected.includes(item.value) ? " is-selected" : ""}`}
          onClick={() => onToggle(item.value)}
        >
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function Gauge({ label, value, suffix, percent, toneClass, helper }) {
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

function MaltControl({ category, selected, onOptionChange, onPercentChange }) {
  return (
    <div className="malt-control">
      <div className="malt-head">
        <div>
          <h3>{category.label}</h3>
          <p>{category.min}% à {category.max}%</p>
        </div>
        <strong>{selected.percent}%</strong>
      </div>
      <CustomSelect
        value={selected.option}
        onChange={onOptionChange}
        options={Object.entries(category.options).map(([id, option]) => ({ value: id, label: option.label }))}
      />
      <input
        type="range"
        min={category.min}
        max={category.max}
        value={selected.percent}
        onChange={(event) => onPercentChange(Number(event.target.value))}
      />
    </div>
  );
}

export default function BeerSimulator() {
  const [state, setState] = useState(createInitialBeerState);
  const conditioningOptions = getConditioningOptions(state.fermentation, state.yeast);
  const result = useMemo(() => simulateBeer(state), [state]);

  function updateMalt(categoryId, patch) {
    setState((current) => ({
      ...current,
      malts: {
        ...current.malts,
        [categoryId]: { ...current.malts[categoryId], ...patch }
      }
    }));
  }

  function rebalance(categoryId, nextPercent) {
    setState((current) => {
      const nextMalts = { ...current.malts, [categoryId]: { ...current.malts[categoryId], percent: nextPercent } };
      const categories = Object.keys(nextMalts);
      const total = categories.reduce((sum, key) => sum + nextMalts[key].percent, 0);
      let overflow = total - 100;

      if (overflow > 0) {
        for (const key of categories) {
          if (key === categoryId || overflow <= 0) continue;
          const category = maltCategories[key];
          const available = nextMalts[key].percent - category.min;
          const reduction = Math.min(available, overflow);
          nextMalts[key] = { ...nextMalts[key], percent: nextMalts[key].percent - reduction };
          overflow -= reduction;
        }
      } else if (overflow < 0) {
        nextMalts.base = { ...nextMalts.base, percent: nextMalts.base.percent + Math.abs(overflow) };
      }

      return { ...current, malts: nextMalts };
    });
  }

  function toggleFromList(field, value, max = 3) {
    setState((current) => {
      const currentValues = current[field];
      const exists = currentValues.includes(value);
      const nextValues = exists
        ? currentValues.filter((item) => item !== value)
        : currentValues.length >= max
          ? [...currentValues.slice(1), value]
          : [...currentValues, value];
      return { ...current, [field]: nextValues };
    });
  }

  function updateFermentation(value) {
    setState((current) => {
      const next = { ...current, fermentation: value };
      if (value === "spontaneous") {
        next.yeast = "brett";
      }
      const allowed = Object.keys(getConditioningOptions(next.fermentation, next.yeast));
      if (!allowed.includes(next.conditioning)) {
        next.conditioning = allowed[0];
      }
      return next;
    });
  }

  function updateYeast(value) {
    setState((current) => {
      const next = { ...current, yeast: value };
      const allowed = Object.keys(getConditioningOptions(next.fermentation, next.yeast));
      if (!allowed.includes(next.conditioning)) {
        next.conditioning = allowed[0];
      }
      return next;
    });
  }

  const aromaticHops = Object.entries(hopProfiles)
    .filter(([, hop]) => hop.type !== "bitter")
    .map(([id, hop]) => ({ value: id, label: hop.label }));
  const bitterHops = Object.entries(hopProfiles)
    .filter(([, hop]) => hop.type !== "aromatic")
    .map(([id, hop]) => ({ value: id, label: hop.label }));

  return (
    <div className="beer-simulator-grid">
      <section className="panel beer-panel beer-panel--input">
        <div className="panel-heading">
          <p className="panel-kicker">Brassage</p>
          <h2>Construction de la recette</h2>
          <p>On reprend ici la logique riche de l’ancien simulateur: répartition des malts, houblonnage, levures, fermentation, garde et carbonatation.</p>
        </div>

        <div className="beer-section-grid">
          <div className="beer-subpanel">
            <h3>Grain bill</h3>
            <div className="beer-malts-grid">
              {Object.values(maltCategories).map((category) => (
                <MaltControl
                  key={category.id}
                  category={category}
                  selected={state.malts[category.id]}
                  onOptionChange={(value) => updateMalt(category.id, { option: value })}
                  onPercentChange={(value) => rebalance(category.id, value)}
                />
              ))}
            </div>
          </div>

          <div className="beer-subpanel">
            <h3>Houblons et additions</h3>
            <label className="field">
              <span>Houblons amerisants</span>
              <ToggleChipGroup items={bitterHops} selected={state.bitterHops} onToggle={(value) => toggleFromList("bitterHops", value, 3)} />
            </label>
            <label className="field">
              <span>Houblons aromatiques</span>
              <ToggleChipGroup items={aromaticHops} selected={state.aromaHops} onToggle={(value) => toggleFromList("aromaHops", value, 3)} />
            </label>
            <label className="field">
              <span>Ajouts</span>
              <ToggleChipGroup
                items={Object.entries(beerOptions.additions).map(([id, option]) => ({ value: id, label: option.label }))}
                selected={state.additions}
                onToggle={(value) => toggleFromList("additions", value, 4)}
              />
            </label>
          </div>

          <div className="beer-subpanel">
            <h3>Process</h3>
            <div className="field-grid">
              <label className="field">
                <span>Fermentation</span>
                <CustomSelect
                  value={state.fermentation}
                  onChange={updateFermentation}
                  options={Object.entries(beerOptions.fermentations).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              <label className="field">
                <span>Levure</span>
                <CustomSelect
                  value={state.yeast}
                  onChange={updateYeast}
                  options={Object.entries(beerOptions.yeasts).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              <label className="field">
                <span>Empatage</span>
                <CustomSelect
                  value={state.mashTemp}
                  onChange={(value) => setState((current) => ({ ...current, mashTemp: value }))}
                  options={Object.entries(beerOptions.mashTemps).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              <label className="field">
                <span>Ebullition</span>
                <CustomSelect
                  value={state.boilDuration}
                  onChange={(value) => setState((current) => ({ ...current, boilDuration: value }))}
                  options={Object.entries(beerOptions.boilDurations).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              <label className="field">
                <span>Temperature fermentation</span>
                <CustomSelect
                  value={state.fermentationTemp}
                  onChange={(value) => setState((current) => ({ ...current, fermentationTemp: value }))}
                  options={Object.entries(beerOptions.fermentationTemps).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              <label className="field">
                <span>Duree fermentation</span>
                <CustomSelect
                  value={state.fermentationDuration}
                  onChange={(value) => setState((current) => ({ ...current, fermentationDuration: value }))}
                  options={Object.entries(beerOptions.fermentationDurations).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              <label className="field">
                <span>Garde</span>
                <CustomSelect
                  value={state.conditioning}
                  onChange={(value) => setState((current) => ({ ...current, conditioning: value }))}
                  options={Object.entries(conditioningOptions).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
              <label className="field">
                <span>Carbonatation</span>
                <CustomSelect
                  value={state.carbonation}
                  onChange={(value) => setState((current) => ({ ...current, carbonation: value }))}
                  options={Object.entries(beerOptions.carbonation).map(([id, option]) => ({ value: id, label: option.label }))}
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="panel beer-panel beer-panel--result">
        <div className="panel-heading">
          <p className="panel-kicker">Resultat</p>
          <h2>{result.isValid ? result.style : "Recette invalide"}</h2>
          <p>{result.isValid ? result.type : result.error}</p>
        </div>

        {result.isValid ? (
          <div className="beer-result-grid">
            <div className="result-card beer-result-card">
              <div className="beer-stat-row">
                <div>
                  <p className="panel-kicker">Type</p>
                  <h3>{result.type}</h3>
                </div>
                <div className="ebc-chip" style={{ background: result.ebcColor }} />
              </div>
              <dl className="metric-list">
                <div><dt>Style</dt><dd>{result.style}</dd></div>
                <div><dt>Arome dominant</dt><dd>{result.dominantAroma}</dd></div>
              </dl>
            </div>

            <div className="result-card beer-result-card">
              <Gauge
                label="Alcool"
                value={result.abv.toFixed(1)}
                suffix="% vol"
                percent={result.alcoholGauge.percent}
                toneClass="metric-gauge-fill--alcohol"
                helper={result.alcoholGauge.label}
              />
              <Gauge
                label="IBU"
                value={Math.round(result.ibu)}
                suffix=""
                percent={result.bitternessGauge.percent}
                toneClass="metric-gauge-fill--ibu"
                helper={result.bitternessGauge.label}
              />
              <div className="ebc-display">
                <div className="ebc-display-swatch" style={{ background: result.ebcColor }} />
                <div>
                  <span className="panel-kicker">Couleur</span>
                  <strong>{Math.round(result.ebc)} EBC</strong>
                  <small>{result.ebcLabel}</small>
                </div>
              </div>
            </div>

            <div className="result-card beer-result-card">
              <RadarChart title="Carte sensorielle" items={result.radar} accentClass="radar-card--beer" fill={false} />
            </div>

            <div className="result-card beer-result-card profile-card">
              <h3>Profil aromatique</h3>
              <div className="profile-pill-grid">
                {result.aromas.map((aroma) => (
                  <span className="profile-pill" key={aroma}>{aroma}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="result-card beer-result-card">
            <p>{result.error}</p>
          </div>
        )}
      </section>
    </div>
  );
}
