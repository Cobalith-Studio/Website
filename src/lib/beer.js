export const maltCategories = {
  base: {
    id: "base",
    label: "Malt de base",
    min: 51,
    max: 100,
    options: {
      pilsner: { label: "Pilsner", abv: 4, ebc: 2.5, aromas: ["Cereale", "Pain blanc"] },
      pale_ale: { label: "Pale Ale", abv: 3.8, ebc: 6, aromas: ["Cereale", "Toaste leger"] },
      vienna: { label: "Vienna", abv: 3.2, ebc: 9, aromas: ["Biscuit", "Noisette"] },
      munich: { label: "Munich", abv: 2.8, ebc: 20, aromas: ["Pain", "Malte", "Caramel leger"] }
    }
  },
  kilned: {
    id: "kilned",
    label: "Malt touraille",
    min: 0,
    max: 30,
    options: {
      none: { label: "Aucun", abv: 0, ebc: 0, aromas: [] },
      melano: { label: "Melano", abv: 0, ebc: 80, aromas: ["Malte", "Corps plein"] },
      abbaye: { label: "Abbaye", abv: 0, ebc: 45, aromas: ["Pain", "Caramel", "Sec"] },
      biscuit: { label: "Biscuit", abv: 0, ebc: 50, aromas: ["Pain grille", "Biscuit"] },
      amber: { label: "Amber", abv: 0, ebc: 60, aromas: ["Toaste", "Pain", "Miel"] }
    }
  },
  caramel: {
    id: "caramel",
    label: "Malt caramel",
    min: 0,
    max: 15,
    options: {
      none: { label: "Aucun", abv: 0, ebc: 0, aromas: [] },
      cara_clair: { label: "Cara Clair", abv: 0, ebc: 8, aromas: ["Leger", "Miel"] },
      cara_blond: { label: "Cara Blond", abv: 0, ebc: 20, aromas: ["Caramel", "Douceur"] },
      cara_ruby: { label: "Cara Ruby", abv: 0, ebc: 50, aromas: ["Caramel", "Fruits secs"] },
      cara_munich: { label: "Cara Munich", abv: 0, ebc: 100, aromas: ["Sucre", "Toffee", "Raisin"] },
      special_b: { label: "Special B", abv: 0, ebc: 300, aromas: ["Prune", "Raisin", "Sucre brun"] }
    }
  },
  roasted: {
    id: "roasted",
    label: "Malt torrefie",
    min: 0,
    max: 10,
    options: {
      none: { label: "Aucun", abv: 0, ebc: 0, aromas: [] },
      chocolate: { label: "Chocolat", abv: 0, ebc: 800, aromas: ["Chocolat", "Sec"] },
      black_patent: { label: "Black Patent", abv: 0, ebc: 1200, aromas: ["Brule", "Astringent"] },
      roasted_barley: { label: "Roasted Barley", abv: 0, ebc: 1000, aromas: ["Cafe", "Brule"] }
    }
  },
  others: {
    id: "others",
    label: "Autres malts",
    min: 0,
    max: 30,
    options: {
      none: { label: "Aucun", abv: 0, ebc: 0, aromas: [] },
      smoked: { label: "Fume", abv: 0, ebc: 10, aromas: ["Fume", "Boise"] },
      whisky: { label: "Whisky", abv: 0, ebc: 20, aromas: ["Fume", "Epice"] },
      rye: { label: "Seigle", abv: 1, ebc: 10, aromas: ["Poivre", "Sec"] },
      wheat: { label: "Ble", abv: 1, ebc: 5, aromas: ["Leger", "Douceur"] },
      oats: { label: "Avoine", abv: 0, ebc: 2, aromas: ["Onctueux", "Veloute"] },
      buckwheat: { label: "Sarrasin", abv: 0, ebc: 3, aromas: ["Noisette", "Terreux"] },
      spelt: { label: "Epeautre", abv: 0, ebc: 4, aromas: ["Pain", "Herbace"] }
    }
  }
};

