import {
  CEPAGE_DATA,
  CONTEXT_FIELDS,
  DEFAULT_CONTEXT,
  VARIABLES
} from "../data/wineGraphData";

const blancEffervescents = [
  "Chardonnay",
  "Chenin Blanc",
  "Muscat Blanc a Petits Grains",
  "Aligote",
  "Clairette",
  "Jacquere",
  "Riesling"
];

const rougeEffervescents = ["Pinot Noir", "Gamay", "Pinot Meunier", "Cabernet Franc"];
const orangeStars = [
  "Gewurztraminer",
  "Pinot Gris",
  "Muscat Blanc a Petits Grains",
  "Viognier",
  "Chenin Blanc",
  "Riesling"
];
const liquoreuxStars = [
  "Semillon",
  "Petit Manseng",
  "Gros Manseng",
  "Chenin Blanc",
  "Sauvignon Blanc"
];
const MAX_WINE_SUGAR = 135;
const MAX_WINE_TANNINS = 265;
const MAX_WINE_ACIDITY = 13;

export const wineOutputPalette = {
  Effervescent: "#1f7c90",
  Blanc: "#c6a540",
  "Blanc de Noirs": "#d9c689",
  "Vin Orange": "#b05e1c",
  Rose: "#b1496b",
  Rouge: "#851f2d",
  Liquoreux: "#8a5b18"
};

