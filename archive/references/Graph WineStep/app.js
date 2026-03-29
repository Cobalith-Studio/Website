"use strict";

const cepages = Array.isArray(window.CEPAGE_DATA) ? window.CEPAGE_DATA : [];

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
const blancsDeNoirs = ["Pinot Noir", "Cabernet Franc", "Pinot Meunier"];

const VARIABLES = [
  {
    id: "harvest",
    label: "Vendange",
    options: [
      { value: "pre-mature", label: "Pre-mature" },
      { value: "mature", label: "Mature" },
      { value: "post-mature", label: "Post-mature" }
    ],
    active: () => true
  },
  {
    id: "foulage",
    label: "Foulage",
    options: [
      { value: "skip", label: "Skip" },
      { value: "partial", label: "Partial" },
      { value: "full", label: "Full" }
    ],
    active: () => true
  },
  {
    id: "maceration",
    label: "Maceration",
    options: [
      { value: "skip", label: "Skip" },
      { value: "short", label: "Short" },
      { value: "long", label: "Long" }
    ],
    active: () => true
  },
  {
    id: "pressuragePre",
    label: "Pressurage (pre-fermentation)",
    options: [
      { value: "skip", label: "Skip" },
      { value: "soft", label: "Doux" },
      { value: "hard", label: "Fort" }
    ],
    active: () => true
  },
  {
    id: "fermentationProfile",
    label: "Fermentation",
    options: [
      {
        value: "artificial|low|short",
        label: "Artificielle / Basse / Courte",
        fermentationYeast: "artificial",
        fermentationTemp: "low",
        fermentationDuration: "short"
      },
      {
        value: "artificial|low|long",
        label: "Artificielle / Basse / Longue",
        fermentationYeast: "artificial",
        fermentationTemp: "low",
        fermentationDuration: "long"
      },
      {
        value: "artificial|high|short",
        label: "Artificielle / Haute / Courte",
        fermentationYeast: "artificial",
        fermentationTemp: "high",
        fermentationDuration: "short"
      },
      {
        value: "artificial|high|long",
        label: "Artificielle / Haute / Longue",
        fermentationYeast: "artificial",
        fermentationTemp: "high",
        fermentationDuration: "long"
      },
      {
        value: "indigenous|low|short",
        label: "Indigene / Basse / Courte",
        fermentationYeast: "indigenous",
        fermentationTemp: "low",
        fermentationDuration: "short"
      },
      {
        value: "indigenous|low|long",
        label: "Indigene / Basse / Longue",
        fermentationYeast: "indigenous",
        fermentationTemp: "low",
        fermentationDuration: "long"
      },
      {
        value: "indigenous|high|short",
        label: "Indigene / Haute / Courte",
        fermentationYeast: "indigenous",
        fermentationTemp: "high",
        fermentationDuration: "short"
      },
      {
        value: "indigenous|high|long",
        label: "Indigene / Haute / Longue",
        fermentationYeast: "indigenous",
        fermentationTemp: "high",
        fermentationDuration: "long"
      }
    ],
    active: (assignment) => isEntryValid(assignment)
  },
  {
    id: "pressuragePost",
    label: "Pressurage (post-fermentation)",
    options: [
      { value: "skip", label: "Skip" },
      { value: "soft", label: "Doux" },
      { value: "hard", label: "Fort" }
    ],
    active: (assignment) =>
      isEntryValid(assignment) &&
      (!assignment.pressuragePre || assignment.pressuragePre === "skip")
  },
  {
    id: "malolactic",
    label: "Malolactique",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ],
    active: (assignment) => isEntryValid(assignment) && hasAnyPressurage(assignment)
  },
  {
    id: "elevage",
    label: "Elevage",
    options: [
      { value: "yes", label: "Apply" },
      { value: "no", label: "Skip" }
    ],
    active: (assignment) => isEntryValid(assignment) && hasAnyPressurage(assignment)
  }
];

