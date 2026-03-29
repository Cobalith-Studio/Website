export const spiritsOptions = {
  base: {
    mash: { label: "Mout" },
    neutral: { label: "Alcool surfin" },
    molasses: { label: "Melasse" },
    cane: { label: "Jus de canne" }
  },
  grains: {
    barley: { label: "Orge maltee" },
    wheat: { label: "Ble" },
    corn: { label: "Mais" },
    rye: { label: "Seigle" },
    none: { label: "Aucune" }
  },
  yeast: {
    cerevisiae: { label: "S. cerevisiae" },
    indigenous: { label: "Levure indigene" },
    spontaneous: { label: "Spontanee" }
  },
  fermentationTemp: {
    20: { label: "20 C" },
    25: { label: "25 C" },
    30: { label: "30 C" },
    35: { label: "35 C" }
  },
  fermentationDuration: {
    24: { label: "24h" },
    48: { label: "48h" },
    72: { label: "72h" },
    week: { label: "1 semaine" }
  },
  aromaMode: {
    no: { label: "Non" },
    yes: { label: "Oui" }
  },
  aromaTechnique: {
    maceration: { label: "Maceration" },
    liquid_infusion: { label: "Infusion liquide" },
    steam_infusion: { label: "Infusion vapeur" }
  },
  botanicals: {
    juniper: { label: "Genievre", family: "gin" },
    coriander: { label: "Coriandre", family: "spice" },
    angelica: { label: "Angelique", family: "herbal" },
    orange_peel: { label: "Ecorce d'orange", family: "citrus" },
    cardamom: { label: "Cardamome", family: "spice" },
    licorice: { label: "Reglisse", family: "sweet" },
    lavender: { label: "Lavande", family: "floral" },
    pink_pepper: { label: "Poivre rose", family: "spice" },
    cucumber: { label: "Concombre", family: "fresh" },
    green_tea: { label: "The vert", family: "herbal" }
  },
  still: {
    column: { label: "Colonne" },
    repasse: { label: "Repasse" }
  },
  pass: {
    pot: { label: "Pot Still" },
    bain_marie: { label: "Bain-Marie" },
    none: { label: "Aucun" }
  },
  dilution: {
    37.5: { label: "37.5" },
    40: { label: "40.0" },
    45: { label: "45.0" },
    47.5: { label: "47.5" },
    50: { label: "50.0" },
    55: { label: "55.0" },
    60: { label: "60.0" }
  },
  aging: {
    none: { label: "Aucun", years: 0 },
    "6m": { label: "6 mois", years: 0.5 },
    "1y": { label: "1 an", years: 1 },
    "2y": { label: "2 ans", years: 2 },
    "3y": { label: "3 ans", years: 3 },
    "5y": { label: "5 ans", years: 5 },
    "10y": { label: "10 ans", years: 10 }
  },
  cask: {
    inox: { label: "Inox" },
    oak: { label: "Fut de chene" },
    bourbon: { label: "Fut de bourbon" },
    sherry: { label: "Fut de xeres" }
  },
  sweetness: {
    none: { label: "Aucun", text: "0 g/L (sec)" },
    light: { label: "Leger", text: "10-30 g/L" },
    medium: { label: "Modere", text: "30-80 g/L" },
    high: { label: "Important", text: ">100 g/L" }
  },
  filtration: {
    none: { label: "Aucun" },
    charcoal: { label: "Charbon actif" },
    cold: { label: "Filtration a froid" },
    cloth: { label: "Toile fine" }
  }
};

export function createInitialSpiritsState() {
  return {
    base: "mash",
    grain1: "barley",
    grain2: "none",
    yeast: "cerevisiae",
    fermentationTemp: "25",
    fermentationDuration: "48",
    aromaMode: "no",
    aromaTechnique: "maceration",
    botanicals: ["juniper"],
    still: "repasse",
    pass1: "pot",
    pass2: "bain_marie",
    dilution: "45",
    aging: "3y",
    cask: "oak",
    sweetness: "none",
    filtration: "none"
  };
}

function include(list, id) {
  return list.includes(id);
}

function getColorFromCask(cask, aging) {
  let color = "Transparent";
  if (cask === "bourbon") color = "Dore ambre";
  else if (cask === "sherry") color = "Acajou";
  else if (cask === "oak") color = "Or soutenu";
  else if (cask !== "inox") color = "Ambre";

  if (aging === "5y") color += " profond";
  else if (aging === "10y") color += " fonce";

  return color;
}