export function normalizeName(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function listHas(list, name) {
  const target = normalizeName(name);
  return list.some((item) => normalizeName(item) === target);
}

export function createDefaultContext() {
  return { ...DEFAULT_CONTEXT };
}

export function getCepageById(cepageId) {
  return CEPAGE_DATA.find((cepage) => cepage.id === cepageId) ?? CEPAGE_DATA[0];
}

function getCandidateCepages(criteria) {
  if (criteria.cepageId) {
    const cepage = CEPAGE_DATA.find((entry) => entry.id === criteria.cepageId);
    return cepage ? [cepage] : [];
  }

  if (!criteria.type) {
    return CEPAGE_DATA;
  }

  switch (criteria.type) {
    case "Blanc":
    case "Vin Orange":
    case "Liquoreux":
      return CEPAGE_DATA.filter((cepage) => !cepage.isRed);
    case "Blanc de Noirs":
    case "Rose":
    case "Rouge":
      return CEPAGE_DATA.filter((cepage) => cepage.isRed);
    default:
      return CEPAGE_DATA;
  }
}

export function getCepageOptions() {
  return CEPAGE_DATA
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((cepage) => ({
      value: cepage.id,
      label: cepage.name
    }));
}

export function getContextFields() {
  return CONTEXT_FIELDS;
}

function getContextLabel(fieldKey, value) {
  const field = CONTEXT_FIELDS.find((entry) => entry.key === fieldKey);
  return field?.options.find((option) => option.value === value)?.label ?? value ?? "-";
}

export function getSearchContextFields() {
  return CONTEXT_FIELDS.map((field) => ({
    ...field,
    options: [{ value: "", label: "Sans importance" }, ...field.options]
  }));
}

export function expandAssignment(assignment) {
  if (!assignment.fermentationProfile) {
    return assignment;
  }
  const profile = VARIABLES
    .find((entry) => entry.id === "fermentationProfile")
    ?.options.find((option) => option.value === assignment.fermentationProfile);

  if (!profile) {
    return assignment;
  }

  return {
    ...assignment,
    fermentationYeast: profile.fermentationYeast,
    fermentationTemp: profile.fermentationTemp,
    fermentationDuration: profile.fermentationDuration
  };
}

export function isEntryValid(assignment) {
  const hasFoulage = assignment.foulage && assignment.foulage !== "skip";
  const hasMaceration = assignment.maceration && assignment.maceration !== "skip";
  const hasPressuragePre = assignment.pressuragePre && assignment.pressuragePre !== "skip";
  return hasFoulage || hasMaceration || hasPressuragePre;
}

export function hasAnyPressurage(assignment) {
  const hasPressuragePre = assignment.pressuragePre && assignment.pressuragePre !== "skip";
  const hasPressuragePost = assignment.pressuragePost && assignment.pressuragePost !== "skip";
  return hasPressuragePre || hasPressuragePost;
}

export function createDefaultAssignment() {
  return expandAssignment({
    harvest: "mature",
    foulage: "skip",
    maceration: "skip",
    pressuragePre: "soft",
    fermentationProfile: "artificial|low|short",
    pressuragePost: "skip",
    malolactic: "no",
    elevage: "no",
    elevageType: "inox",
    elevageDuration: "short",
    elevageChauffe: "medium"
  });
}

export function getOrderedWineSteps(assignment = {}) {
  const hydrated = expandAssignment(assignment);
  return VARIABLES.filter((variable) => variable.active(hydrated)).map((variable) => ({
    ...variable,
    value: hydrated[variable.id] ?? variable.options[0]?.value ?? ""
  }));
}

export function sanitizeAssignment(assignment) {
  let next = expandAssignment({ ...assignment });

  for (const variable of VARIABLES) {
    if (variable.active(next)) {
      if (!variable.options.some((option) => option.value === next[variable.id])) {
        next[variable.id] = variable.options[0]?.value ?? "";
      }
    } else {
      delete next[variable.id];
      if (variable.id === "fermentationProfile") {
        delete next.fermentationYeast;
        delete next.fermentationTemp;
        delete next.fermentationDuration;
      }
    }
  }

  return expandAssignment(next);
}

function createBatchState(cepage) {
  return {
    sugar: cepage.sugar,
    acidity: cepage.acidity,
    tannins: cepage.tannins,
    alcohol: 0,
    primaryAroma: 1.5,
    secondaryAroma: 0.8,
    tertiaryAroma: 0.5
  };
}

function applyTerrainEffects(batch, assignment, context) {
  switch (assignment.harvest) {
    case "pre-mature":
      batch.sugar *= 0.9;
      batch.acidity *= 1.15;
      batch.tannins *= 0.9;
      break;
    case "post-mature":
      batch.sugar *= 1.15;
      batch.acidity *= 0.85;
      batch.tannins *= 1.05;
      break;
    default:
      break;
  }

  switch (context.soil) {
    case "clay":
      batch.acidity *= 0.95;
      batch.tannins *= 1.1;
      break;
    case "calcareous":
      batch.sugar *= 0.95;
      batch.acidity *= 1.1;
      break;
    case "sandy":
      batch.sugar *= 1.1;
      batch.acidity *= 0.9;
      batch.tannins *= 0.9;
      break;
    case "volcanic":
      batch.acidity *= 1.05;
      batch.tannins *= 1.05;
      break;
    case "schist":
      batch.sugar *= 1.05;
      batch.tannins *= 1.05;
      break;
    case "granitic":
      batch.acidity *= 1.05;
      batch.tannins *= 0.95;
      break;
    default:
      break;
  }

  switch (context.sun) {
    case "low":
      batch.sugar *= 0.9;
      batch.acidity *= 1.1;
      break;
    case "high":
      batch.sugar *= 1.1;
      batch.acidity *= 0.9;
      break;
    default:
      break;
  }

  switch (context.rain) {
    case "low":
      batch.sugar *= 1.1;
      batch.acidity *= 0.95;
      batch.tannins *= 1.1;
      break;
    case "high":
      batch.sugar *= 0.9;
      batch.acidity *= 1.1;
      batch.tannins *= 0.9;
      break;
    default:
      break;
  }
}

function applyExtractionEffects(batch, assignment) {
  switch (assignment.foulage) {
    case "partial":
      batch.tannins *= 2.5;
      batch.primaryAroma *= 1.05;
      break;
    case "full":
      batch.tannins *= 5;
      batch.primaryAroma *= 1.1;
      break;
    default:
      break;
    }

  switch (assignment.maceration) {
    case "short":
      batch.tannins *= 1.1;
      batch.primaryAroma *= 1.05;
      break;
    case "long":
      batch.tannins *= 1.3;
      batch.primaryAroma *= 1.1;
      break;
    default:
      break;
  }

  switch (assignment.pressuragePre) {
    case "soft":
      batch.tannins *= 0.4;
      batch.primaryAroma *= 0.95;
      break;
    case "hard":
      batch.tannins *= 0.6;
      batch.primaryAroma *= 0.9;
      break;
    default:
      break;
  }

  switch (assignment.pressuragePost) {
    case "soft":
      batch.tannins *= 0.4;
      batch.primaryAroma *= 0.95;
      break;
    case "hard":
      batch.tannins *= 0.6;
      batch.primaryAroma *= 0.9;
      break;
    default:
      break;
  }
}

function applyFermentationEffects(batch, cepage, assignment) {
  const sugarToAlcoholRatio =
    assignment.fermentationYeast === "indigenous"
      ? cepage.isRed ? 18 : 16.5
      : cepage.isRed ? 17.5 : 16;
  const tempMultiplier = assignment.fermentationTemp === "high" ? 1.05 : 0.95;
  const durationMultiplier = assignment.fermentationDuration === "long" ? 1.05 : 0.95;
  const fermentationEfficiency = tempMultiplier * durationMultiplier;
  const potentialAlcohol = batch.sugar / sugarToAlcoholRatio;
  const finalAlcohol = Math.min(potentialAlcohol * fermentationEfficiency, 15.5);
  const sugarConsumed = finalAlcohol * sugarToAlcoholRatio;

  batch.alcohol = finalAlcohol;
  batch.sugar = Math.max(0, batch.sugar - sugarConsumed);
  batch.primaryAroma *= assignment.fermentationYeast === "indigenous" ? 1.1 : 1;
  batch.secondaryAroma *= assignment.fermentationYeast === "artificial" ? 1.05 : 1;
  batch.secondaryAroma *= assignment.fermentationTemp === "high" ? 1.15 : 1;
  batch.secondaryAroma *= assignment.fermentationDuration === "short" ? 1.05 : 1.1;
  if (assignment.fermentationDuration === "long") {
    batch.secondaryAroma += 0.07;
  }
}

function applyMalolacticEffects(batch, assignment) {
  if (assignment.malolactic !== "yes") {
    return;
  }

  batch.acidity *= 0.75;
  batch.tertiaryAroma *= 1.25;
  batch.tertiaryAroma += batch.tertiaryAroma * 0.05;
}

function applyElevageEffects(batch, assignment) {
  if (assignment.elevage !== "yes") {
    return;
  }

  const typeMultiplier = {
    inox: { tannins: 1, tertiary: 1 },
    french_oak: { tannins: 1.05, tertiary: 1.15 },
    american_oak: { tannins: 1.1, tertiary: 1.2 }
  }[assignment.elevageType] ?? { tannins: 1, tertiary: 1 };

  const durationTannin = assignment.elevageDuration === "long" ? 1.1 : 1;
  const durationTertiary = assignment.elevageDuration === "long" ? 1.2 : 1;
  const chauffeMultiplier = {
    light: 1,
    medium: 1.08,
    strong: 1.16
  }[assignment.elevageChauffe] ?? 1;

  batch.tannins *= typeMultiplier.tannins * durationTannin;
  batch.tertiaryAroma *= typeMultiplier.tertiary * durationTertiary * (assignment.elevageType === "inox" ? 1 : chauffeMultiplier);
  if (assignment.elevageDuration === "long") {
    batch.tertiaryAroma += 0.07;
  }
}

export function simulateBatch(cepage, assignment, context) {
  const hydrated = sanitizeAssignment(assignment);
  const batch = createBatchState(cepage);
  applyTerrainEffects(batch, hydrated, context);
  applyExtractionEffects(batch, hydrated);

  if (isEntryValid(hydrated)) {
    applyFermentationEffects(batch, cepage, hydrated);
    applyMalolacticEffects(batch, hydrated);
    applyElevageEffects(batch, hydrated);
  }

  return batch;
}

export function inferWineType(cepage, assignment, context) {
  const hydrated = sanitizeAssignment(assignment);
  if (!isEntryValid(hydrated)) {
    return cepage.isRed ? "Rouge" : "Blanc";
  }

  const batch = simulateBatch(cepage, hydrated, context);
  const allRed = !!cepage.isRed;
  const anyRed = !!cepage.isRed;
  const anyWhite = !cepage.isRed;
  const allWhite = !cepage.isRed;
  const harvest = hydrated.harvest;
  const hasFermentationLong = hydrated.fermentationDuration === "long";
  const hasPressuragePre = hydrated.pressuragePre && hydrated.pressuragePre !== "skip";
  const hasFoulage = !!hydrated.foulage && hydrated.foulage !== "skip";
  const hasMacerationShort = hydrated.maceration === "short";
  const hasMacerationLong = hydrated.maceration === "long";
  const hasPressuragePost = hydrated.pressuragePost && hydrated.pressuragePost !== "skip";
  const hasMalo = hydrated.malolactic === "yes";
  const hasAnySkinExtraction = hasFoulage || hasMacerationShort || hasMacerationLong;
  const effervescentBase =
    hasPressuragePre &&
    harvest === "pre-mature" &&
    !hasFermentationLong &&
    !hasMacerationLong &&
    !hasFoulage &&
    !hasMalo;

  if (allWhite && listHas(blancEffervescents, cepage.name) && effervescentBase && !hasAnySkinExtraction) {
    return "Effervescent";
  }

  if (allRed && listHas(rougeEffervescents, cepage.name) && effervescentBase && !hasAnySkinExtraction) {
    return "Effervescent";
  }

  if (allRed && hasPressuragePre && !hasAnySkinExtraction && !hasPressuragePost) {
    return "Blanc de Noirs";
  }

  if (allRed && hasPressuragePre && hasAnySkinExtraction && !hasPressuragePost) {
    return "Rose";
  }

  if (allRed && (!hasPressuragePre || hasPressuragePost)) {
    return "Rouge";
  }

  if (allWhite && batch.sugar > 55) {
    return "Liquoreux";
  }

  if (allWhite && hasAnySkinExtraction) {
    return "Vin Orange";
  }

  if (allWhite && hasPressuragePre && !hasAnySkinExtraction && !hasPressuragePost) {
    return "Blanc";
  }

  if (!anyRed && anyWhite && hasPressuragePre && !hasAnySkinExtraction) {
    return "Blanc";
  }

  return cepage.isRed ? "Rouge" : "Blanc";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function roundRatio(value) {
  return Math.round(value * 100) / 100;
}

function getSweetnessLabel(type, sugar) {
  if (type === "Effervescent") {
    if (sugar < 4) return "Brut nature";
    if (sugar < 7) return "Extra-brut";
    if (sugar < 13) return "Brut";
    if (sugar < 18) return "Extra-sec";
    if (sugar < 33) return "Sec";
    if (sugar < 51) return "Demi-sec";
    return "Doux";
  }

  if (sugar < 4) return "Sec";
  if (sugar < 15) return "Demi-sec";
  if (sugar < 45) return "Doux";
  return "Liquoreux";
}

function getLevelLabel(value, ranges) {
  for (const range of ranges) {
    if (value < range.max) {
      return range.label;
    }
  }
  return ranges[ranges.length - 1]?.label ?? "";
}

function formatAromaLabel(value) {
  const labels = {
    vegetal: "Végétal",
    lemon: "Citron",
    apple: "Pomme",
    raspberry: "Framboise",
    green_pepper: "Poivron vert",
    bud: "Bourgeon",
    licorice: "Réglisse",
    cassis: "Cassis",
    exotic_fruits: "Fruits exotiques",
    coffee: "Café",
    tobacco: "Tabac",
    black_fruits: "Fruits noirs",
    spice: "Épices",
    resin: "Résine",
    flowers: "Fleurs",
    ripe_fruit: "Fruit mûr",
    hazelnut: "Noisette",
    almond: "Amande",
    citrus: "Agrumes",
    wax: "Cire",
    honey: "Miel",
    red_berries: "Fruits rouges",
    rose: "Rose",
    strawberry: "Fraise",
    red_currant: "Groseille",
    orange: "Orange",
    banana: "Banane",
    candy: "Bonbon",
    litchi: "Litchi",
    cinnamon: "Cannelle",
    ginger: "Gingembre",
    prune: "Prune",
    pepper: "Poivre",
    neutral: "Neutre",
    bread: "Pain",
    violet: "Violette",
    yellow_fruits: "Fruits jaunes",
    mineral: "Minéral",
    cherry: "Cerise",
    chocolate: "Chocolat",
    truffle: "Truffe",
    blueberry: "Myrtille",
    leather: "Cuir",
    apricot: "Abricot",
    peach: "Pêche",
    thyme: "Thym",
    rosemary: "Romarin",
    mango: "Mangue",
    passion_fruit: "Fruit de la passion",
    coing: "Coing",
    mirabelle_plum: "Mirabelle",
    smoky: "Fumé",
    mushroom: "Champignon",
    lime_tree: "Tilleul",
    pear: "Poire",
    dried_fruits: "Fruits secs",
    buis: "Buis",
    asparagus: "Asperge",
    dried_apricot: "Abricot sec",
    blackberry: "Mûre",
    black_olive: "Olive noire",
    tea: "Thé"
  };
  return labels[value] ?? value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

function computeProcessAromaMarker(assignment) {
  let secondaryAroma = 0.8;
  secondaryAroma *= assignment.fermentationYeast === "artificial" ? 1.05 : 1;
  secondaryAroma *= assignment.fermentationTemp === "high" ? 1.15 : 1;
  secondaryAroma *= assignment.fermentationDuration === "short" ? 1.05 : 1.1;
  if (assignment.fermentationDuration === "long") {
    secondaryAroma += 0.07;
  }
  return secondaryAroma >= 1.1 ? "Fleurs fraîches" : "Levure";
}

function buildAssignmentDescriptor(assignment) {
  const hasFoulage = assignment.foulage && assignment.foulage !== "skip";
  const hasMaceration = assignment.maceration && assignment.maceration !== "skip";
  const hasPressuragePre = assignment.pressuragePre && assignment.pressuragePre !== "skip";
  const hasPressuragePost = assignment.pressuragePost && assignment.pressuragePost !== "skip";
  const hasMalo = assignment.malolactic === "yes";
  const hasElevage = assignment.elevage === "yes";
  const hasSkinExtraction = hasFoulage || hasMaceration;
  const processAromas = new Set([computeProcessAromaMarker(assignment)]);

  if (hasMalo) {
    processAromas.add("Beurre");
  }

  if (hasElevage) {
    if (assignment.elevageType === "french_oak") {
      processAromas.add("Vanille");
    } else if (assignment.elevageType === "american_oak") {
      processAromas.add("Toasté");
      processAromas.add("Cacao");
      processAromas.add("Fumé");
    } else {
      processAromas.add("Profondeur");
    }

    if (assignment.elevageType !== "inox") {
      if (assignment.elevageChauffe === "light") {
        processAromas.add("Noix de coco");
        processAromas.add("Fruits secs");
      } else if (assignment.elevageChauffe === "medium") {
        processAromas.add("Pain grillé");
      } else if (assignment.elevageChauffe === "strong") {
        processAromas.add("Torréfié");
        processAromas.add("Brûlé");
      }
    }
  }

  return {
    assignment,
    key: JSON.stringify(assignment),
    hasFoulage,
    hasMaceration,
    hasPressuragePre,
    hasPressuragePost,
    hasMalo,
    hasElevage,
    hasSkinExtraction,
    fermentationLong: assignment.fermentationDuration === "long",
    macerationLong: assignment.maceration === "long",
    elevageLong: assignment.elevageDuration === "long",
    elevageType: assignment.elevageType,
    processAromas
  };
}

function canPotentiallyProduceType(descriptor, cepage, type) {
  const isRed = !!cepage.isRed;
  switch (type) {
    case "Effervescent":
      if (isRed) {
        return listHas(rougeEffervescents, cepage.name) &&
          descriptor.hasPressuragePre &&
          !descriptor.fermentationLong &&
          !descriptor.macerationLong &&
          !descriptor.hasFoulage &&
          !descriptor.hasMalo;
      }
      return listHas(blancEffervescents, cepage.name) &&
        descriptor.hasPressuragePre &&
        !descriptor.fermentationLong &&
        !descriptor.macerationLong &&
        !descriptor.hasFoulage &&
        !descriptor.hasMalo;
    case "Blanc":
      return !isRed && descriptor.hasPressuragePre && !descriptor.hasSkinExtraction && !descriptor.hasPressuragePost;
    case "Blanc de Noirs":
      return isRed && descriptor.hasPressuragePre && !descriptor.hasSkinExtraction && !descriptor.hasPressuragePost;
    case "Vin Orange":
      return !isRed && descriptor.hasSkinExtraction;
    case "Rose":
      return isRed && descriptor.hasPressuragePre && descriptor.hasSkinExtraction && !descriptor.hasPressuragePost;
    case "Rouge":
      return isRed && (!descriptor.hasPressuragePre || descriptor.hasPressuragePost);
    case "Liquoreux":
      return !isRed;
    default:
      return true;
  }
}

function canPotentiallyProduceDistinctiveStyle(style, descriptor, cepage) {
  switch (style) {
    case "Orange classique":
      return !cepage.isRed && descriptor.hasSkinExtraction && listHas(orangeStars, cepage.name);
    case "Orange expérimental":
      return !cepage.isRed && descriptor.hasSkinExtraction && !listHas(orangeStars, cepage.name);
    case "Style ambré":
      return !cepage.isRed && descriptor.hasSkinExtraction;
    case "Style noble":
      return !cepage.isRed && listHas(liquoreuxStars, cepage.name);
    case "Vendange tardive":
      return !cepage.isRed && !listHas(liquoreuxStars, cepage.name);
    case "Évolué":
      return descriptor.hasMalo || descriptor.hasElevage || (descriptor.elevageLong && cepage.tertiaryAromas.length > 0);
    case "Aromatique":
      return cepage.primaryAromas.length > 0;
    default:
      return true;
  }
}

function canPotentiallyProduceAroma(note, descriptor, cepage) {
  if (cepage.primaryAromas.some((value) => formatAromaLabel(value) === note)) {
    return true;
  }

  if (descriptor.fermentationLong && cepage.secondaryAromas.some((value) => formatAromaLabel(value) === note)) {
    return true;
  }

  if (descriptor.elevageLong && descriptor.hasElevage && cepage.tertiaryAromas.some((value) => formatAromaLabel(value) === note)) {
    return true;
  }

  return descriptor.processAromas.has(note);
}

function canCepagePotentiallyProduceAroma(note, cepage) {
  if (cepage.primaryAromas.some((value) => formatAromaLabel(value) === note)) {
    return true;
  }
  if (cepage.secondaryAromas.some((value) => formatAromaLabel(value) === note)) {
    return true;
  }
  if (cepage.tertiaryAromas.some((value) => formatAromaLabel(value) === note)) {
    return true;
  }

  return [
    "Vanille",
    "Toasté",
    "Cacao",
    "Fumé",
    "Profondeur",
    "Beurre",
    "Noix de coco",
    "Fruits secs",
    "Pain grillé",
    "Torréfié",
    "Brûlé",
    "Fleurs fraîches",
    "Levure"
  ].includes(note);
}

function getCepageSearchLowerBound(criteria, cepage) {
  let penalty = 0;
  let priority = 0;

  if (criteria.type) {
    const typeCompatible =
      (criteria.type === "Rose" && cepage.isRed) ||
      (criteria.type === "Rouge" && cepage.isRed) ||
      (criteria.type === "Blanc de Noirs" && cepage.isRed) ||
      (criteria.type === "Effervescent") ||
      ((criteria.type === "Blanc" || criteria.type === "Vin Orange" || criteria.type === "Liquoreux") && !cepage.isRed);
    if (!typeCompatible) {
      penalty += 80;
    }
  }

  if (criteria.distinctiveStyles?.length) {
    for (const style of criteria.distinctiveStyles) {
      const possible = canPotentiallyProduceDistinctiveStyle(style, {
        hasSkinExtraction: !cepage.isRed,
        hasMalo: true,
        hasElevage: true,
        elevageLong: true
      }, cepage);
      if (possible) {
        priority += 9;
      } else {
        penalty += 20;
      }
    }
  }

  if (criteria.aromaNotes?.length) {
    for (const note of criteria.aromaNotes) {
      if (canCepagePotentiallyProduceAroma(note, cepage)) {
        priority += 7;
      } else {
        penalty += 14;
      }
    }
  }

  return { penalty, priority };
}

function getSearchLowerBound(criteria, descriptor, cepage) {
  let penalty = 0;
  let priority = 0;

  if (criteria.type) {
    if (canPotentiallyProduceType(descriptor, cepage, criteria.type)) {
      priority += 32;
    } else {
      penalty += 80;
    }
  }

  if (criteria.distinctiveStyles?.length) {
    for (const style of criteria.distinctiveStyles) {
      if (canPotentiallyProduceDistinctiveStyle(style, descriptor, cepage)) {
        priority += 9;
      } else {
        penalty += 20;
      }
    }
  }

  if (criteria.aromaNotes?.length) {
    for (const note of criteria.aromaNotes) {
      if (canPotentiallyProduceAroma(note, descriptor, cepage)) {
        priority += 5;
      } else {
        penalty += 14;
      }
    }
  }

  return { penalty, priority };
}

function getContextSignature(contexts) {
  return contexts
    .map((entry) => `${entry.soil}:${entry.sun}:${entry.rain}`)
    .sort()
    .join("|");
}

function getTerrainBoundsForHarvest(cepage, harvest, contexts, cache) {
  const key = `${cepage.id}|${harvest}|${getContextSignature(contexts)}`;
  if (cache.has(key)) {
    return cache.get(key);
  }

  const bounds = {
    sugarMin: Infinity,
    sugarMax: -Infinity,
    acidityMin: Infinity,
    acidityMax: -Infinity,
    tanninsMin: Infinity,
    tanninsMax: -Infinity
  };

  for (const context of contexts) {
    const batch = createBatchState(cepage);
    applyTerrainEffects(batch, { harvest }, context);
    bounds.sugarMin = Math.min(bounds.sugarMin, batch.sugar);
    bounds.sugarMax = Math.max(bounds.sugarMax, batch.sugar);
    bounds.acidityMin = Math.min(bounds.acidityMin, batch.acidity);
    bounds.acidityMax = Math.max(bounds.acidityMax, batch.acidity);
    bounds.tanninsMin = Math.min(bounds.tanninsMin, batch.tannins);
    bounds.tanninsMax = Math.max(bounds.tanninsMax, batch.tannins);
  }

  cache.set(key, bounds);
  return bounds;
}

function getTanninsMultiplier(assignment) {
  let multiplier = 1;

  if (assignment.foulage === "partial") {
    multiplier *= 2.5;
  } else if (assignment.foulage === "full") {
    multiplier *= 5;
  }

  if (assignment.maceration === "short") {
    multiplier *= 1.1;
  } else if (assignment.maceration === "long") {
    multiplier *= 1.3;
  }

  if (assignment.pressuragePre === "soft") {
    multiplier *= 0.4;
  } else if (assignment.pressuragePre === "hard") {
    multiplier *= 0.6;
  }

  if (assignment.pressuragePost === "soft") {
    multiplier *= 0.4;
  } else if (assignment.pressuragePost === "hard") {
    multiplier *= 0.6;
  }

  if (assignment.elevage === "yes") {
    if (assignment.elevageType === "french_oak") {
      multiplier *= 1.05;
    } else if (assignment.elevageType === "american_oak") {
      multiplier *= 1.1;
    }

    if (assignment.elevageDuration === "long") {
      multiplier *= 1.1;
    }
  }

  return multiplier;
}

function getFermentationConfig(cepage, assignment) {
  const ratio =
    assignment.fermentationYeast === "indigenous"
      ? cepage.isRed ? 18 : 16.5
      : cepage.isRed ? 17.5 : 16;
  const efficiency =
    (assignment.fermentationTemp === "high" ? 1.05 : 0.95) *
    (assignment.fermentationDuration === "long" ? 1.05 : 0.95);

  return { ratio, efficiency };
}

function getAlcoholFromSugar(sugar, cepage, assignment) {
  const { ratio, efficiency } = getFermentationConfig(cepage, assignment);
  return Math.min((sugar / ratio) * efficiency, 15.5);
}

function getResidualSugarFromSugar(sugar, cepage, assignment) {
  const { ratio } = getFermentationConfig(cepage, assignment);
  const alcohol = getAlcoholFromSugar(sugar, cepage, assignment);
  return Math.max(0, sugar - alcohol * ratio);
}

function getNumericBoundsForDescriptor(cepage, descriptor, contexts, cache) {
  const terrainBounds = getTerrainBoundsForHarvest(cepage, descriptor.assignment.harvest, contexts, cache);
  const tanninsMultiplier = getTanninsMultiplier(descriptor.assignment);
  const acidityMultiplier = descriptor.assignment.malolactic === "yes" ? 0.75 : 1;

  return {
    alcoholMin: getAlcoholFromSugar(terrainBounds.sugarMin, cepage, descriptor.assignment),
    alcoholMax: getAlcoholFromSugar(terrainBounds.sugarMax, cepage, descriptor.assignment),
    sugarMin: getResidualSugarFromSugar(terrainBounds.sugarMin, cepage, descriptor.assignment),
    sugarMax: getResidualSugarFromSugar(terrainBounds.sugarMax, cepage, descriptor.assignment),
    acidityMin: terrainBounds.acidityMin * acidityMultiplier,
    acidityMax: terrainBounds.acidityMax * acidityMultiplier,
    tanninsMin: terrainBounds.tanninsMin * tanninsMultiplier,
    tanninsMax: terrainBounds.tanninsMax * tanninsMultiplier
  };
}

function getIntervalDistancePenalty(valueMin, valueMax, targetMin, targetMax, weight) {
  let penalty = 0;
  let priority = 0;

  if (targetMin !== "" && valueMax < Number(targetMin)) {
    penalty += (Number(targetMin) - valueMax) * weight;
  } else if (targetMin !== "") {
    priority += weight * 0.2;
  }

  if (targetMax !== "" && valueMin > Number(targetMax)) {
    penalty += (valueMin - Number(targetMax)) * weight;
  } else if (targetMax !== "") {
    priority += weight * 0.2;
  }

  return { penalty, priority };
}

function getNumericSearchLowerBound(criteria, bounds) {
  let penalty = 0;
  let priority = 0;

  const intervals = [
    ["alcohol", bounds.alcoholMin, bounds.alcoholMax, criteria.alcoholMin, criteria.alcoholMax, 10],
    ["sugar", bounds.sugarMin, bounds.sugarMax, criteria.sugarMin, criteria.sugarMax, 2],
    ["acidity", bounds.acidityMin, bounds.acidityMax, criteria.acidityMin, criteria.acidityMax, 12],
    ["tannins", bounds.tanninsMin, bounds.tanninsMax, criteria.tanninsMin, criteria.tanninsMax, 1.5]
  ];

  for (const [, valueMin, valueMax, targetMin, targetMax, weight] of intervals) {
    const interval = getIntervalDistancePenalty(valueMin, valueMax, targetMin, targetMax, weight);
    penalty += interval.penalty;
    priority += interval.priority;
  }

  return { penalty, priority };
}

export function getAllWineAromaOptions() {
  const values = new Set();
  for (const cepage of CEPAGE_DATA) {
    cepage.primaryAromas.forEach((value) => values.add(formatAromaLabel(value)));
    cepage.secondaryAromas.forEach((value) => values.add(formatAromaLabel(value)));
    cepage.tertiaryAromas.forEach((value) => values.add(formatAromaLabel(value)));
  }

  [
    "Vanille",
    "Toasté",
    "Cacao",
    "Fumé",
    "Profondeur",
    "Beurre",
    "Noix de coco",
    "Fruits secs",
    "Pain grillé",
    "Torréfié",
    "Brûlé",
    "Fleurs fraîches",
    "Levure"
  ].forEach((value) => values.add(value));

  return [...values]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value, label: value }));
}

