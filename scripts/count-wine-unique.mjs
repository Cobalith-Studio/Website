import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { CEPAGE_DATA, CONTEXT_FIELDS, VARIABLES } from "../src/data/wineGraphData.js";

const DB_PATH = path.resolve("scripts", "wine-unique-count.sqlite");

function normalizeName(value) {
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

function expandAssignment(assignment) {
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

function sanitizeAssignment(assignment) {
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

function isEntryValid(assignment) {
  const hasFoulage = assignment.foulage && assignment.foulage !== "skip";
  const hasPressuragePre = assignment.pressuragePre && assignment.pressuragePre !== "skip";
  return hasFoulage || hasPressuragePre;
}

function createBatchState(cepage) {
  return {
    sugar: cepage.sugar,
    acidity: cepage.acidity,
    tannins: cepage.tannins,
    alcohol: 0,
    primaryAroma: 1,
    secondaryAroma: 1,
    tertiaryAroma: 1
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
    case "skip":
      batch.tannins *= 0.2;
      break;
    case "partial":
      batch.tannins *= 0.5;
      batch.primaryAroma *= 1.05;
      break;
    case "full":
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
}

function simulateBatch(cepage, assignment, context) {
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

function inferWineType(cepage, assignment, context) {
  const hydrated = sanitizeAssignment(assignment);
  if (!isEntryValid(hydrated)) {
    return cepage.isRed ? "Rouge" : "Blanc";
  }

  const batch = simulateBatch(cepage, hydrated, context);
  const allRed = !!cepage.isRed;
  const allWhite = !cepage.isRed;
  const harvest = hydrated.harvest;
  const fermentDuration = hydrated.fermentationDuration;
  const hasPressuragePre = hydrated.pressuragePre && hydrated.pressuragePre !== "skip";
  const foulage = hydrated.foulage === "skip" ? null : hydrated.foulage;
  const malo = hydrated.malolactic === "yes" ? "yes" : "no";
  const hasMacerationShort = hydrated.maceration === "short";
  const hasMacerationLong = hydrated.maceration === "long";
  const hasPressuragePost = hydrated.pressuragePost && hydrated.pressuragePost !== "skip";
  const hasAnySkinExtraction = (foulage !== null && foulage !== undefined) || hasMacerationShort || hasMacerationLong;
  const effervescentBase =
    hasPressuragePre &&
    harvest === "pre-mature" &&
    fermentDuration !== "long" &&
    !hasMacerationLong &&
    foulage !== "full" &&
    malo !== "yes";

  if (allWhite && listHas(blancEffervescents, cepage.name) && effervescentBase && !hasAnySkinExtraction) return "Effervescent";
  if (allRed && listHas(rougeEffervescents, cepage.name) && effervescentBase && !hasAnySkinExtraction) return "Effervescent";
  if (allRed && hasPressuragePre && !hasAnySkinExtraction && !hasPressuragePost) return "Blanc de Noirs";
  if (allRed && hasPressuragePre && hasAnySkinExtraction && !hasPressuragePost) return "Rose";
  if (allRed && (!hasPressuragePre || hasPressuragePost)) return "Rouge";
  if (allWhite && batch.sugar > 55) return "Liquoreux";
  if (allWhite && hasAnySkinExtraction) return "Vin Orange";
  if (allWhite && hasPressuragePre && !hasAnySkinExtraction && !hasPressuragePost) return "Blanc";
  return cepage.isRed ? "Rouge" : "Blanc";
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function roundRatio(value) {
  return Math.round(value * 100) / 100;
}

function formatAromaLabel(value) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

function getAromaProfile(cepage, resultType, batch, assignment) {
  const primary = cepage.primaryAromas.slice(0, batch.primaryAroma >= 1.05 ? 3 : 2).map(formatAromaLabel);
  const secondary = batch.secondaryAroma >= 1.03
    ? cepage.secondaryAromas.slice(0, batch.secondaryAroma >= 1.08 ? 2 : 1).map(formatAromaLabel)
    : [];
  const tertiary = batch.tertiaryAroma >= 1.1 || assignment.elevage === "yes" || assignment.malolactic === "yes"
    ? cepage.tertiaryAromas.slice(0, batch.tertiaryAroma >= 1.18 ? 2 : 1).map(formatAromaLabel)
    : [];
  const profile = [...primary, ...secondary, ...tertiary];

  if (assignment.elevage === "yes") {
    if (assignment.elevageType === "french_oak") {
      profile.push("Vanille");
    } else if (assignment.elevageType === "american_oak") {
      profile.push("Toaste", "Cacao");
    } else {
      profile.push("Profondeur");
    }
  }
  if (assignment.malolactic === "yes") profile.push("Beurre");
  if (resultType === "Effervescent") profile.push("Bulles fines");
  if (resultType === "Vin Orange") profile.push("Ecorce");
  if (assignment.elevage === "yes" && assignment.elevageType !== "inox") {
    if (assignment.elevageChauffe === "light") profile.push("Noix de coco");
    else if (assignment.elevageChauffe === "medium") profile.push("Pain grille");
    else if (assignment.elevageChauffe === "strong") profile.push("Torrefie");
  }

  return {
    highlights: [...new Set(profile)].slice(0, 6)
  };
}

function getDistinctiveStyles(cepage, type, batch, assignment) {
  const styles = [];
  const orangeStars = ["Gewurztraminer", "Pinot Gris", "Muscat Blanc a Petits Grains", "Viognier", "Chenin Blanc", "Riesling"];
  const liquoreuxStars = ["Semillon", "Petit Manseng", "Gros Manseng", "Chenin Blanc", "Sauvignon Blanc"];

  if (type === "Vin Orange") {
    styles.push(orangeStars.some((name) => normalizeName(name) === normalizeName(cepage.name)) ? "Classic Orange" : "Experimental Orange");
  }
  if (type === "Liquoreux") {
    if ((assignment.foulage && assignment.foulage !== "skip") || (assignment.maceration && assignment.maceration !== "skip")) {
      styles.push("Amber Style");
    }
    styles.push(liquoreuxStars.some((name) => normalizeName(name) === normalizeName(cepage.name)) ? "Noble Style" : "Late Harvest");
  }
  if (batch.acidity > 7) styles.push("Crisp");
  else if (batch.acidity < 4) styles.push("Smooth");
  if (batch.tannins > 30) styles.push("Tannic");

  const aromasTotal = batch.primaryAroma + batch.secondaryAroma + batch.tertiaryAroma;
  if (aromasTotal > 0) {
    const primaryRatio = batch.primaryAroma / aromasTotal;
    const tertiaryRatio = batch.tertiaryAroma / aromasTotal;
    if (primaryRatio > 0.5) styles.push("Aromatic");
    if (tertiaryRatio > 0.4) styles.push("Matured");
  }

  return styles;
}

function enumerateAssignments() {
  const assignments = [];

  function expandElevageVariants(assignment) {
    const hydrated = sanitizeAssignment(assignment);
    if (hydrated.elevage !== "yes") {
      assignments.push(hydrated);
      return;
    }

    for (const elevageType of ["inox", "french_oak", "american_oak"]) {
      for (const elevageDuration of ["short", "long"]) {
        if (elevageType === "inox") {
          assignments.push(sanitizeAssignment({ ...hydrated, elevageType, elevageDuration, elevageChauffe: "medium" }));
          continue;
        }
        for (const elevageChauffe of ["light", "medium", "strong"]) {
          assignments.push(sanitizeAssignment({ ...hydrated, elevageType, elevageDuration, elevageChauffe }));
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
      const next = variable.id === "fermentationProfile"
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
  return [...unique.values()].filter(isEntryValid);
}

function buildContexts() {
  const soils = CONTEXT_FIELDS.find((field) => field.key === "soil").options.map((option) => option.value);
  const suns = CONTEXT_FIELDS.find((field) => field.key === "sun").options.map((option) => option.value);
  const rains = CONTEXT_FIELDS.find((field) => field.key === "rain").options.map((option) => option.value);
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

function buildProfileKey(cepage, batch, type, assignment) {
  const aromaProfile = getAromaProfile(cepage, type, batch, assignment);
  const distinctiveStyles = getDistinctiveStyles(cepage, type, batch, assignment);
  const aromasTotal = batch.primaryAroma + batch.secondaryAroma + batch.tertiaryAroma;
  const aromaRatios = aromasTotal > 0
    ? [
        roundRatio(batch.primaryAroma / aromasTotal),
        roundRatio(batch.secondaryAroma / aromasTotal),
        roundRatio(batch.tertiaryAroma / aromasTotal)
      ]
    : [0, 0, 0];

  return JSON.stringify({
    type,
    alcohol: round(batch.alcohol),
    sugar: round(batch.sugar),
    acidity: round(batch.acidity),
    tannins: round(batch.tannins),
    aromas: aromaProfile.highlights,
    distinctiveStyles,
    aromaRatios
  });
}

function main() {
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
  }

  const db = new DatabaseSync(DB_PATH);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = OFF;
    PRAGMA temp_store = MEMORY;
    CREATE TABLE profiles (
      cepage TEXT NOT NULL,
      profile_key TEXT NOT NULL,
      PRIMARY KEY (cepage, profile_key)
    ) WITHOUT ROWID;
  `);

  const insert = db.prepare("INSERT OR IGNORE INTO profiles (cepage, profile_key) VALUES (?, ?)");
  const countByCepage = db.prepare("SELECT COUNT(*) AS count FROM profiles WHERE cepage = ?");
  const totalCount = db.prepare("SELECT COUNT(*) AS count FROM profiles");
  const assignments = enumerateAssignments();
  const contexts = buildContexts();
  const totalIterations = CEPAGE_DATA.length * contexts.length * assignments.length;
  let processedIterations = 0;
  let lastPercent = -1;

  function renderProgress(currentCepage, cepageIndex, cepageProcessed, cepageTotal) {
    const percent = Math.floor((processedIterations / totalIterations) * 100);
    if (percent === lastPercent && cepageProcessed % 25000 !== 0 && cepageProcessed !== cepageTotal) {
      return;
    }

    lastPercent = percent;
    const width = 30;
    const filled = Math.floor((percent / 100) * width);
    const bar = `${"#".repeat(filled)}${"-".repeat(width - filled)}`;
    const cepagePercent = Math.floor((cepageProcessed / cepageTotal) * 100);
    process.stdout.write(
      `\r[${bar}] ${String(percent).padStart(3, " ")}% | Cepage ${cepageIndex + 1}/${CEPAGE_DATA.length} | ${currentCepage} ${String(cepagePercent).padStart(3, " ")}%`
    );
  }

  console.log(`Cepages: ${CEPAGE_DATA.length}`);
  console.log(`Contextes: ${contexts.length}`);
  console.log(`Recettes par couple cepage+contexte: ${assignments.length}`);

  for (const [cepageIndex, cepage] of CEPAGE_DATA.entries()) {
    db.exec("BEGIN");
    let inserted = 0;
    let cepageProcessed = 0;
    const cepageTotal = contexts.length * assignments.length;

    for (const context of contexts) {
      for (const assignment of assignments) {
        const sanitized = sanitizeAssignment(assignment);
        const batch = simulateBatch(cepage, sanitized, context);
        const type = inferWineType(cepage, sanitized, context);
        const profileKey = buildProfileKey(cepage, batch, type, sanitized);
        const result = insert.run(cepage.name, profileKey);
        if (result.changes > 0) {
          inserted += 1;
        }
        processedIterations += 1;
        cepageProcessed += 1;
        renderProgress(cepage.name, cepageIndex, cepageProcessed, cepageTotal);
      }
    }

    db.exec("COMMIT");
    const perCepage = countByCepage.get(cepage.name).count;
    process.stdout.write("\n");
    console.log(`${cepage.name}: ${perCepage} profils uniques (${inserted} ajoutes sur ce passage)`);
  }

  const total = totalCount.get().count;
  console.log(`TOTAL_PROFILS_UNIQUES_AVEC_CEPAGE=${total}`);
  db.close();
}

main();