const CONTEXT_FIELDS = [
  {
    id: "soil-select",
    key: "soil",
    options: [
      { value: "clay", label: "Argileux" },
      { value: "calcareous", label: "Calcaire" },
      { value: "sandy", label: "Sableux" },
      { value: "volcanic", label: "Volcanique" },
      { value: "schist", label: "Schiste" },
      { value: "granitic", label: "Granitique" }
    ]
  },
  {
    id: "sun-select",
    key: "sun",
    options: [
      { value: "low", label: "Faible" },
      { value: "medium", label: "Moyen" },
      { value: "high", label: "Fort" }
    ]
  },
  {
    id: "rain-select",
    key: "rain",
    options: [
      { value: "low", label: "Faible" },
      { value: "normal", label: "Normale" },
      { value: "high", label: "Forte" }
    ]
  }
];

const DEFAULT_CONTEXT = {
  soil: "calcareous",
  sun: "medium",
  rain: "normal"
};

const INDEX_PRESSURAGE_PRE = VARIABLES.findIndex((entry) => entry.id === "pressuragePre");
const INDEX_PRESSURAGE_POST = VARIABLES.findIndex((entry) => entry.id === "pressuragePost");

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

function isEntryValid(assignment) {
  const hasFoulage = assignment.foulage && assignment.foulage !== "skip";
  const hasMaceration = assignment.maceration && assignment.maceration !== "skip";
  const hasPressuragePre = assignment.pressuragePre && assignment.pressuragePre !== "skip";
  return hasFoulage || hasMaceration || hasPressuragePre;
}

function hasAnyPressurage(assignment) {
  const hasPressuragePre = assignment.pressuragePre && assignment.pressuragePre !== "skip";
  const hasPressuragePost = assignment.pressuragePost && assignment.pressuragePost !== "skip";
  return hasPressuragePre || hasPressuragePost;
}

function isFermentationImpossible(assignment, varIndex) {
  const pressurageSkipped = assignment.pressuragePre === "skip";
  const foulageSkipped = assignment.foulage === "skip";
  const macerationSkipped = assignment.maceration === "skip";
  return pressurageSkipped && foulageSkipped && macerationSkipped && varIndex > INDEX_PRESSURAGE_PRE;
}

function isBottlingImpossible(assignment, varIndex) {
  if (varIndex <= INDEX_PRESSURAGE_POST) {
    return false;
  }

  return !hasAnyPressurage(assignment);
}

function createBatchState(cepage) {
  return {
    sugar: cepage.sugar,
    acidity: cepage.acidity,
    tannins: cepage.tanins,
    alcohol: 0
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
      batch.tannins *= 0.5;
      break;
    case "full":
      batch.tannins *= 1.0;
      break;
    default:
      break;
  }

  switch (assignment.maceration) {
    case "short":
      batch.tannins *= 1.1;
      break;
    case "long":
      batch.tannins *= 1.3;
      break;
    default:
      break;
  }

  switch (assignment.pressuragePre) {
    case "soft":
      batch.tannins *= 0.4;
      break;
    case "hard":
      batch.tannins *= 0.6;
      break;
    default:
      break;
  }

  switch (assignment.pressuragePost) {
    case "soft":
      batch.tannins *= 0.4;
      break;
    case "hard":
      batch.tannins *= 0.6;
      break;
    default:
      break;
  }
}

function applyFermentationEffects(batch, cepage, assignment) {
  const sugarToAlcoholRatio =
    assignment.fermentationYeast === "indigenous"
      ? (cepage.isRed ? 18.0 : 16.5)
      : (cepage.isRed ? 17.5 : 16.0);
  const tempMultiplier = assignment.fermentationTemp === "high" ? 1.05 : 0.95;
  const durationMultiplier = assignment.fermentationDuration === "long" ? 1.05 : 0.95;
  const fermentationEfficiency = tempMultiplier * durationMultiplier;
  const potentialAlcohol = batch.sugar / sugarToAlcoholRatio;
  const adjustedAlcohol = potentialAlcohol * fermentationEfficiency;
  const finalAlcohol = Math.min(adjustedAlcohol, 15.5);
  const sugarConsumed = finalAlcohol * sugarToAlcoholRatio;

  batch.alcohol = finalAlcohol;
  batch.sugar = Math.max(0, batch.sugar - sugarConsumed);

  if (assignment.malolactic === "yes") {
    batch.acidity *= 0.75;
  }
}

function simulateBatch(cepage, assignment, context) {
  const batch = createBatchState(cepage);
  applyTerrainEffects(batch, assignment, context);
  applyExtractionEffects(batch, assignment);

  if (isEntryValid(assignment)) {
    applyFermentationEffects(batch, cepage, assignment);
  }

  return batch;
}