function getAromaProfile(cepage, resultType, batch, assignment) {
  const primary = cepage.primaryAromas
    .slice(0, batch.primaryAroma >= 1.6 ? 3 : 2)
    .map(formatAromaLabel);
  const secondary = [];
  const tertiary = [];
  const profile = [...primary, ...secondary, ...tertiary];

  if (assignment.fermentationDuration === "long" && cepage.secondaryAromas.length) {
    secondary.push(...cepage.secondaryAromas.map(formatAromaLabel));
  }
  secondary.push(batch.secondaryAroma >= 1.1 ? "Fleurs fraîches" : "Levure");

  if (assignment.elevage === "yes") {
    if (assignment.elevageType === "french_oak") {
      tertiary.push("Vanille");
    } else if (assignment.elevageType === "american_oak") {
      tertiary.push("Toasté", "Cacao", "Fumé");
    } else {
      tertiary.push("Profondeur");
    }
  }
  if (assignment.malolactic === "yes") {
    tertiary.push("Beurre");
  }
  if (assignment.elevage === "yes" && assignment.elevageType !== "inox") {
    if (assignment.elevageChauffe === "light") {
      tertiary.push("Noix de coco", "Fruits secs");
    } else if (assignment.elevageChauffe === "medium") {
      tertiary.push("Pain grillé");
    } else if (assignment.elevageChauffe === "strong") {
      tertiary.push("Torréfié", "Brûlé");
    }
  }
  if (assignment.elevage === "yes" && assignment.elevageDuration === "long" && cepage.tertiaryAromas.length) {
    tertiary.push(...cepage.tertiaryAromas.map(formatAromaLabel));
  }
  profile.push(...secondary, ...tertiary);

  return {
    primary: [...new Set(primary)],
    secondary: [...new Set(secondary)],
    tertiary: [...new Set(tertiary)],
    highlights: [...new Set(profile)].slice(0, 6)
  };
}

