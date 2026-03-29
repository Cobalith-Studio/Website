import { wineGraph, GraphNode, GraphEdge } from "./logic-data.js";
import { wineTypeRules, styleRules } from "./generated/rules.js";

type EdgeMap = Map<string, GraphEdge[]>;

type NodeMap = Map<string, GraphNode>;

const svg = document.querySelector<SVGSVGElement>("#graph")!;
const graphLayer = document.querySelector<SVGGElement>("#graph-layer")!;
const edgesLayer = document.querySelector<SVGGElement>("#edges-layer")!;
const nodesLayer = document.querySelector<SVGGElement>("#nodes-layer")!;
const detailsPanel = document.querySelector<HTMLDivElement>("#details")!;
const searchInput = document.querySelector<HTMLInputElement>("#search")!;
const zoomResetButton = document.querySelector<HTMLButtonElement>("#zoom-reset")!;
const zoomInButton = document.querySelector<HTMLButtonElement>("#zoom-in")!;
const zoomOutButton = document.querySelector<HTMLButtonElement>("#zoom-out")!;

const nodeMap: NodeMap = new Map(wineGraph.nodes.map((node) => [node.id, node]));
const edgeMap: EdgeMap = new Map();
const nodeElements: Map<string, SVGGElement> = new Map();
const edgeElements: Map<string, SVGPathElement> = new Map();

let selectedNodeId: string | null = null;

svg.setAttribute("viewBox", `0 0 ${wineGraph.meta.width} ${wineGraph.meta.height}`);

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
svg.querySelector("defs")!.appendChild(marker);

function registerEdge(edge: GraphEdge) {
  const list = edgeMap.get(edge.from) ?? [];
  list.push(edge);
  edgeMap.set(edge.from, list);
}

function getAnchor(node: GraphNode, side: "left" | "right"): { x: number; y: number } {
  const x = side === "left" ? node.x : node.x + node.width;
  const y = node.y + node.height / 2;
  return { x, y };
}

function createEdgePath(edge: GraphEdge): string {
  const from = nodeMap.get(edge.from);
  const to = nodeMap.get(edge.to);
  if (!from || !to) {
    return "";
  }
  const start = getAnchor(from, "right");
  const end = getAnchor(to, "left");
  const midX = (start.x + end.x) / 2;
  return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
}

function renderEdges() {
  for (const edge of wineGraph.edges) {
    registerEdge(edge);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", createEdgePath(edge));
    path.setAttribute("class", `edge edge--${edge.kind ?? "flow"}`);
    path.setAttribute("marker-end", "url(#arrow)");
    path.dataset.edgeId = edge.id;
    edgesLayer.appendChild(path);
    edgeElements.set(edge.id, path);
  }
}

function renderNodes() {
  for (const node of wineGraph.nodes) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", `node node--${node.type}`);
    group.setAttribute("transform", `translate(${node.x}, ${node.y})`);
    group.dataset.nodeId = node.id;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", `${node.width}`);
    rect.setAttribute("height", `${node.height}`);
    rect.setAttribute("rx", "12");
    rect.setAttribute("ry", "12");
    group.appendChild(rect);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "12");
    text.setAttribute("y", "26");
    text.setAttribute("class", "node-label");
    const lines = node.label.split("\n");
    lines.forEach((line, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute("x", "12");
      tspan.setAttribute("dy", index === 0 ? "0" : "18");
      tspan.textContent = line;
      text.appendChild(tspan);
    });
    group.appendChild(text);

    group.addEventListener("click", () => selectNode(node.id));
    group.addEventListener("mouseenter", () => highlightNode(node.id, true));
    group.addEventListener("mouseleave", () => highlightNode(node.id, false));

    nodesLayer.appendChild(group);
    nodeElements.set(node.id, group);
  }
}

function highlightNode(nodeId: string, isActive: boolean) {
  const group = nodeElements.get(nodeId);
  if (!group) return;
  group.classList.toggle("is-hover", isActive);
  for (const edge of wineGraph.edges) {
    if (edge.from === nodeId || edge.to === nodeId) {
      const path = edgeElements.get(edge.id);
      path?.classList.toggle("is-hover", isActive);
      const otherId = edge.from === nodeId ? edge.to : edge.from;
      nodeElements.get(otherId)?.classList.toggle("is-linked", isActive);
    }
  }
}