function inferWineType(cepage, assignment, context) {
  if (!isEntryValid(assignment)) {
    return "Indefini";
  }

  const batch = simulateBatch(cepage, assignment, context);
  const allRed = !!cepage.isRed;
  const anyRed = !!cepage.isRed;
  const anyWhite = !cepage.isRed;
  const allWhite = !cepage.isRed;

  const harvest = assignment.harvest;
  const fermentDuration = assignment.fermentationDuration;
  const hasPressuragePre = assignment.pressuragePre && assignment.pressuragePre !== "skip";
  const hasPressuragePreSoft = assignment.pressuragePre === "soft";
  const foulage = assignment.foulage === "skip" ? null : assignment.foulage;
  const malo = assignment.malolactic === "yes" ? "yes" : "no";
  const hasFoulage = foulage !== null && foulage !== undefined;
  const hasMacerationShort = assignment.maceration === "short";
  const hasMacerationLong = assignment.maceration === "long";
  const hasPressuragePost = assignment.pressuragePost && assignment.pressuragePost !== "skip";
  const hasAnySkinExtraction = hasFoulage || hasMacerationShort || hasMacerationLong;

  const effervescentBase =
    hasPressuragePre &&
    harvest === "pre-mature" &&
    fermentDuration !== "long" &&
    !hasMacerationLong &&
    foulage !== "full" &&
    malo !== "yes";

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

  return "Indefini";
}

function collectOutcomes(cepage, context, varIndex, assignment, memo) {
  const key = `${cepage.id}|${varIndex}|${JSON.stringify(assignment)}`;
  if (memo.has(key)) return memo.get(key);

  if (varIndex >= VARIABLES.length) {
    const outcome = inferWineType(cepage, assignment, context);
    const result = new Set([outcome]);
    memo.set(key, result);
    return result;
  }

  const variable = VARIABLES[varIndex];
  if (!variable.active(assignment)) {
    const result = collectOutcomes(cepage, context, varIndex + 1, assignment, memo);
    memo.set(key, result);
    return result;
  }

  const outcomes = new Set();
  for (const option of variable.options) {
    const next = { ...assignment, [variable.id]: option.value };
    const childOutcomes = collectOutcomes(cepage, context, varIndex + 1, next, memo);
    for (const value of childOutcomes) outcomes.add(value);
  }

  memo.set(key, outcomes);
  return outcomes;
}

function toMergeSignature(node) {
  if (node.kind === "leaf" || node.kind === "invalid") {
    return node.signature;
  }

  if (node.neutral && node.children.length === 1) {
    return toMergeSignature(node.children[0].node);
  }

  return JSON.stringify({
    id: node.variable.id,
    children: node.children.map((child) => ({
      label: child.label,
      sig: toMergeSignature(child.node)
    }))
  });
}