export function simulateSpirit(state) {
  const ageYears = spiritsOptions.aging[state.aging].years;
  const ageOk = ageYears >= 3;
  const dilution = Number(state.dilution);
  const hasBotanicals = state.aromaMode === "yes" && state.botanicals.length > 0;

  let type = "Boisson spiritueuse";
  let style = "Assemblage";

  if (state.base === "mash") {
    const isOnlyMalt = state.grain1 === "barley" && state.grain2 === "none";
    const isBlendMalt = state.grain1 === "barley" && state.grain2 !== "none";
    const isOtherGrain = state.grain1 !== "barley";

    if (isOnlyMalt) {
      if (ageOk) {
        type = "Whisky";
        style = "Single Malt";
      } else {
        type = "Eau-de-vie de malt";
        style = "Jeune distillat";
      }
    } else if (isBlendMalt && ageOk) {
      type = "Whisky";
      style = "Blended";
    } else if (isOtherGrain && ageOk) {
      type = "Whisky";
      style = "Grain Whisky";
    } else if (isOtherGrain && !ageOk) {
      type = "Eau-de-vie de cereales";
      style = "New make de grain";
    } else {
      type = "Boisson spiritueuse de cereales";
      style = "Assemblage";
    }
  } else if (state.base === "molasses") {
    type = "Rhum industriel";
    style = ageOk ? "Rhum vieux" : "Rhum blanc ou ambre";
  } else if (state.base === "cane") {
    type = "Rhum agricole";
    style = ageOk ? "Rhum vieux agricole" : "Rhum blanc agricole";
  } else if (state.base === "neutral") {
    if (hasBotanicals) {
      if (include(state.botanicals, "juniper")) {
        type = "Gin";
        if (state.aromaTechnique === "steam_infusion" && dilution >= 70) style = "London Dry Gin";
        else if (state.aromaTechnique === "steam_infusion") style = "Distilled Gin";
        else style = "Gin aromatique";
      } else {
        type = "Vodka aromatisee";
        style = "Botanical spirit";
      }
    } else {
      type = "Vodka neutre";
      style = state.filtration === "charcoal" ? "Filtree au charbon" : "Neutre";
    }
  }

  if (state.sweetness === "high") {
    if (state.base === "neutral" && hasBotanicals) {
      type = "Liqueur";
      style = "Aromatisee aux plantes";
    } else if (hasBotanicals) {
      const first = spiritsOptions.botanicals[state.botanicals[0]]?.label ?? "plantes";
      type = `Liqueur de ${first}`;
      style = "Aromatisee";
    }
  }

  if (state.sweetness === "high" && dilution < 30) {
    style = "Creme";
  }

  let color = getColorFromCask(state.cask, state.aging);
  if (hasBotanicals && type !== "Gin" && type !== "Vodka aromatisee") {
    color = "Infuse / Teinte";
  }

  const profile = [
    state.still === "column" ? "net" : "riche",
    state.pass1 === "bain_marie" || state.pass2 === "bain_marie" ? "rond" : "franc",
    ...(state.cask === "oak" ? ["vanille", "epices"] : []),
    ...(state.cask === "bourbon" ? ["caramel", "coco"] : []),
    ...(state.cask === "sherry" ? ["fruits secs", "rancio"] : []),
    ...(hasBotanicals ? state.botanicals.map((item) => spiritsOptions.botanicals[item].label.toLowerCase()) : []),
    ...(state.filtration === "charcoal" ? ["pur"] : []),
    ...(state.filtration === "cold" ? ["net"] : [])
  ];

  const uniqueProfile = [...new Set(profile)];

  return {
    type,
    style,
    alcohol: `${dilution.toFixed(1)}% vol`,
    sugar: spiritsOptions.sweetness[state.sweetness].text,
    color,
    profile: uniqueProfile,
    radar: [
      { label: "Puissance", value: Math.min(100, dilution * 1.5) },
      { label: "Boise", value: Math.min(100, ageYears * 12 + (state.cask === "inox" ? 0 : 18)) },
      { label: "Aromatique", value: Math.min(100, hasBotanicals ? 38 + state.botanicals.length * 12 : 18) },
      { label: "Douceur", value: state.sweetness === "high" ? 90 : state.sweetness === "medium" ? 55 : state.sweetness === "light" ? 32 : 12 },
      { label: "Purete", value: Math.min(100, (state.still === "column" ? 70 : 48) + (state.filtration === "charcoal" ? 18 : 0)) }
    ],
    gauges: {
      alcohol: {
        percent: Math.min(100, (dilution / 60) * 100),
        label: dilution < 40 ? "Leger" : dilution < 50 ? "Equilibre" : dilution < 56 ? "Puissant" : "Tres puissant"
      },
      age: {
        percent: Math.min(100, (ageYears / 10) * 100),
        label: ageYears < 1 ? "Jeune" : ageYears < 3 ? "Debut d'elevage" : ageYears < 6 ? "Mature" : "Tres vieux"
      }
    }
  };
}
