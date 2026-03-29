import {
  CEPAGE_DATA,
  CONTEXT_FIELDS,
  STYLE_RULES,
  VARIABLES,
  WINE_TYPE_RULES
} from "../data/wineGraphData";
import {
  createDefaultContext,
  hasAnyPressurage,
  inferWineType,
  isEntryValid,
  sanitizeAssignment,
  simulateBatch
} from "./wineEngine";

const INDEX_PRESSURAGE_PRE = VARIABLES.findIndex((entry) => entry.id === "pressuragePre");
const INDEX_PRESSURAGE_POST = VARIABLES.findIndex((entry) => entry.id === "pressuragePost");

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

function collectOutcomes(cepage, context, varIndex, assignment, memo) {
  const key = `${cepage.id}|${varIndex}|${JSON.stringify(assignment)}`;
  if (memo.has(key)) return memo.get(key);

  if (varIndex >= VARIABLES.length) {
    const result = new Set([inferWineType(cepage, assignment, context)]);
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
    const next =
      variable.id === "fermentationProfile"
        ? sanitizeAssignment({ ...assignment, fermentationProfile: option.value })
        : sanitizeAssignment({ ...assignment, [variable.id]: option.value });
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
    children: node.children.map((child) => ({ label: child.label, sig: toMergeSignature(child.node) }))
  });
}

function formatFermentationValue(value) {
  switch (value) {
    case "low":
      return "Basse";
    case "high":
      return "Haute";
    case "artificial":
      return "Levures sélectionnées";
    case "indigenous":
      return "Levures indigènes";
    case "short":
      return "Courte";
    case "long":
      return "Longue";
    default:
      return value;
  }
}

function formatOptionGroupLabel(options) {
  return options.map((option) => option.label).join(" / ");
}

function buildFermentationGroupLabels(groups) {
  const serialize = (values) => [...new Set(values)].sort().join("|");
  const yeastSets = groups.map((group) => serialize(group.options.map((option) => formatFermentationValue(option.fermentationYeast))));
  const tempSets = groups.map((group) => serialize(group.options.map((option) => formatFermentationValue(option.fermentationTemp))));
  const durationSets = groups.map((group) => serialize(group.options.map((option) => formatFermentationValue(option.fermentationDuration))));

  const yeastDiffers = new Set(yeastSets).size > 1;
  const tempDiffers = new Set(tempSets).size > 1;
  const durationDiffers = new Set(durationSets).size > 1;

  return groups.map((group) => {
    const parts = [];

    if (yeastDiffers) {
      parts.push([...new Set(group.options.map((option) => formatFermentationValue(option.fermentationYeast)))].join(" / "));
    }
    if (tempDiffers) {
      parts.push([...new Set(group.options.map((option) => formatFermentationValue(option.fermentationTemp)))].join(" / "));
    }
    if (durationDiffers) {
      parts.push([...new Set(group.options.map((option) => formatFermentationValue(option.fermentationDuration)))].join(" / "));
    }

    return {
      ...group,
      label: parts.join("\n")
    };
  });
}

function getDisplayVariableLabel(variableId) {
  switch (variableId) {
    case "pressuragePre":
    case "pressuragePost":
      return "Pressurage";
    default:
      return VARIABLES.find((variable) => variable.id === variableId)?.label ?? variableId;
  }
}