function normalizeAromaBalance(batch, aromaProfile) {
  const primaryValue = aromaProfile.primary.length ? batch.primaryAroma : 0;
  const secondaryValue = aromaProfile.secondary.length ? batch.secondaryAroma : 0;
  const tertiaryValue = aromaProfile.tertiary.length ? batch.tertiaryAroma : 0;
  const total = primaryValue + secondaryValue + tertiaryValue;

  if (total <= 0) {
    return {
      values: { primary: 0, secondary: 0, tertiary: 0 },
      ratios: { primary: 0, secondary: 0, tertiary: 0 }
    };
  }

  return {
    values: {
      primary: round(primaryValue / total),
      secondary: round(secondaryValue / total),
      tertiary: round(tertiaryValue / total)
    },
    ratios: {
      primary: roundRatio(primaryValue / total),
      secondary: roundRatio(secondaryValue / total),
      tertiary: roundRatio(tertiaryValue / total)
    }
  };
}

function getVisualColor(type, cepage, batch) {
  if (type === "Rouge") return cepage.tannins > 50 ? "#6d1220" : "#8c2436";
  if (type === "Rose") return "#ca6f87";
  if (type === "Vin Orange") return "#b56b22";
  if (type === "Liquoreux") return "#b1812f";
  if (type === "Effervescent") return "#77b9c6";
  if (type === "Blanc de Noirs") return "#ddc88f";
  return batch.acidity > 6.8 ? "#d8c46d" : "#beaa4a";
}