function buildDecisionTree(cepage, context) {
  const memoOutcomes = new Map();
  const memoNodes = new Map();

  function buildNode(varIndex, assignment) {
    const key = `${varIndex}|${JSON.stringify(assignment)}`;
    if (memoNodes.has(key)) return memoNodes.get(key);

    if (isFermentationImpossible(assignment, varIndex)) {
      const blocked = {
        kind: "invalid",
        output: "Blocked",
        outcomes: new Set(["Blocked"]),
        varIndex,
        mergeSignature: "leaf:blocked",
        signature: "leaf:blocked"
      };
      memoNodes.set(key, blocked);
      return blocked;
    }

    if (isBottlingImpossible(assignment, varIndex)) {
      const blocked = {
        kind: "invalid",
        output: "Blocked",
        outcomes: new Set(["Blocked"]),
        varIndex,
        mergeSignature: "leaf:blocked",
        signature: "leaf:blocked"
      };
      memoNodes.set(key, blocked);
      return blocked;
    }

    if (varIndex >= VARIABLES.length) {
      const output = inferWineType(cepage, assignment, context);
      const leaf = {
        kind: "leaf",
        output,
        outcomes: new Set([output]),
        varIndex,
        mergeSignature: `leaf:${output}`,
        signature: `leaf:${output}`
      };
      memoNodes.set(key, leaf);
      return leaf;
    }

    const variable = VARIABLES[varIndex];
    if (!variable.active(assignment)) {
      const child = buildNode(varIndex + 1, assignment);
      memoNodes.set(key, child);
      return child;
    }

    const optionEntries = variable.options.map((option) => {
      const next =
        variable.id === "fermentationProfile"
          ? {
              ...assignment,
              fermentationProfile: option.value,
              fermentationYeast: option.fermentationYeast,
              fermentationTemp: option.fermentationTemp,
              fermentationDuration: option.fermentationDuration
            }
          : { ...assignment, [variable.id]: option.value };
      const child = buildNode(varIndex + 1, next);
      return { option, child };
    });

    const groupedChildren = new Map();
    for (const entry of optionEntries) {
      if (!groupedChildren.has(entry.child.mergeSignature)) {
        groupedChildren.set(entry.child.mergeSignature, { options: [], node: entry.child });
      }
      const group = groupedChildren.get(entry.child.mergeSignature);
      group.options.push(entry.option);
    }

    const children = Array.from(groupedChildren.values())
      .map((group) => ({
        label: formatOptionGroupLabel(variable, group.options),
        node: group.node,
        options: group.options
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const outcomes = collectOutcomes(cepage, context, varIndex, assignment, memoOutcomes);
    const neutral = children.length === 1 && variable.options.length > 1;
    const signature = JSON.stringify({
      id: variable.id,
      neutral,
      children: children.map((child) => ({ label: child.label, sig: child.node.signature }))
    });

    const node = {
      kind: "decision",
      variable,
      varIndex,
      children,
      outcomes,
      neutral,
      mergeSignature: toMergeSignature({
        kind: "decision",
        variable,
        children,
        neutral
      }),
      signature
    };

    memoNodes.set(key, node);
    return node;
  }

  return buildNode(0, {});
}

function serializeAssignment(assignment) {
  return JSON.stringify(assignment);
}

function buildLeafAssignmentMap(tree) {
  const assignmentToLeaf = new Map();
  const leafOutputs = new Map();

  function visit(node, assignment, pathKey) {
    if (node.kind === "invalid") {
      assignmentToLeaf.set(serializeAssignment(assignment), pathKey);
      return;
    }

    if (node.kind === "leaf") {
      assignmentToLeaf.set(serializeAssignment(assignment), pathKey);
      leafOutputs.set(pathKey, node.output);
      return;
    }

    for (const child of node.children) {
      for (const option of child.options) {
        const nextAssignment =
          node.variable.id === "fermentationProfile"
            ? {
                ...assignment,
                fermentationProfile: option.value,
                fermentationYeast: option.fermentationYeast,
                fermentationTemp: option.fermentationTemp,
                fermentationDuration: option.fermentationDuration
              }
            : { ...assignment, [node.variable.id]: option.value };
        visit(
          child.node,
          nextAssignment,
          `${pathKey}>${node.variable.id}:${child.label}`
        );
      }
    }
  }

  visit(tree, {}, "root");
  return { assignmentToLeaf, leafOutputs };
}

function createEmptyLeafStats(output) {
  return {
    output,
    sugarMin: Infinity,
    sugarMax: -Infinity,
    alcoholMin: Infinity,
    alcoholMax: -Infinity,
    tanninsMin: Infinity,
    tanninsMax: -Infinity
  };
}

function updateLeafStats(stats, batch) {
  stats.sugarMin = Math.min(stats.sugarMin, batch.sugar);
  stats.sugarMax = Math.max(stats.sugarMax, batch.sugar);
  stats.alcoholMin = Math.min(stats.alcoholMin, batch.alcohol);
  stats.alcoholMax = Math.max(stats.alcoholMax, batch.alcohol);
  stats.tanninsMin = Math.min(stats.tanninsMin, batch.tannins);
  stats.tanninsMax = Math.max(stats.tanninsMax, batch.tannins);
}

function buildGroupLeafStats(group, context) {
  const { assignmentToLeaf, leafOutputs } = buildLeafAssignmentMap(group.tree);
  const statsByLeaf = new Map();

  for (const cepage of group.cepages) {
    for (const [assignmentKey, leafKey] of assignmentToLeaf.entries()) {
      if (!leafOutputs.has(leafKey)) {
        continue;
      }

      const assignment = JSON.parse(assignmentKey);

      if (!statsByLeaf.has(leafKey)) {
        statsByLeaf.set(leafKey, createEmptyLeafStats(leafOutputs.get(leafKey)));
      }

      updateLeafStats(statsByLeaf.get(leafKey), simulateBatch(cepage, assignment, context));
    }
  }

  return statsByLeaf;
}

function formatMetric(value) {
  return (Math.round(value * 10) / 10).toFixed(1);
}

function formatRange(min, max) {
  const start = formatMetric(min);
  const end = formatMetric(max);
  return start === end ? start : `${start}-${end}`;
}

function formatFermentationValue(value) {
  switch (value) {
    case "low":
      return "Basse";
    case "high":
      return "Haute";
    case "artificial":
      return "Artificielle";
    case "indigenous":
      return "Indigene";
    case "short":
      return "Courte";
    case "long":
      return "Longue";
    default:
      return value;
  }
}

function formatOptionGroupLabel(variable, options) {
  if (variable.id === "fermentationProfile") {
    const temps = [...new Set(options.map((option) => formatFermentationValue(option.fermentationTemp)))];
    const yeasts = [...new Set(options.map((option) => formatFermentationValue(option.fermentationYeast)))];
    const durations = [...new Set(options.map((option) => formatFermentationValue(option.fermentationDuration)))];
    return [
      `Temp : ${temps.join(", ")}`,
      `Levure : ${yeasts.join(", ")}`,
      `Duree : ${durations.join(", ")}`
    ].join("\n");
  }

  return options.map((opt) => opt.label).join(" / ");
}

function formatGroupLabel(group) {
  if (group.cepages.length === 1) {
    return group.cepages[0].name;
  }

  return `${group.cepages[0].name} + ${group.cepages.length - 1} autres`;
}

function buildCepageGroups(items, context) {
  const grouped = new Map();

  for (const cepage of items) {
    const tree = buildDecisionTree(cepage, context);
    if (!grouped.has(tree.signature)) {
      grouped.set(tree.signature, { tree, cepages: [] });
    }
    grouped.get(tree.signature).cepages.push(cepage);
  }

  return Array.from(grouped.values())
    .map((group) => {
      const sortedCepages = [...group.cepages].sort((a, b) => a.name.localeCompare(b.name));
      const hydratedGroup = {
        tree: group.tree,
        cepages: sortedCepages
      };
      return {
        id: sortedCepages.map((cepage) => cepage.id).join("-"),
        tree: group.tree,
        cepages: sortedCepages,
        leafStats: buildGroupLeafStats(hydratedGroup, context),
        label: formatGroupLabel({ cepages: sortedCepages })
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

const svg = document.querySelector("#graph");
const edgesLayer = document.querySelector("#edges-layer");
const nodesLayer = document.querySelector("#nodes-layer");
const groupSelect = document.querySelector("#group-select");

let currentContext = { ...DEFAULT_CONTEXT };
let groups = [];
let graphNodes = [];
let graphEdges = [];
let nodeRegistry = new Map();
let edgeElements = new Map();
let renderNodeCounter = 0;

function createRenderNode(type, lines, output, depth) {
  renderNodeCounter += 1;
  return {
    id: `r-${renderNodeCounter}`,
    type,
    depth,
    lines,
    output,
    children: []
  };
}

function collapseBlockedRenderNode(node) {
  let current = node;

  while (
    current &&
    current.kind === "decision" &&
    current.neutral &&
    current.children.length === 1 &&
    current.outcomes &&
    current.outcomes.size === 1 &&
    current.outcomes.has("Blocked")
  ) {
    current = current.children[0].node;
  }

  return current;
}

function shouldHideBlockedBranch(node) {
  return (
    node &&
    node.kind === "invalid" &&
    node.output === "Blocked"
  );
}

function buildRenderForest(node, fallbackDepth, pathKey, leafStats) {
  if (node.kind === "leaf") {
    const stats = leafStats.get(pathKey);
    const lines = [
      "Bottle",
      `Sucre ${formatRange(stats.sugarMin, stats.sugarMax)} g/L`,
      `Alcool ${formatRange(stats.alcoholMin, stats.alcoholMax)}%`,
      `Tannins ${formatRange(stats.tanninsMin, stats.tanninsMax)}`
    ];
    return [createRenderNode("bottle", lines, node.output, fallbackDepth)];
  }

  if (node.kind === "invalid") {
    return [createRenderNode("invalid", ["Blocked"], node.output, fallbackDepth)];
  }

  return node.children.map((child) => {
    const renderTarget = collapseBlockedRenderNode(child.node);
    if (shouldHideBlockedBranch(renderTarget)) {
      return null;
    }
    const stepNode = createRenderNode(
      node.neutral ? "process" : "decision",
      [node.variable.label, ...child.label.split("\n")],
      null,
      node.varIndex + 1
    );
    stepNode.children = buildRenderForest(
      renderTarget,
      node.varIndex + 2,
      `${pathKey}>${node.variable.id}:${child.label}`,
      leafStats
    );
    return stepNode;
  }).filter(Boolean);
}

function assignLayout(node, currentY, rowGap) {
  if (!node.children.length) {
    node.centerY = currentY;
    return currentY + rowGap;
  }

  let cursor = currentY;
  const childYs = [];
  for (const child of node.children) {
    cursor = assignLayout(child, cursor, rowGap);
    childYs.push(child.centerY);
  }

  node.centerY = (Math.min(...childYs) + Math.max(...childYs)) / 2;
  return cursor;
}

function measureNode(lines) {
  const maxLen = Math.max(...lines.map((line) => line.length));
  const width = Math.max(140, Math.min(320, 24 + maxLen * 6.2));
  const height = 38 + (lines.length - 1) * 16;
  return { width, height };
}

function gatherNodes(root) {
  const nodes = [];
  function visit(node) {
    const size = measureNode(node.lines);
    node.width = size.width;
    node.height = size.height;
    nodes.push(node);
    node.children.forEach(visit);
  }

  root.children.forEach(visit);
  return nodes;
}

function computeBounds(nodes) {
  if (!nodes.length) return { minX: 0, minY: 0, maxX: 1000, maxY: 800 };

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodes) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + node.width);
    maxY = Math.max(maxY, node.y + node.height);
  }

  return { minX, minY, maxX, maxY };
}

function getAnchor(node, side) {
  return {
    x: side === "left" ? node.x : node.x + node.width,
    y: node.y + node.height / 2
  };
}

function createEdgePath(edge) {
  const from = nodeRegistry.get(edge.from);
  const to = nodeRegistry.get(edge.to);
  if (!from || !to) return "";

  const start = getAnchor(from, "right");
  const end = getAnchor(to, "left");
  const midX = (start.x + end.x) / 2;
  return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
}

function renderEdges() {
  for (const edge of graphEdges) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", createEdgePath(edge));
    path.setAttribute("class", "edge");
    path.setAttribute("marker-end", "url(#arrow)");
    edgesLayer.appendChild(path);
    edgeElements.set(edge.id, path);
  }
}

function renderNodes() {
  for (const node of graphNodes) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const outputClass =
      node.type === "bottle" && node.output
        ? ` node--bottle-${normalizeName(node.output).replace(/\s+/g, "-")}`
        : "";

    group.setAttribute("class", `node node--${node.type}${outputClass}`);
    group.setAttribute("transform", `translate(${node.x}, ${node.y})`);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", `${node.width}`);
    rect.setAttribute("height", `${node.height}`);
    rect.setAttribute("rx", "12");
    rect.setAttribute("ry", "12");
    group.appendChild(rect);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "12");
    text.setAttribute("y", "24");
    text.setAttribute("class", "node-label");

    node.lines.forEach((line, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute("x", "12");
      tspan.setAttribute("dy", index === 0 ? "0" : "16");
      tspan.textContent = line;
      text.appendChild(tspan);
    });

    group.appendChild(text);
    nodesLayer.appendChild(group);
  }
}

function renderGraph() {
  const defs = svg.querySelector("defs");
  defs.innerHTML = "";

  const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", "arrow");
  marker.setAttribute("viewBox", "0 0 10 10");
  marker.setAttribute("refX", "9");
  marker.setAttribute("refY", "5");
  marker.setAttribute("markerWidth", "8");
  marker.setAttribute("markerHeight", "8");
  marker.setAttribute("orient", "auto-start-reverse");

  const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  markerPath.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
  markerPath.setAttribute("class", "arrow-head");
  marker.appendChild(markerPath);
  defs.appendChild(marker);

  edgesLayer.innerHTML = "";
  nodesLayer.innerHTML = "";

  renderEdges();
  renderNodes();

  const bounds = computeBounds(graphNodes);
  const padding = 40;
  const width = bounds.maxX - bounds.minX + padding * 2;
  const height = bounds.maxY - bounds.minY + padding * 2;
  svg.setAttribute("viewBox", `${bounds.minX - padding} ${bounds.minY - padding} ${width} ${height}`);
}

function buildGraphForGroup(group) {
  renderNodeCounter = 0;
  graphNodes = [];
  graphEdges = [];
  nodeRegistry = new Map();
  edgeElements = new Map();
  nodesLayer.innerHTML = "";
  edgesLayer.innerHTML = "";

  if (!group) {
    renderGraph();
    return;
  }

  const forest = buildRenderForest(group.tree, 1, "root", group.leafStats);
  const root = {
    id: "root",
    type: "input",
    lines: group.cepages.map((cepage) => cepage.name),
    children: forest
  };

  const rowGap = 140;
  assignLayout(root, 120, rowGap);
  const allNodes = gatherNodes(root);
  const rootSize = measureNode(root.lines);
  root.width = rootSize.width;
  root.height = rootSize.height;
  root.depth = 0;
  root.centerY = root.children.length
    ? (Math.min(...root.children.map((child) => child.centerY)) + Math.max(...root.children.map((child) => child.centerY))) / 2
    : 120;

  const depthMax = allNodes.length ? Math.max(...allNodes.map((node) => node.depth)) : 0;
  const maxWidthByDepth = new Array(depthMax + 1).fill(0);
  for (const node of allNodes) {
    maxWidthByDepth[node.depth] = Math.max(maxWidthByDepth[node.depth], node.width);
  }

  const colGap = 80;
  const colPositions = [];
  let cursor = 40 + root.width + colGap;
  for (let depth = 1; depth <= depthMax; depth += 1) {
    colPositions[depth] = cursor;
    cursor += maxWidthByDepth[depth] + colGap;
  }

  function registerNode(node) {
    graphNodes.push(node);
    nodeRegistry.set(node.id, node);
  }

  root.x = 40;
  root.y = root.centerY - root.height / 2;
  registerNode(root);

  function addEdges(parent) {
    for (const child of parent.children) {
      graphEdges.push({
        id: `edge-${parent.id}-${child.id}`,
        from: parent.id,
        to: child.id
      });
      addEdges(child);
    }
  }

  for (const node of allNodes) {
    node.x = colPositions[node.depth];
    node.y = node.centerY - node.height / 2;
    registerNode(node);
  }

  addEdges(root);
  renderGraph();
}

function populateContextSelects() {
  for (const field of CONTEXT_FIELDS) {
    const select = document.querySelector(`#${field.id}`);
    select.innerHTML = "";

    for (const optionData of field.options) {
      const option = document.createElement("option");
      option.value = optionData.value;
      option.textContent = optionData.label;
      if (optionData.value === currentContext[field.key]) {
        option.selected = true;
      }
      select.appendChild(option);
    }

    select.addEventListener("change", () => {
      currentContext[field.key] = select.value;
      refreshGroups();
    });
  }
}

function populateGroupSelect(selectedGroupId) {
  groupSelect.innerHTML = "";

  groups.forEach((group, index) => {
    const option = document.createElement("option");
    option.value = `${index}`;
    option.textContent = group.label;
    option.dataset.groupId = group.id;
    if (group.id === selectedGroupId) {
      option.selected = true;
    }
    groupSelect.appendChild(option);
  });
}

function refreshGroups() {
  const previousGroup = groups[Number(groupSelect.value)] || null;
  groups = buildCepageGroups(cepages, currentContext);

  const nextGroup = groups.find((group) => previousGroup && group.id === previousGroup.id) || groups[0] || null;
  populateGroupSelect(nextGroup ? nextGroup.id : null);

  if (!nextGroup) {
    buildGraphForGroup(null);
    return;
  }

  const nextIndex = groups.findIndex((group) => group.id === nextGroup.id);
  groupSelect.value = `${nextIndex}`;
  buildGraphForGroup(nextGroup);
}

populateContextSelects();
refreshGroups();

groupSelect.addEventListener("change", (event) => {
  const idx = Number(event.target.value);
  buildGraphForGroup(groups[idx] || null);
});