function buildDecisionTree(cepage, context) {
  const memoOutcomes = new Map();
  const memoNodes = new Map();

  function buildNode(varIndex, assignment) {
    const key = `${varIndex}|${JSON.stringify(assignment)}`;
    if (memoNodes.has(key)) return memoNodes.get(key);

    if (isFermentationImpossible(assignment, varIndex) || isBottlingImpossible(assignment, varIndex)) {
      const blocked = {
        kind: "invalid",
        output: "Bloqué",
        outcomes: new Set(["Bloqué"]),
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
          ? sanitizeAssignment({ ...assignment, fermentationProfile: option.value })
          : sanitizeAssignment({ ...assignment, [variable.id]: option.value });
      return { option, child: buildNode(varIndex + 1, next) };
    });

    const groupedChildren = new Map();
    for (const entry of optionEntries) {
      if (!groupedChildren.has(entry.child.mergeSignature)) {
        groupedChildren.set(entry.child.mergeSignature, { options: [], node: entry.child });
      }
      groupedChildren.get(entry.child.mergeSignature).options.push(entry.option);
    }

    let children = Array.from(groupedChildren.values()).map((group) => ({
      label: formatOptionGroupLabel(group.options),
      node: group.node,
      options: group.options
    }));

    if (variable.id === "fermentationProfile") {
      children = buildFermentationGroupLabels(children);
    }

    children = children.sort((a, b) => a.label.localeCompare(b.label));

    const outcomes = collectOutcomes(cepage, context, varIndex, assignment, memoOutcomes);
    const neutral = children.length === 1 && variable.options.length > 1;

    const node = {
      kind: "decision",
      variable,
      varIndex,
      children,
      outcomes,
      neutral,
      mergeSignature: toMergeSignature({ kind: "decision", variable, children, neutral }),
      signature: JSON.stringify({
        id: variable.id,
        neutral,
        children: children.map((child) => ({ label: child.label, sig: child.node.signature }))
      })
    };

    memoNodes.set(key, node);
    return node;
  }

  return buildNode(0, {});
}