function selectNode(nodeId: string) {
  if (selectedNodeId) {
    nodeElements.get(selectedNodeId)?.classList.remove("is-selected");
  }
  selectedNodeId = nodeId;
  nodeElements.get(nodeId)?.classList.add("is-selected");
  const node = nodeMap.get(nodeId);
  if (!node) return;

  const ruleBlock = buildRuleBlock(node);
  const details = [
    ...(node.data.details ?? []),
    ...(node.data.effects ? [`Effects: ${node.data.effects.join(" | ")}`] : []),
    ...(node.data.tags ? [`Tags: ${node.data.tags.join(", ")}`] : [])
  ];

  detailsPanel.innerHTML = `
    <div class="panel-title">${node.data.title}</div>
    ${node.data.subtitle ? `<div class="panel-subtitle">${node.data.subtitle}</div>` : ""}
    ${details.length ? `<ul class="panel-list">${details.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
    ${ruleBlock}
    ${node.data.source ? `<div class="panel-source">Source: ${node.data.source}</div>` : ""}
  `;
}

function buildRuleBlock(node: GraphNode): string {
  if (node.id === "decision-type-inference") {
    const items = wineTypeRules
      .map(
        (rule) =>
          `<li><strong>${rule.label}</strong><span>${rule.conditions.join("; ")}</span></li>`
      )
      .join("");
    return `<div class="panel-section"><div class="panel-section-title">Type rules</div><ul class="panel-rules">${items}</ul></div>`;
  }

  if (node.id === "process-style") {
    const items = styleRules
      .map(
        (rule) =>
          `<li><strong>${rule.label}</strong><span>${rule.conditions.join("; ")}</span></li>`
      )
      .join("");
    return `<div class="panel-section"><div class="panel-section-title">Style rules</div><ul class="panel-rules">${items}</ul></div>`;
  }

  return "";
}

function applySearch(query: string) {
  const normalized = query.trim().toLowerCase();
  for (const [id, group] of nodeElements) {
    const node = nodeMap.get(id);
    if (!node) continue;
    const match = !normalized || node.label.toLowerCase().includes(normalized);
    group.classList.toggle("is-search-match", match && !!normalized);
    group.classList.toggle("is-search-dim", !match && !!normalized);
  }
}

searchInput.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement;
  applySearch(target.value);
});

zoomResetButton.addEventListener("click", () => resetZoom());
zoomInButton.addEventListener("click", () => zoomBy(1.1));
zoomOutButton.addEventListener("click", () => zoomBy(0.9));

let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;

function applyTransform() {
  graphLayer.setAttribute("transform", `translate(${offsetX} ${offsetY}) scale(${zoom})`);
}

function resetZoom() {
  zoom = 1;
  offsetX = 0;
  offsetY = 0;
  applyTransform();
}

function zoomBy(factor: number) {
  zoom = Math.min(2.2, Math.max(0.4, zoom * factor));
  applyTransform();
}

svg.addEventListener("wheel", (event) => {
  event.preventDefault();
  const delta = event.deltaY > 0 ? 0.92 : 1.08;
  zoomBy(delta);
});

svg.addEventListener("pointerdown", (event) => {
  if ((event.target as HTMLElement).closest(".node")) {
    return;
  }
  isPanning = true;
  panStartX = event.clientX - offsetX;
  panStartY = event.clientY - offsetY;
  svg.setPointerCapture(event.pointerId);
});

svg.addEventListener("pointermove", (event) => {
  if (!isPanning) return;
  offsetX = event.clientX - panStartX;
  offsetY = event.clientY - panStartY;
  applyTransform();
});

svg.addEventListener("pointerup", (event) => {
  isPanning = false;
  svg.releasePointerCapture(event.pointerId);
});

renderEdges();
renderNodes();
selectNode("process-bottle");
applyTransform();

const notesPanel = document.querySelector<HTMLUListElement>("#notes")!;
notesPanel.innerHTML = wineGraph.meta.notes.map((note) => `<li>${note}</li>`).join("");