function buildRadar(batch, assignment, type) {
  const bodyValue = clamp(
    (
      (batch.alcohol / 15.5) * 0.5 +
      (batch.sugar / MAX_WINE_SUGAR) * 0.15 +
      (batch.tannins / MAX_WINE_TANNINS) * 0.25 +
      (assignment.elevage === "yes" ? 0.1 : 0)
    ) * 100,
    0,
    100
  );

  return [
    { label: "Acidité", value: clamp((batch.acidity / MAX_WINE_ACIDITY) * 100, 0, 100) },
    { label: "Tanins", value: clamp((batch.tannins / MAX_WINE_TANNINS) * 100, 0, 100) },
    { label: "Alcool", value: clamp((batch.alcohol / 15.5) * 100, 0, 100) },
    { label: "Sucre", value: clamp((batch.sugar / MAX_WINE_SUGAR) * 100, 0, 100) },
    { label: "Corps", value: bodyValue }
  ];
}

function getStructureLabel(batch, assignment) {
  if (assignment.elevage === "yes" && batch.alcohol > 13) return "Charpente ample";
  if (batch.tannins > 40) return "Structure puissante";
  if (batch.acidity > 7) return "Structure tendue";
  return "Structure souple";
}

function getStyleSentence(type, batch, assignment) {
  const sweetness = getSweetnessLabel(type, batch.sugar);
  const notes = [sweetness];
  if (batch.alcohol > 13.5) notes.push("Corsé");
  else if (batch.alcohol < 10) notes.push("Léger");
  if (batch.acidity > 7) notes.push("Vif");
  else if (batch.acidity < 4) notes.push("Souple");
  if (batch.tannins > 45) notes.push("Tannique");
  return notes.join(" · ");
}