function buildLeafAssignmentMap(tree) {
  const assignmentToLeaf = new Map();
  const leafOutputs = new Map();

  function visit(node, assignment, pathKey) {
    if (node.kind === "invalid") {
      assignmentToLeaf.set(JSON.stringify(assignment), pathKey);
      return;
    }

    if (node.kind === "leaf") {
      assignmentToLeaf.set(JSON.stringify(assignment), pathKey);
      leafOutputs.set(pathKey, node.output);
      return;
    }

    for (const child of node.children) {
      for (const option of child.options) {
        const next =
          node.variable.id === "fermentationProfile"
            ? sanitizeAssignment({ ...assignment, fermentationProfile: option.value })
            : sanitizeAssignment({ ...assignment, [node.variable.id]: option.value });
        visit(child.node, next, `${pathKey}>${node.variable.id}:${child.label}`);
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
    acidityMin: Infinity,
    acidityMax: -Infinity,
    tanninsMin: Infinity,
    tanninsMax: -Infinity
  };
}

function updateLeafStats(stats, batch) {
  stats.sugarMin = Math.min(stats.sugarMin, batch.sugar);
  stats.sugarMax = Math.max(stats.sugarMax, batch.sugar);
  stats.alcoholMin = Math.min(stats.alcoholMin, batch.alcohol);
  stats.alcoholMax = Math.max(stats.alcoholMax, batch.alcohol);
  stats.acidityMin = Math.min(stats.acidityMin, batch.acidity);
  stats.acidityMax = Math.max(stats.acidityMax, batch.acidity);
  stats.tanninsMin = Math.min(stats.tanninsMin, batch.tannins);
  stats.tanninsMax = Math.max(stats.tanninsMax, batch.tannins);
}

function buildGroupLeafStats(group, context) {
  const { assignmentToLeaf, leafOutputs } = buildLeafAssignmentMap(group.tree);
  const statsByLeaf = new Map();

  for (const cepage of group.cepages) {
    for (const [assignmentKey, leafKey] of assignmentToLeaf.entries()) {
      if (!leafOutputs.has(leafKey)) continue;
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

function collapseBlockedRenderNode(node) {
  let current = node;
  while (current && current.kind === "decision" && current.neutral && current.children.length === 1 && current.outcomes.size === 1 && current.outcomes.has("Bloqué")) {
    current = current.children[0].node;
  }
  return current;
}

function shouldHideBlockedBranch(node) {
  return node && node.kind === "invalid" && node.output === "Bloqué";
}

function shouldSkipRenderNode(variableId, child) {
  return (
    (variableId === "pressuragePre" || variableId === "pressuragePost") &&
    child.options.length === 1 &&
    child.options[0].value === "skip"
  );
}

let renderNodeCounter = 0;
let textMeasureContext = null;

function getTextMeasureContext() {
  if (textMeasureContext) {
    return textMeasureContext;
  }

  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    textMeasureContext = canvas.getContext("2d");
    return textMeasureContext;
  }

  return null;
}

function measureLineWidth(text, isTitle) {
  const context = getTextMeasureContext();
  if (!context) {
    return text.length * (isTitle ? 4.8 : 4.2);
  }

  context.font = isTitle ? "600 10px Segoe UI" : "400 10px Segoe UI";
  return context.measureText(text).width;
}

function createRenderNode(type, lines, output, depth, depthSpan = 1, spanEndLines = null) {
  renderNodeCounter += 1;
  return { id: `r-${renderNodeCounter}`, type, depth, depthSpan, spanEndLines, lines, output, children: [] };
}

function cloneRenderNode(node) {
  return {
    ...node,
    children: node.children.map(cloneRenderNode)
  };
}

function renderTreeSignature(node) {
  return JSON.stringify({
    type: node.type,
    lines: node.lines,
    output: node.output ?? null,
    children: node.children.map(renderTreeSignature)
  });
}

function buildCompositeLines(firstChain, secondChain) {
  return [
    `${firstChain.lines[0]} + ${firstChain.children[0].lines[0]}`,
    `${firstChain.lines[0]} puis ${firstChain.children[0].lines[0]} (ou inversement)`
  ];
}

function canMergeSwappedChains(nodeA, nodeB) {
  if (!nodeA || !nodeB) return false;
  if (nodeA.children.length !== 1 || nodeB.children.length !== 1) return false;

  const childA = nodeA.children[0];
  const childB = nodeB.children[0];

  if (!childA || !childB) return false;
  if (childA.children.length !== childB.children.length) return false;
  if (childA.children.length === 0) return false;

  const aTitle = nodeA.lines[0];
  const aChildTitle = childA.lines[0];
  const bTitle = nodeB.lines[0];
  const bChildTitle = childB.lines[0];

  if (aTitle !== bChildTitle || aChildTitle !== bTitle) {
    return false;
  }

  return childA.children.every((grandChild, index) => (
    renderTreeSignature(grandChild) === renderTreeSignature(childB.children[index])
  ));
}

function mergeSwappedChains(nodes) {
  const normalized = nodes.map((node) => ({
    ...node,
    children: mergeSwappedChains(node.children)
  }));

  const consumed = new Set();
  const merged = [];

  for (let index = 0; index < normalized.length; index += 1) {
    if (consumed.has(index)) {
      continue;
    }

    const current = normalized[index];
    let mergedNode = null;

    for (let compareIndex = index + 1; compareIndex < normalized.length; compareIndex += 1) {
      if (consumed.has(compareIndex)) {
        continue;
      }

      const candidate = normalized[compareIndex];
      if (!canMergeSwappedChains(current, candidate)) {
        continue;
      }

      const adoptedChildren = current.children[0].children.map(cloneRenderNode);

      mergedNode = createRenderNode(
        "composite",
        buildCompositeLines(current, candidate),
        null,
        current.depth,
        2,
        current.children[0].lines
      );
      mergedNode.children = adoptedChildren;
      consumed.add(compareIndex);
      break;
    }

    merged.push(mergedNode ?? current);
  }

  return merged;
}

function buildRenderForest(node, currentDepth, pathKey, leafStats) {
  if (node.kind === "leaf") {
    const stats = leafStats.get(pathKey);
    return [
      createRenderNode(
        "bottle",
        [
          "Embouteillage",
          `Sucre ${formatRange(stats.sugarMin, stats.sugarMax)} g/L`,
          `Alcool ${formatRange(stats.alcoholMin, stats.alcoholMax)}%`,
          `Acidité ${formatRange(stats.acidityMin, stats.acidityMax)}`,
          `Tanins ${formatRange(stats.tanninsMin, stats.tanninsMax)}`
        ],
        node.output,
        currentDepth
      )
    ];
  }

  if (node.kind === "invalid") {
    return [createRenderNode("invalid", ["Bloqué"], node.output, currentDepth)];
  }

  return node.children
    .flatMap((child) => {
      const renderTarget = collapseBlockedRenderNode(child.node);
      if (shouldHideBlockedBranch(renderTarget)) {
        return [];
      }
      if (shouldSkipRenderNode(node.variable.id, child)) {
        return buildRenderForest(renderTarget, currentDepth, `${pathKey}>${node.variable.id}:${child.label}`, leafStats);
      }
      const detailLines = child.label ? child.label.split("\n").filter(Boolean) : [];
      const stepNode = createRenderNode(
        node.neutral ? "process" : "decision",
        [getDisplayVariableLabel(node.variable.id), ...detailLines],
        null,
        currentDepth
      );
      stepNode.children = buildRenderForest(renderTarget, currentDepth + 1, `${pathKey}>${node.variable.id}:${child.label}`, leafStats);
      return [stepNode];
    })
    .filter(Boolean);
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
  const title = lines[0] ?? "";
  const isComposite = title.includes(" + ");
  const widthRules = {
    Pressurage: { min: 58, max: 122, padding: 8 },
    Fermentation: { min: 68, max: 132, padding: 8 },
    "Pressurage + Fermentation": { min: 126, max: 198, padding: 8 },
    "Fermentation + Pressurage": { min: 126, max: 198, padding: 8 }
  };
  const rule = widthRules[title] ?? null;
  const horizontalPadding = rule?.padding ?? 12;
  const minWidth = rule?.min ?? (isComposite ? 132 : 64);
  const maxWidth = rule?.max ?? (isComposite ? 214 : 196);
  const contentWidth = Math.max(
    ...lines.map((line, index) => {
      return measureLineWidth(line, index === 0);
    }),
    0
  );
  return {
    width: Math.max(minWidth, Math.min(maxWidth, horizontalPadding * 2 + contentWidth)),
    height: 34 + (lines.length - 1) * 14
  };
}

function gatherNodes(root) {
  const nodes = [];
  function visit(node) {
    const size = measureNode(node.lines);
    node.baseWidth = size.width;
    node.spanEndWidth = node.spanEndLines ? measureNode(node.spanEndLines).width : null;
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

function buildGraphForGroup(group) {
  renderNodeCounter = 0;
  if (!group) {
    return { nodes: [], edges: [], viewBox: "0 0 1200 800" };
  }

  const forest = mergeSwappedChains(buildRenderForest(group.tree, 1, "root", group.leafStats));
  const root = { id: "root", type: "input", lines: group.cepages.map((cepage) => cepage.name), children: forest };
  assignLayout(root, 80, 112);
  const allNodes = gatherNodes(root);
  const rootSize = measureNode(root.lines);
  root.width = rootSize.width;
  root.height = rootSize.height;
  root.depth = 0;
  root.centerY = root.children.length
    ? (Math.min(...root.children.map((child) => child.centerY)) + Math.max(...root.children.map((child) => child.centerY))) / 2
    : 80;

  const depthMax = allNodes.length ? Math.max(...allNodes.map((node) => node.depth)) : 0;
  const maxWidthByDepth = new Array(depthMax + 1).fill(0);
  for (const node of allNodes) {
    const span = node.depthSpan ?? 1;
    const distributedWidth = Math.ceil((node.baseWidth ?? node.width) / span);
    for (let offset = 0; offset < span; offset += 1) {
      const depthIndex = node.depth + offset;
      if (depthIndex > depthMax) {
        break;
      }
      maxWidthByDepth[depthIndex] = Math.max(maxWidthByDepth[depthIndex], distributedWidth);
    }
  }

  const colGap = 38;
  const colPositions = [];
  let cursor = 28 + root.width + colGap;
  for (let depth = 1; depth <= depthMax; depth += 1) {
    colPositions[depth] = cursor;
    cursor += maxWidthByDepth[depth] + colGap;
  }

  const nodes = [];
  const nodeMap = new Map();
  root.x = 28;
  root.y = root.centerY - root.height / 2;
  nodes.push(root);
  nodeMap.set(root.id, root);

  for (const node of allNodes) {
    node.x = colPositions[node.depth];
    if ((node.depthSpan ?? 1) > 1) {
      const endDepth = Math.min(depthMax, node.depth + node.depthSpan - 1);
      const endWidth = maxWidthByDepth[endDepth] ?? node.spanEndWidth ?? node.baseWidth ?? node.width;
      const endX = (colPositions[endDepth] ?? node.x) + endWidth;
      node.width = endX - node.x;
    } else {
      node.width = maxWidthByDepth[node.depth] ?? node.baseWidth ?? node.width;
    }
    node.y = node.centerY - node.height / 2;
    nodes.push(node);
    nodeMap.set(node.id, node);
  }

  const edges = [];
  function addEdges(parent) {
    for (const child of parent.children) {
      edges.push({ id: `edge-${parent.id}-${child.id}`, from: parent.id, to: child.id });
      addEdges(child);
    }
  }
  addEdges(root);

  const bounds = computeBounds(nodes);
  const padding = 28;
  return {
    nodes,
    edges,
    nodeMap,
    viewBox: `${bounds.minX - padding} ${bounds.minY - padding} ${bounds.maxX - bounds.minX + padding * 2} ${bounds.maxY - bounds.minY + padding * 2}`
  };
}

function formatGroupLabel(cepages) {
  return cepages.length === 1 ? cepages[0].name : `${cepages[0].name} + ${cepages.length - 1} autres`;
}

export function buildCepageGroups(context) {
  const grouped = new Map();

  for (const cepage of CEPAGE_DATA) {
    const tree = buildDecisionTree(cepage, context);
    if (!grouped.has(tree.signature)) {
      grouped.set(tree.signature, { tree, cepages: [] });
    }
    grouped.get(tree.signature).cepages.push(cepage);
  }

  return Array.from(grouped.values())
    .map((group) => {
      const cepages = [...group.cepages].sort((a, b) => a.name.localeCompare(b.name));
      const hydrated = { tree: group.tree, cepages };
      return {
        id: cepages.map((cepage) => cepage.id).join("-"),
        label: formatGroupLabel(cepages),
        cepages,
        tree: group.tree,
        leafStats: buildGroupLeafStats(hydrated, context)
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getWineGraphModel(context, selectedGroupId) {
  const groups = buildCepageGroups(context);
  const activeGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[0] ?? null;
  return {
    contextFields: CONTEXT_FIELDS,
    defaultContext: createDefaultContext(),
    wineTypeRules: WINE_TYPE_RULES,
    styleRules: STYLE_RULES,
    groups,
    activeGroup,
    graph: buildGraphForGroup(activeGroup)
  };
}

export function createEdgePath(edge, nodeMap) {
  const from = nodeMap.get(edge.from);
  const to = nodeMap.get(edge.to);
  if (!from || !to) return "";
  const startX = from.x + from.width;
  const startY = from.y + from.height / 2;
  const endX = to.x - 16;
  const endY = to.y + to.height / 2;
  const splitX = startX + (endX - startX) * 0.38;
  const finalApproachX = endX - 14;
  return `M ${startX} ${startY} L ${splitX} ${startY} L ${splitX} ${endY} L ${finalApproachX} ${endY} L ${endX} ${endY}`;
}

export function outputClassName(output) {
  return output
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