export const hopProfiles = {
  aramis: { label: "Aramis", alpha: 8, type: "aromatic", aromas: ["Herbe", "Fleur", "Terre", "Citron"] },
  strisselspalt: { label: "Strisselspalt", alpha: 3, type: "aromatic", aromas: ["Herbe", "Epice", "Fleur"] },
  triskel: { label: "Triskel", alpha: 7, type: "aromatic", aromas: ["Agrume", "Fleur", "Fruit a noyau"] },
  saaz: { label: "Saaz", alpha: 4, type: "aromatic", aromas: ["Epice", "Terre", "Fleur"] },
  hallertau: { label: "Hallertau", alpha: 4.5, type: "aromatic", aromas: ["Fleur", "Epice", "Terre"] },
  tettnang: { label: "Tettnang", alpha: 5, type: "aromatic", aromas: ["Epice", "Herbe", "Fleur"] },
  east_kent_goldings: { label: "East Kent Goldings", alpha: 5, type: "aromatic", aromas: ["Miel", "Epice", "Thym"] },
  cascade: { label: "Cascade", alpha: 6, type: "aromatic", aromas: ["Agrume", "Fleur", "Pamplemousse"] },
  citra: { label: "Citra", alpha: 12, type: "aromatic", aromas: ["Mangue", "Citron vert", "Tropical"] },
  mosaic: { label: "Mosaic", alpha: 12, type: "dual", aromas: ["Baies", "Tropical", "Terre"] },
  amarillo: { label: "Amarillo", alpha: 9, type: "dual", aromas: ["Fleur", "Agrume", "Fruit a noyau"] },
  galaxy: { label: "Galaxy", alpha: 14, type: "aromatic", aromas: ["Fruit de la passion", "Peche", "Citrus"] },
  magnum: { label: "Magnum", alpha: 12, type: "bitter", aromas: ["Resine", "Epice legere"] },
  nugget: { label: "Nugget", alpha: 13, type: "bitter", aromas: ["Herbe", "Epice", "Resine"] },
  chinook: { label: "Chinook", alpha: 13, type: "dual", aromas: ["Pin", "Epice", "Pamplemousse"] },
  simcoe: { label: "Simcoe", alpha: 13, type: "dual", aromas: ["Pin", "Tropical", "Bois"] },
  columbus: { label: "Columbus", alpha: 15, type: "dual", aromas: ["Resine", "Poivre", "Reglisse"] },
  apollo: { label: "Apollo", alpha: 18, type: "bitter", aromas: ["Resine", "Pamplemousse"] }
};

export const beerOptions = {
  yeasts: {
    cerevisiae: { label: "Saccharomyces cerevisiae", abv: 1, family: "Ale" },
    pastorianus: { label: "Saccharomyces pastorianus", abv: 0.5, family: "Lager" },
    brett: { label: "Brettanomyces", abv: 0.3, family: "Sauvage" }
  },
  fermentations: {
    controlled: { label: "Controlee" },
    spontaneous: { label: "Spontanee" }
  },
  additions: {
    coriander: { label: "Coriandre", aroma: "Epice" },
    orange: { label: "Orange", aroma: "Orange" },
    raspberry: { label: "Framboise", aroma: "Framboise" },
    cherry: { label: "Cerise", aroma: "Cerise" },
    coffee: { label: "Cafe", aroma: "Cafe" },
    apple: { label: "Pomme", aroma: "Pomme" },
    citrus: { label: "Citrus", aroma: "Citrus" }
  },
  mashTemps: {
    low: { label: "Bas (60-63 C)" },
    high: { label: "Haut (67-70 C)" }
  },
  fermentationTemps: {
    low: { label: "Basse (10-13 C)" },
    high: { label: "Haute (18-24 C)" }
  },
  fermentationDurations: {
    short: { label: "3 jours" },
    medium: { label: "7 jours" },
    long: { label: "14 jours" }
  },
  boilDurations: {
    60: { label: "60 min", ibuMultiplier: 1 },
    75: { label: "75 min", ibuMultiplier: 1.1 },
    90: { label: "90 min", ibuMultiplier: 1.2 }
  },
  carbonation: {
    natural: { label: "Naturelle" },
    forced: { label: "Forcee" }
  }
};

export function getConditioningOptions(fermentation, yeast) {
  if (fermentation === "spontaneous" || yeast === "brett") {
    return {
      three_weeks: { label: "3 semaines" },
      three_months: { label: "3 mois" }
    };
  }
  if (yeast === "pastorianus") {
    return {
      one_week: { label: "1 semaine" },
      three_weeks: { label: "3 semaines" },
      three_months: { label: "3 mois" }
    };
  }
  return {
    none: { label: "Aucune" },
    one_week: { label: "1 semaine" }
  };
}