function getDistinctiveStyles(cepage, type, batch, assignment, aromaRatios) {
  const styles = [];

  if (type === "Vin Orange") {
    styles.push(orangeStars.some((name) => normalizeName(name) === normalizeName(cepage.name)) ? "Orange classique" : "Orange expérimental");
  }

  if (type === "Liquoreux") {
    if ((assignment.foulage && assignment.foulage !== "skip") || (assignment.maceration && assignment.maceration !== "skip")) {
      styles.push("Style ambré");
    }
    styles.push(liquoreuxStars.some((name) => normalizeName(name) === normalizeName(cepage.name)) ? "Style noble" : "Vendange tardive");
  }

  if (batch.acidity > 7) {
    styles.push("Vif");
  } else if (batch.acidity < 4) {
    styles.push("Souple");
  }

  if (batch.tannins > 30) {
    styles.push("Tannique");
  }

  if (aromaRatios.primary > 0.5) {
    styles.push("Aromatique");
  }
  if (aromaRatios.tertiary > 0.25) {
    styles.push("Évolué");
  }

  return styles;
}

export function getWineDistinctiveStyleOptions() {
  return [
    "Orange classique",
    "Orange expérimental",
    "Style ambré",
    "Style noble",
    "Vendange tardive",
    "Aromatique",
    "Évolué"
  ].map((value) => ({ value, label: value }));
}

export function simulateWineRecipe(cepageId, context, assignment) {
  const cepage = getCepageById(cepageId);
  const sanitized = sanitizeAssignment(assignment);
  const batch = simulateBatch(cepage, sanitized, context);
  const type = inferWineType(cepage, sanitized, context);
  const sweetness = getSweetnessLabel(type, batch.sugar);
  const acidityLabel = getLevelLabel(batch.acidity, [
    { max: 5.2, label: "Basse" },
    { max: 6.6, label: "Moyenne" },
    { max: 7.6, label: "Vive" },
    { max: Infinity, label: "Très vive" }
  ]);
  const tanninLabel = getLevelLabel(batch.tannins, [
    { max: 10, label: "Très faible" },
    { max: 20, label: "Faible" },
    { max: 30, label: "Moyen" },
    { max: 45, label: "Élevé" },
    { max: Infinity, label: "Très élevé" }
  ]);
  const sugarLabel = getLevelLabel(batch.sugar, [
    { max: 4, label: "Très sec" },
    { max: 12, label: "Sec" },
    { max: 30, label: "Tendre" },
    { max: 55, label: "Moelleux" },
    { max: Infinity, label: "Liquoreux" }
  ]);
  const aromaProfile = getAromaProfile(cepage, type, batch, sanitized);
  const aromaBalance = normalizeAromaBalance(batch, aromaProfile);
  const distinctiveStyles = getDistinctiveStyles(cepage, type, batch, sanitized, aromaBalance.ratios);

  return {
    cepage,
    context,
    assignment: sanitized,
    type,
    style: getStyleSentence(type, batch, sanitized),
    distinctiveStyles,
    sweetness,
    alcohol: round(batch.alcohol),
    sugar: round(batch.sugar),
    acidity: round(batch.acidity),
    tannins: round(batch.tannins),
    acidityLabel,
    tanninLabel,
    sugarLabel,
    structure: getStructureLabel(batch, sanitized),
    aromaProfile,
    aromas: aromaProfile.highlights,
    color: getVisualColor(type, cepage, batch),
    radar: buildRadar(batch, sanitized, type),
    gauges: {
      alcohol: {
        percent: clamp((batch.alcohol / 15.5) * 100, 0, 100),
        label: batch.alcohol > 13.5 ? "Vin puissant" : batch.alcohol < 11 ? "Vin léger" : "Vin équilibré"
      },
      acidity: {
        percent: clamp((batch.acidity / MAX_WINE_ACIDITY) * 100, 0, 100),
        label: acidityLabel
      },
      sugar: {
        percent: clamp((batch.sugar / MAX_WINE_SUGAR) * 100, 0, 100),
        label: sweetness
      },
      tannins: {
        percent: clamp((batch.tannins / MAX_WINE_TANNINS) * 100, 0, 100),
        label: tanninLabel
      }
    },
    aromasBalance: aromaBalance.values,
    aromaRatios: aromaBalance.ratios
  };
}

