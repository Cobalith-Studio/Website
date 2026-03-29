export type NodeType = "input" | "decision" | "option" | "process" | "output" | "note";

export interface NodeData {
  title: string;
  subtitle?: string;
  details?: string[];
  effects?: string[];
  tags?: string[];
  rules?: string[];
  source?: string;
}

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: NodeData;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  kind?: "choice" | "flow" | "rule" | "support";
}

export interface GraphMeta {
  title: string;
  width: number;
  height: number;
  notes: string[];
  sources: string[];
}

export interface GraphData {
  meta: GraphMeta;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface OptionDef {
  id: string;
  label: string;
  y: number;
  details?: string[];
  effects?: string[];
  tags?: string[];
}

interface DecisionDef {
  id: string;
  label: string;
  x: number;
  y: number;
  options: OptionDef[];
  details?: string[];
  source?: string;
}

const decisionDefs: DecisionDef[] = [
  {
    id: "decision-harvest",
    label: "Harvest time",
    x: 360,
    y: 80,
    source: "TerrainEffectStep",
    details: ["Applies harvest maturity multipliers to sugar, acidity, tannins."],
    options: [
      {
        id: "harvest-pre-mature",
        label: "Pre-mature",
        y: 160,
        effects: ["sugar * 0.90", "acidity * 1.15", "tannins * 0.90"],
        tags: ["harvest-pre-mature"]
      },
      {
        id: "harvest-mature",
        label: "Mature",
        y: 220,
        effects: ["sugar * 1.00", "acidity * 1.00", "tannins * 1.00"],
        tags: ["harvest-mature"]
      },
      {
        id: "harvest-post-mature",
        label: "Post-mature",
        y: 280,
        effects: ["sugar * 1.15", "acidity * 0.85", "tannins * 1.05"],
        tags: ["harvest-post-mature"]
      }
    ]
  },
  {
    id: "decision-soil",
    label: "Soil",
    x: 360,
    y: 360,
    source: "TerrainEffectStep",
    details: ["Applies soil multipliers to sugar, acidity, tannins."],
    options: [
      { id: "soil-clay", label: "Clay", y: 440, effects: ["sugar * 1.00", "acidity * 0.95", "tannins * 1.10"] },
      { id: "soil-calcareous", label: "Calcareous", y: 500, effects: ["sugar * 0.95", "acidity * 1.10", "tannins * 1.00"] },
      { id: "soil-sandy", label: "Sandy", y: 560, effects: ["sugar * 1.10", "acidity * 0.90", "tannins * 0.90"] },
      { id: "soil-volcanic", label: "Volcanic", y: 620, effects: ["sugar * 1.00", "acidity * 1.05", "tannins * 1.05"] },
      { id: "soil-schist", label: "Schist", y: 680, effects: ["sugar * 1.05", "acidity * 1.00", "tannins * 1.05"] },
      { id: "soil-granitic", label: "Granitic", y: 740, effects: ["sugar * 1.00", "acidity * 1.05", "tannins * 0.95"] }
    ]
  },
  {
    id: "decision-sun",
    label: "Sun",
    x: 360,
    y: 820,
    source: "TerrainEffectStep",
    details: ["Applies sun exposure multipliers to sugar, acidity."],
    options: [
      { id: "sun-low", label: "Low", y: 900, effects: ["sugar * 0.90", "acidity * 1.10"] },
      { id: "sun-medium", label: "Medium", y: 960, effects: ["sugar * 1.00", "acidity * 1.00"] },
      { id: "sun-high", label: "High", y: 1020, effects: ["sugar * 1.10", "acidity * 0.90"] }
    ]
  },
  {
    id: "decision-rain",
    label: "Rain",
    x: 360,
    y: 1100,
    source: "TerrainEffectStep",
    details: ["Applies rain level multipliers to sugar, acidity, tannins."],
    options: [
      { id: "rain-low", label: "Low", y: 1180, effects: ["sugar * 1.10", "acidity * 0.95", "tannins * 1.10"] },
      { id: "rain-normal", label: "Normal", y: 1240, effects: ["sugar * 1.00", "acidity * 1.00", "tannins * 1.00"] },
      { id: "rain-high", label: "High", y: 1300, effects: ["sugar * 0.90", "acidity * 1.10", "tannins * 0.90"] }
    ]
  },
  {
    id: "decision-foulage",
    label: "Foulage",
    x: 680,
    y: 160,
    source: "FoulageStep",
    details: ["Modifies tannin extraction and primary aromas."],
    options: [
      {
        id: "foulage-none",
        label: "None",
        y: 240,
        effects: ["tannins * 0.20", "primary aroma * 1.00"],
        tags: ["foulage_none"]
      },
      {
        id: "foulage-partial",
        label: "Partial",
        y: 300,
        effects: ["tannins * 0.50", "primary aroma * 1.05"],
        tags: ["foulage_partial"]
      },
      {
        id: "foulage-full",
        label: "Full",
        y: 360,
        effects: ["tannins * 1.00", "primary aroma * 1.10"],
        tags: ["foulage_full"]
      }
    ]
  },
  {
    id: "decision-maceration",
    label: "Maceration",
    x: 980,
    y: 160,
    source: "MacerationStep",
    details: ["Modifies tannin extraction and primary aromas."],
    options: [
      {
        id: "maceration-none",
        label: "None",
        y: 240,
        effects: ["tannins * 1.00", "primary aroma * 1.00"],
        tags: ["maceration_none"]
      },
      {
        id: "maceration-short",
        label: "Short",
        y: 300,
        effects: ["tannins * 1.10", "primary aroma * 1.05"],
        tags: ["maceration_short"]
      },
      {
        id: "maceration-long",
        label: "Long",
        y: 360,
        effects: ["tannins * 1.30", "primary aroma * 1.10"],
        tags: ["maceration_long"]
      }
    ]
  },
  {
    id: "decision-yeast",
    label: "Yeast",
    x: 1280,
    y: 120,
    source: "FermentationAlcoholicStep",
    details: ["Affects sugar to alcohol ratio and aroma balance."],
    options: [
      {
        id: "yeast-indigenous",
        label: "Indigenous",
        y: 200,
        effects: ["primary aroma * 1.10", "sugar/alcohol ratio: 18 (red) or 16.5 (white)"],
        tags: ["yeast_indigenous"]
      },
      {
        id: "yeast-artificial",
        label: "Artificial",
        y: 260,
        effects: ["secondary aroma * 1.05", "sugar/alcohol ratio: 17.5 (red) or 16.0 (white)"],
        tags: ["yeast_artificial"]
      }
    ]
  },
  {
    id: "decision-temp",
    label: "Ferment temp",
    x: 1280,
    y: 360,
    source: "FermentationAlcoholicStep",
    details: ["Affects fermentation efficiency and secondary aromas."],
    options: [
      {
        id: "fermentation-low",
        label: "Low",
        y: 440,
        effects: ["efficiency * 0.95", "secondary aroma * 1.00"],
        tags: ["fermentation_low"]
      },
      {
        id: "fermentation-high",
        label: "High",
        y: 500,
        effects: ["efficiency * 1.05", "secondary aroma * 1.15"],
        tags: ["fermentation_high"]
      }
    ]
  },
  {
    id: "decision-ferment-duration",
    label: "Ferment duration",
    x: 1280,
    y: 600,
    source: "FermentationAlcoholicStep",
    details: ["Affects efficiency and secondary aromas, adds tags."],
    options: [
      {
        id: "fermentation-short",
        label: "Short",
        y: 680,
        effects: ["efficiency * 0.95", "secondary aroma * 1.05"],
        tags: ["fermentation_short"]
      },
      {
        id: "fermentation-long",
        label: "Long",
        y: 740,
        effects: ["efficiency * 1.05", "secondary aroma * 1.10"],
        tags: ["fermentation_long"]
      }
    ]
  },
  {
    id: "decision-malo",
    label: "Malolactic",
    x: 1580,
    y: 320,
    source: "FermentationMalolacticStep",
    details: ["Optional. Lowers acidity and boosts tertiary aromas."],
    options: [
      {
        id: "malo-yes",
        label: "Yes",
        y: 400,
        effects: ["acidity * 0.75", "tertiary aroma * 1.25", "+5% tertiary"],
        tags: ["malo_yes"]
      },
      {
        id: "malo-no",
        label: "No",
        y: 460,
        effects: ["no change"],
        tags: ["malo_no"]
      }
    ]
  },
  {
    id: "decision-elevage-type",
    label: "Elevage type",
    x: 1880,
    y: 140,
    source: "ElevageWineStep",
    details: ["Affects tannins and tertiary aromas. Barrel adds stylized notes."],
    options: [
      {
        id: "elevage-inox",
        label: "Cuve Inox",
        y: 220,
        effects: ["tannins * 1.00", "tertiary aroma * 1.00"],
        tags: ["cuve_inox"]
      },
      {
        id: "elevage-fut-fr",
        label: "Fut Francais",
        y: 280,
        effects: ["tannins * 1.05", "tertiary aroma * 1.15"],
        tags: ["fut_francais"]
      },
      {
        id: "elevage-fut-us",
        label: "Fut Americain",
        y: 340,
        effects: ["tannins * 1.10", "tertiary aroma * 1.20"],
        tags: ["fut_americain"]
      }
    ]
  },
  {
    id: "decision-elevage-duration",
    label: "Elevage duration",
    x: 1880,
    y: 460,
    source: "ElevageWineStep",
    details: ["Long elevage boosts tannins and tertiary aromas."],
    options: [
      {
        id: "elevage-short",
        label: "Short",
        y: 540,
        effects: ["tannins * 1.00", "tertiary aroma * 1.00"],
        tags: ["elevage_short"]
      },
      {
        id: "elevage-long",
        label: "Long",
        y: 600,
        effects: ["tannins * 1.10", "tertiary aroma * 1.20"],
        tags: ["elevage_long"]
      }
    ]
  },
  {
    id: "decision-chauffe",
    label: "Chauffe",
    x: 1880,
    y: 740,
    source: "ElevageWineStep",
    details: ["Only applies for barrel types (not inox)."],
    options: [
      {
        id: "chauffe-light",
        label: "Light",
        y: 820,
        effects: ["tertiary aroma * 1.00"],
        tags: ["chauffe_light"]
      },
      {
        id: "chauffe-medium",
        label: "Medium",
        y: 880,
        effects: ["tertiary aroma * 1.08"],
        tags: ["chauffe_medium"]
      },
      {
        id: "chauffe-strong",
        label: "Strong",
        y: 940,
        effects: ["tertiary aroma * 1.16"],
        tags: ["chauffe_strong"]
      }
    ]
  }
];

const decisionOrder = decisionDefs.map((decision) => decision.id);

const inputNodes: GraphNode[] = [
  {
    id: "input-cepages",
    type: "input",
    label: "Cepages",
    x: 80,
    y: 80,
    width: 200,
    height: 80,
    data: {
      title: "Cepages",
      details: [
        "Defines base sugar, acidity, tannins (averaged).",
        "Primary aromas are merged into the batch."
      ],
      source: "WineProductionManager.CreateBatch"
    }
  },
  {
    id: "input-terrain",
    type: "input",
    label: "Terrain",
    x: 80,
    y: 220,
    width: 200,
    height: 80,
    data: {
      title: "Terrain",
      details: ["Soil, sun, rain multipliers are applied in TerrainEffectStep."],
      source: "TerrainEffectStep"
    }
  },
  {
    id: "input-maturity",
    type: "input",
    label: "Maturity",
    x: 80,
    y: 360,
    width: 200,
    height: 80,
    data: {
      title: "Harvest maturity",
      details: ["Pre, mature, or post-mature harvest time."],
      source: "TerrainEffectStep"
    }
  }
];

const processNodes: GraphNode[] = [
  {
    id: "process-bottle",
    type: "process",
    label: "Bottle",
    x: 2180,
    y: 200,
    width: 200,
    height: 80,
    data: {
      title: "Bottle",
      details: [
        "Infers wine type.",
        "Normalizes aromas.",
        "Infers style tags."
      ],
      source: "WineProductionManager.Bottle"
    }
  },
  {
    id: "decision-type-inference",
    type: "decision",
    label: "Wine type rules",
    x: 2180,
    y: 380,
    width: 200,
    height: 80,
    data: {
      title: "InferWineType",
      details: ["Evaluates step tags + cepage list + sugar."],
      source: "WineProductionManager.InferWineType"
    }
  },
  {
    id: "process-style",
    type: "process",
    label: "Style rules",
    x: 2180,
    y: 560,
    width: 200,
    height: 80,
    data: {
      title: "InferWineStyle",
      details: ["Creates sensory tags from sugar, alcohol, acidity, tannins, aromas."],
      source: "WineProductionManager.InferWineStyle"
    }
  }
];

const outputNodes: GraphNode[] = [
  {
    id: "output-white",
    type: "output",
    label: "White",
    x: 2480,
    y: 160,
    width: 200,
    height: 70,
    data: {
      title: "White",
      details: ["Default when not all cepages are red."],
      source: "InferWineType"
    }
  },
  {
    id: "output-red",
    type: "output",
    label: "Red",
    x: 2480,
    y: 240,
    width: 200,
    height: 70,
    data: {
      title: "Red",
      details: ["Requires isRed and foulage != none and maceration != none."],
      source: "InferWineType"
    }
  },
  {
    id: "output-rose",
    type: "output",
    label: "Rose",
    x: 2480,
    y: 320,
    width: 200,
    height: 70,
    data: {
      title: "Rose",
      details: ["Requires isRed and maceration != long and foulage != full."],
      source: "InferWineType"
    }
  },
  {
    id: "output-blanc-de-noirs",
    type: "output",
    label: "Blanc de Noirs",
    x: 2480,
    y: 400,
    width: 200,
    height: 70,
    data: {
      title: "Blanc de Noirs",
      details: ["Requires isRed, listed cepages, maceration == none, foulage != full."],
      source: "InferWineType"
    }
  },
  {
    id: "output-effervescent",
    type: "output",
    label: "Effervescent",
    x: 2480,
    y: 480,
    width: 200,
    height: 70,
    data: {
      title: "Effervescent",
      details: ["Two branches: white base or red base conditions."],
      source: "InferWineType"
    }
  },
  {
    id: "output-undefined",
    type: "output",
    label: "Undefined",
    x: 2480,
    y: 560,
    width: 200,
    height: 70,
    data: {
      title: "Undefined",
      details: ["Catch-all when no rule matches."],
      source: "InferWineType"
    }
  },
  {
    id: "output-styles",
    type: "note",
    label: "Style tags",
    x: 2480,
    y: 720,
    width: 200,
    height: 90,
    data: {
      title: "Style tags",
      details: [
        "Dry / Medium dry / Sweet / Liquor-like",
        "Brut nature / Extra-brut / Brut / Extra-dry / Dry / Semi-dry",
        "Full-bodied / Light / Crisp / Smooth / Tannic / Aromatic / Matured"
      ],
      source: "InferWineStyle"
    }
  }
];

const nodes: GraphNode[] = [...inputNodes, ...processNodes, ...outputNodes];
const edges: GraphEdge[] = [];

for (const decision of decisionDefs) {
  nodes.push({
    id: decision.id,
    type: "decision",
    label: decision.label,
    x: decision.x,
    y: decision.y,
    width: 200,
    height: 70,
    data: {
      title: decision.label,
      details: decision.details,
      source: decision.source
    }
  });

  for (const option of decision.options) {
    nodes.push({
      id: option.id,
      type: "option",
      label: option.label,
      x: decision.x,
      y: option.y,
      width: 200,
      height: 50,
      data: {
        title: option.label,
        details: option.details,
        effects: option.effects,
        tags: option.tags,
        source: decision.source
      }
    });
  }
}

for (let index = 0; index < decisionOrder.length; index += 1) {
  const currentId = decisionOrder[index];
  const nextId = decisionOrder[index + 1];
  const decision = decisionDefs.find((entry) => entry.id === currentId);
  if (!decision) {
    continue;
  }

  for (const option of decision.options) {
    edges.push({
      id: `edge-${currentId}-to-${option.id}`,
      from: currentId,
      to: option.id,
      kind: "choice"
    });

    if (nextId) {
      edges.push({
        id: `edge-${option.id}-to-${nextId}`,
        from: option.id,
        to: nextId,
        kind: "flow"
      });
    }
  }
}

edges.push(
  { id: "edge-input-cepages-harvest", from: "input-cepages", to: "decision-harvest", kind: "flow" },
  { id: "edge-input-terrain-soil", from: "input-terrain", to: "decision-soil", kind: "flow" },
  { id: "edge-input-maturity-harvest", from: "input-maturity", to: "decision-harvest", kind: "flow" }
);

const chauffeDecision = decisionDefs.find((decision) => decision.id === "decision-chauffe");
if (chauffeDecision) {
  for (const option of chauffeDecision.options) {
    edges.push({
      id: `edge-${option.id}-to-bottle`,
      from: option.id,
      to: "process-bottle",
      kind: "flow"
    });
  }
}

edges.push(
  { id: "edge-bottle-to-type", from: "process-bottle", to: "decision-type-inference", kind: "flow" },
  { id: "edge-bottle-to-style", from: "process-bottle", to: "process-style", kind: "flow" },
  { id: "edge-style-to-output", from: "process-style", to: "output-styles", kind: "flow" }
);

edges.push(
  { id: "edge-type-white", from: "decision-type-inference", to: "output-white", kind: "rule" },
  { id: "edge-type-red", from: "decision-type-inference", to: "output-red", kind: "rule" },
  { id: "edge-type-rose", from: "decision-type-inference", to: "output-rose", kind: "rule" },
  { id: "edge-type-blanc-de-noirs", from: "decision-type-inference", to: "output-blanc-de-noirs", kind: "rule" },
  { id: "edge-type-effervescent", from: "decision-type-inference", to: "output-effervescent", kind: "rule" },
  { id: "edge-type-undefined", from: "decision-type-inference", to: "output-undefined", kind: "rule" }
);

export const wineGraph: GraphData = {
  meta: {
    title: "Wine Process Decision Graph",
    width: 2800,
    height: 1400,
    notes: [
      "InferWineType looks for harvest_ tags, but TerrainEffectStep writes harvest-pre-mature (dash).",
      "ElevageWineStep adds foulage_none tag; verify if this is intended.",
      "Type inference uses first matching tag in stepTags list (order matters)."
    ],
    sources: [
      "WineProductionManager.cs",
      "TerrainEffectStep.cs",
      "FoulageStep.cs",
      "MacerationStep.cs",
      "FermentationAlcoholicStep.cs",
      "FermentationMalolacticStep.cs",
      "ElevageWineStep.cs"
    ]
  },
  nodes,
  edges
};