export function createInitialBeerState() {
  return {
    malts: {
      base: { option: "pilsner", percent: 78 },
      kilned: { option: "none", percent: 0 },
      caramel: { option: "none", percent: 0 },
      roasted: { option: "none", percent: 0 },
      others: { option: "wheat", percent: 22 }
    },
    bitterHops: ["magnum"],
    aromaHops: ["cascade"],
    yeast: "cerevisiae",
    fermentation: "controlled",
    additions: [],
    mashTemp: "high",
    boilDuration: "75",
    fermentationTemp: "high",
    fermentationDuration: "medium",
    conditioning: "one_week",
    carbonation: "natural"
  };
}

function getEbcLabel(ebc) {
  if (ebc <= 4) return "Blanche";
  if (ebc <= 8) return "Blonde";
  if (ebc <= 12) return "Doree";
  if (ebc <= 16) return "Rousse";
  if (ebc <= 20) return "Ambree claire";
  if (ebc <= 25) return "Ambree";
  if (ebc <= 30) return "Ambree foncee";
  if (ebc <= 40) return "Brune";
  if (ebc <= 50) return "Brune foncee";
  return "Noire";
}

function getEbcColor(ebc) {
  if (ebc <= 4) return "#f5f0c3";
  if (ebc <= 8) return "#fbe29b";
  if (ebc <= 12) return "#f5c46b";
  if (ebc <= 16) return "#e4a148";
  if (ebc <= 20) return "#d18e3b";
  if (ebc <= 25) return "#c97c3d";
  if (ebc <= 30) return "#b1622e";
  if (ebc <= 40) return "#8b4513";
  if (ebc <= 50) return "#5a2d0c";
  return "#2c1b10";
}

function gaugeLabel(value, type) {
  if (type === "ibu") {
    if (value < 15) return "Tres faible";
    if (value < 30) return "Moderee";
    if (value < 50) return "Amere";
    return "Tres amere";
  }
  if (type === "abv") {
    if (value < 4.5) return "Legere";
    if (value < 6.5) return "Equilibree";
    if (value < 8.5) return "Puissante";
    return "Tres puissante";
  }
  return "";
}

function dominantAromaGroup(aromas) {
  const map = {
    Cereale: "Cereale",
    "Pain blanc": "Cereale",
    Pain: "Cereale",
    "Pain grille": "Cereale",
    Biscuit: "Cereale",
    Malte: "Cereale",
    Caramel: "Caramelise",
    Toffee: "Caramelise",
    Chocolat: "Torrefie",
    Cafe: "Torrefie",
    Brule: "Torrefie",
    Orange: "Fruite",
    Framboise: "Fruite",
    Cerise: "Fruite",
    Pomme: "Fruite",
    Citrus: "Fruite",
    Tropical: "Fruite",
    Agrume: "Fruite",
    Herbe: "Herbace",
    Resine: "Herbace",
    Pin: "Herbace",
    Fleur: "Floral",
    Epice: "Epice",
    Poivre: "Epice",
    Fume: "Boise",
    Bois: "Boise",
    Funky: "Fermentation sauvage",
    Acidule: "Fermentation sauvage"
  };

  const frequencies = {};
  aromas.forEach((aroma) => {
    const group = map[aroma] ?? aroma;
    frequencies[group] = (frequencies[group] ?? 0) + 1;
  });

  return Object.entries(frequencies).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Neutre";
}