export function formatWineStepSummary(assignment, context) {
  const hydrated = sanitizeAssignment(assignment);
  const steps = [];

  if (context) {
    steps.push({
      id: "terroir",
      label: "Terroir",
      value: `${getContextLabel("soil", context.soil)} / ${getContextLabel("sun", context.sun)} / ${getContextLabel("rain", context.rain)}`
    });
  }

  const harvestLabel = VARIABLES
    .find((variable) => variable.id === "harvest")
    ?.options.find((option) => option.value === hydrated.harvest)?.label ?? hydrated.harvest;
  steps.push({ id: "harvest", label: "Vendange", value: harvestLabel });

  if (hydrated.foulage && hydrated.foulage !== "skip") {
    const foulageLabel = VARIABLES
      .find((variable) => variable.id === "foulage")
      ?.options.find((option) => option.value === hydrated.foulage)?.label ?? hydrated.foulage;
    steps.push({ id: "foulage", label: "Foulage", value: foulageLabel });
  }

  if (hydrated.maceration && hydrated.maceration !== "skip") {
    const macerationLabel = VARIABLES
      .find((variable) => variable.id === "maceration")
      ?.options.find((option) => option.value === hydrated.maceration)?.label ?? hydrated.maceration;
    steps.push({ id: "maceration", label: "Macération", value: macerationLabel });
  }

  if ((hydrated.pressuragePre && hydrated.pressuragePre !== "skip") || (hydrated.pressuragePost && hydrated.pressuragePost !== "skip")) {
    const pressureValues = [];

    if (hydrated.pressuragePre && hydrated.pressuragePre !== "skip") {
      const preLabel = VARIABLES
        .find((variable) => variable.id === "pressuragePre")
        ?.options.find((option) => option.value === hydrated.pressuragePre)?.label ?? hydrated.pressuragePre;
      pressureValues.push(preLabel);
    }

    if (hydrated.pressuragePost && hydrated.pressuragePost !== "skip") {
      const postLabel = VARIABLES
        .find((variable) => variable.id === "pressuragePost")
        ?.options.find((option) => option.value === hydrated.pressuragePost)?.label ?? hydrated.pressuragePost;
      pressureValues.push(postLabel);
    }

    steps.push({ id: "pressurage", label: "Pressurage", value: pressureValues.join(" / ") });
  }

  const fermentationLabel = VARIABLES
    .find((variable) => variable.id === "fermentationProfile")
    ?.options.find((option) => option.value === hydrated.fermentationProfile)?.label ?? hydrated.fermentationProfile;
  steps.push({ id: "fermentation", label: "Fermentation", value: fermentationLabel });

  if (hydrated.malolactic === "yes") {
    steps.push({ id: "malolactic", label: "Malolactique", value: "Oui" });
  }

  if (hydrated.elevage === "yes") {
    const elevageParts = [
      {
        inox: "Cuve inox",
        french_oak: "Fût français",
        american_oak: "Fût américain"
      }[hydrated.elevageType] ?? hydrated.elevageType,
      hydrated.elevageDuration === "long" ? "Long" : "Court"
    ];

    if (hydrated.elevageType !== "inox") {
      elevageParts.push(
        {
          light: "Légère",
          medium: "Moyenne",
          strong: "Forte"
        }[hydrated.elevageChauffe] ?? hydrated.elevageChauffe
      );
    }

    steps.push({ id: "elevage", label: "Élevage", value: elevageParts.join(" / ") });
  }

  return steps;
}

function enumerateAssignmentsForContext() {
  const assignments = [];

  function expandElevageVariants(assignment) {
    const hydrated = sanitizeAssignment(assignment);
    if (hydrated.elevage !== "yes") {
      assignments.push(hydrated);
      return;
    }

    const elevageTypes = ["inox", "french_oak", "american_oak"];
    const elevageDurations = ["short", "long"];
    const elevageChauffes = ["light", "medium", "strong"];

    for (const elevageType of elevageTypes) {
      for (const elevageDuration of elevageDurations) {
        if (elevageType === "inox") {
          assignments.push(
            sanitizeAssignment({
              ...hydrated,
              elevageType,
              elevageDuration,
              elevageChauffe: "medium"
            })
          );
          continue;
        }

        for (const elevageChauffe of elevageChauffes) {
          assignments.push(
            sanitizeAssignment({
              ...hydrated,
              elevageType,
              elevageDuration,
              elevageChauffe
            })
          );
        }
      }
    }
  }

  function walk(index, assignment) {
    if (index >= VARIABLES.length) {
      expandElevageVariants(assignment);
      return;
    }

    const variable = VARIABLES[index];
    const hydrated = sanitizeAssignment(assignment);

    if (!variable.active(hydrated)) {
      walk(index + 1, hydrated);
      return;
    }

    for (const option of variable.options) {
      const next =
        variable.id === "fermentationProfile"
          ? expandAssignment({ ...hydrated, fermentationProfile: option.value })
          : { ...hydrated, [variable.id]: option.value };
      walk(index + 1, next);
    }
  }

  walk(0, {});

  const unique = new Map();
  for (const assignment of assignments) {
    unique.set(JSON.stringify(assignment), assignment);
  }
  return Array.from(unique.values());
}

const assignmentCache = enumerateAssignmentsForContext();
const assignmentDescriptorCache = assignmentCache.map(buildAssignmentDescriptor);

export function enumerateWineRecipes(context) {
  const recipes = [];

  for (const cepage of CEPAGE_DATA) {
    for (const assignment of assignmentCache) {
      if (!isEntryValid(assignment)) {
        continue;
      }
      const simulated = simulateWineRecipe(cepage.id, context, assignment);
      recipes.push(simulated);
    }
  }

  return recipes;
}