export function simulateBeer(state) {
  let abv = 0;
  let ebc = 5;
  let aromas = [];
  let validBase = false;

  Object.entries(maltCategories).forEach(([key, category]) => {
    const selected = state.malts[key];
    const option = category.options[selected.option];
    const ratio = selected.percent / 100;
    if (!option || selected.percent === 0) {
      return;
    }
    if (key === "base" && selected.percent >= 51) {
      validBase = true;
    }
    abv += (option.abv ?? 0) * ratio;
    ebc += (option.ebc ?? 0) * ratio;
    aromas.push(...(option.aromas ?? []));
  });

  const totalPercent = Object.values(state.malts).reduce((sum, item) => sum + item.percent, 0);
  if (!validBase || totalPercent !== 100) {
    return {
      isValid: false,
      error: "Les malts doivent totaliser 100% avec au moins 51% de malt de base."
    };
  }

  const allHops = new Set([...state.bitterHops, ...state.aromaHops]);
  let ibu = 0;
  allHops.forEach((hopId) => {
    const hop = hopProfiles[hopId];
    if (!hop) return;
    if (state.bitterHops.includes(hopId)) ibu += hop.alpha * 1.5;
    if (state.aromaHops.includes(hopId)) ibu += hop.alpha * 0.5;
    if (hop.type !== "bitter") aromas.push(...hop.aromas);
  });

  ibu *= beerOptions.boilDurations[state.boilDuration].ibuMultiplier;

  if (state.fermentation === "spontaneous") {
    aromas.push("Funky", "Acidule");
  } else {
    const yeast = beerOptions.yeasts[state.yeast];
    abv += yeast.abv;
    if (state.yeast === "brett") aromas.push("Funky", "Acidule");
  }

  if (state.mashTemp === "high") abv += 0.5;
  if (state.fermentationTemp === "high") abv += 0.3;

  if (state.fermentationDuration === "long") {
    abv += 0.3;
    aromas.push("Biscuit", "Caramel");
  } else if (state.fermentationDuration === "short") {
    abv -= 0.2;
    aromas.push("Fruit", "Fleur");
  }

  const styleTags = [];
  if (state.conditioning === "three_months") {
    abv += 0.2;
    aromas.push("Toffee", "Raisin", "Pain grille");
    styleTags.push("Vieillie");
  } else if (state.conditioning === "three_weeks") {
    aromas.push("Fruits secs", "Caramel");
  } else if (state.conditioning === "one_week") {
    aromas.push("Leger", "Frais");
    styleTags.push("Jeune");
  }

  if (state.carbonation === "natural") {
    aromas.push("Onctueux", "Doux");
    styleTags.push("Douce");
  } else {
    aromas.push("Sec", "Epice");
    styleTags.push("Seche");
  }

  state.additions.forEach((additionId) => {
    const addition = beerOptions.additions[additionId];
    if (addition) aromas.push(addition.aroma);
  });

  abv = Math.min(abv, 12);
  const uniqueAromas = [...new Set(aromas)];

  let type = "Ale";
  if (state.fermentation === "spontaneous" || state.yeast === "brett") type = "Lambic";
  else if (state.yeast === "pastorianus") type = "Lager";

  let style = "Pale Ale";
  if (type === "Ale") {
    if (ibu > 50) style = "IPA";
    else if (ebc > 30) style = "Stout / Porter";
    else style = "Pale Ale";
  } else if (type === "Lager") {
    style = ebc < 15 ? "Pilsner" : "Vienna Dunkel";
  } else if (type === "Lambic") {
    style = state.additions.includes("raspberry") || state.additions.includes("cherry") ? "Fruit Lambic" : "Gueuze";
  }

  if (styleTags.length) {
    style += ` (${styleTags.join(", ")})`;
  }

  const ebcColor = getEbcColor(ebc);
  const ebcLabel = getEbcLabel(ebc);
  const bitternessPct = Math.min(100, (ibu / 90) * 100);
  const alcoholPct = Math.min(100, (abv / 12) * 100);

  return {
    isValid: true,
    type,
    style,
    abv,
    ibu,
    ebc,
    ebcColor,
    ebcLabel,
    aromas: uniqueAromas,
    dominantAroma: dominantAromaGroup(uniqueAromas),
    bitternessGauge: { percent: bitternessPct, label: gaugeLabel(ibu, "ibu") },
    alcoholGauge: { percent: alcoholPct, label: gaugeLabel(abv, "abv") },
    radar: [
      { label: "Amertume", value: Math.min(100, ibu * 1.8) },
      { label: "Corps", value: Math.min(100, abv * 8 + ebc * 0.7) },
      { label: "Couleur", value: Math.min(100, ebc * 2.2) },
      { label: "Aromatique", value: Math.min(100, uniqueAromas.length * 11) },
      { label: "Secheresse", value: state.carbonation === "forced" ? 72 : 48 }
    ]
  };
}