function getRecipeScore(recipe, criteria) {
  let penalty = 0;
  let exactPenalty = 0;
  let matchedStyles = 0;
  let matchedAromas = 0;

  if (criteria.type && recipe.type !== criteria.type) {
    exactPenalty += 80;
  }
  if (criteria.cepageId && recipe.cepage.id !== criteria.cepageId) {
    exactPenalty += 40;
  }

  const numericComparisons = [
    ["alcohol", recipe.alcohol, criteria.alcoholMin, criteria.alcoholMax, 10],
    ["sugar", recipe.sugar, criteria.sugarMin, criteria.sugarMax, 2],
    ["acidity", recipe.acidity, criteria.acidityMin, criteria.acidityMax, 12],
    ["tannins", recipe.tannins, criteria.tanninsMin, criteria.tanninsMax, 1.5]
  ];

  for (const [, value, min, max, weight] of numericComparisons) {
    if (min !== "" && value < Number(min)) {
      penalty += (Number(min) - value) * weight;
    }
    if (max !== "" && value > Number(max)) {
      penalty += (value - Number(max)) * weight;
    }
  }

  if (criteria.distinctiveStyles?.length) {
    for (const style of criteria.distinctiveStyles) {
      if (!recipe.distinctiveStyles.includes(style)) {
        penalty += criteria.priorityMode === "styles" ? 42 : 20;
      } else {
        matchedStyles += 1;
      }
    }
  }

  if (criteria.aromaNotes?.length) {
    for (const note of criteria.aromaNotes) {
      if (!recipe.aromas.some((aroma) => normalizeName(aroma) === normalizeName(note))) {
        penalty += criteria.priorityMode === "aromas" ? 34 : 14;
      } else {
        matchedAromas += 1;
      }
    }
  }

  const totalPenalty = penalty + exactPenalty;
  const scorePercent = round(100 / (1 + totalPenalty / 100));
  return {
    penalty: round(totalPenalty),
    scorePercent: Math.max(0, Math.min(100, scorePercent)),
    matchedStyles,
    matchedAromas,
    missingStyles: Math.max(0, (criteria.distinctiveStyles?.length ?? 0) - matchedStyles),
    missingAromas: Math.max(0, (criteria.aromaNotes?.length ?? 0) - matchedAromas)
  };
}

function compareRecipeResults(left, right, criteria = {}) {
  if (criteria.priorityMode === "aromas") {
    return (
      right.matchedAromas - left.matchedAromas ||
      left.missingAromas - right.missingAromas ||
      right.scorePercent - left.scorePercent ||
      left.penalty - right.penalty ||
      left.cepage.name.localeCompare(right.cepage.name)
    );
  }

  if (criteria.priorityMode === "styles") {
    return (
      right.matchedStyles - left.matchedStyles ||
      left.missingStyles - right.missingStyles ||
      right.scorePercent - left.scorePercent ||
      left.penalty - right.penalty ||
      left.cepage.name.localeCompare(right.cepage.name)
    );
  }

  return right.scorePercent - left.scorePercent || left.penalty - right.penalty || left.cepage.name.localeCompare(right.cepage.name);
}

function pushTopRecipe(bucket, recipe, criteria, limit = 24) {
  const scoreKey = recipe.scorePercent.toFixed(1);
  const existingIndex = bucket.findIndex((entry) => entry.scorePercent.toFixed(1) === scoreKey);

  if (existingIndex >= 0) {
    if (compareRecipeResults(recipe, bucket[existingIndex], criteria) > 0) {
      return;
    }
    bucket[existingIndex] = recipe;
  } else {
    bucket.push(recipe);
  }

  bucket.sort((left, right) => compareRecipeResults(left, right, criteria));
  if (bucket.length > limit) {
    bucket.length = limit;
  }
}

function getDistinctScoreRecipes(recipes, limit = 5) {
  return recipes.slice(0, limit);
}

function countDistinctScores(recipes) {
  return recipes.length;
}

function getWorstDistinctPenalty(recipes, limit = 3) {
  const distinct = getDistinctScoreRecipes(recipes, limit);
  if (distinct.length < limit) {
    return Infinity;
  }
  return distinct[distinct.length - 1].penalty;
}

function expandSearchContexts(context) {
  const soils = context.soil ? [context.soil] : CONTEXT_FIELDS.find((field) => field.key === "soil").options.map((option) => option.value);
  const suns = context.sun ? [context.sun] : CONTEXT_FIELDS.find((field) => field.key === "sun").options.map((option) => option.value);
  const rains = context.rain ? [context.rain] : CONTEXT_FIELDS.find((field) => field.key === "rain").options.map((option) => option.value);

  const contexts = [];
  for (const soil of soils) {
    for (const sun of suns) {
      for (const rain of rains) {
        contexts.push({ soil, sun, rain });
      }
    }
  }
  return contexts;
}

export function findClosestWineRecipes(context, criteria) {
  const results = [];
  const candidateCepages = getCandidateCepages(criteria)
    .map((cepage) => ({ cepage, ...getCepageSearchLowerBound(criteria, cepage) }))
    .sort((left, right) => left.penalty - right.penalty || right.priority - left.priority)
    .map((entry) => entry.cepage);
  const contexts = expandSearchContexts(context);
  const terrainBoundsCache = new Map();
  const distinctTarget = 3;
  const startedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
  const softTimeBudgetMs = 2000;
  const hardTimeBudgetMs = 25000;
  const hardEvaluationBudget = 2000000;
  const minVisitedCepages = Math.min(3, candidateCepages.length);
  let evaluatedRecipes = 0;
  let shouldStop = false;
  let visitedCepages = 0;

  function getElapsedMs() {
    return (typeof performance !== "undefined" ? performance.now() : Date.now()) - startedAt;
  }

  for (const cepage of candidateCepages) {
    if (shouldStop) {
      break;
    }
    visitedCepages += 1;

    const rankedDescriptors = assignmentDescriptorCache
      .map((descriptor) => {
        const searchBounds = getSearchLowerBound(criteria, descriptor, cepage);
        const numericBounds = getNumericBoundsForDescriptor(cepage, descriptor, contexts, terrainBoundsCache);
        const numericBound = getNumericSearchLowerBound(criteria, numericBounds);
        return {
          descriptor,
          penalty: round(searchBounds.penalty + numericBound.penalty),
          priority: searchBounds.priority + numericBound.priority
        };
      })
      .sort((left, right) => left.penalty - right.penalty || right.priority - left.priority);

    for (const ranked of rankedDescriptors) {
      if (shouldStop) {
        break;
      }

      const distinctScoreCount = countDistinctScores(results);
      const currentWorstPenalty = distinctScoreCount >= distinctTarget
        ? getWorstDistinctPenalty(results, distinctTarget)
        : Infinity;
      if (ranked.penalty > currentWorstPenalty) {
        break;
      }

        for (const entry of contexts) {
          const elapsedMs = getElapsedMs();
          if (
            (visitedCepages >= minVisitedCepages && distinctScoreCount >= distinctTarget && elapsedMs >= softTimeBudgetMs) ||
            (visitedCepages >= minVisitedCepages && distinctScoreCount >= distinctTarget && elapsedMs >= hardTimeBudgetMs) ||
            (visitedCepages >= minVisitedCepages && distinctScoreCount >= distinctTarget && evaluatedRecipes >= hardEvaluationBudget)
          ) {
            shouldStop = true;
            break;
          }

        const recipe = simulateWineRecipe(cepage.id, entry, ranked.descriptor.assignment);
        evaluatedRecipes += 1;
        pushTopRecipe(results, { ...recipe, ...getRecipeScore(recipe, criteria) }, criteria, 24);
      }
    }
  }

  return getDistinctScoreRecipes(results, distinctTarget);
}




