import fs from "fs";
import path from "path";

type Config = {
  managerFile: string;
};

type WineTypeRule = {
  id: string;
  label: string;
  conditions: string[];
};

function readConfig(): Config {
  const configPath = path.resolve(process.cwd(), "graph.config.json");
  const raw = fs.readFileSync(configPath, "utf8");
  return JSON.parse(raw) as Config;
}

function extractMethodBody(content: string, methodName: string): string {
  const index = content.indexOf(methodName);
  if (index === -1) {
    throw new Error(`Method not found: ${methodName}`);
  }
  const startBrace = content.indexOf("{", index);
  if (startBrace === -1) {
    throw new Error(`No opening brace for: ${methodName}`);
  }
  let depth = 0;
  for (let i = startBrace; i < content.length; i += 1) {
    if (content[i] === "{") depth += 1;
    if (content[i] === "}") depth -= 1;
    if (depth === 0) {
      return content.slice(startBrace + 1, i);
    }
  }
  throw new Error(`No closing brace for: ${methodName}`);
}

function cleanCondition(condition: string): string {
  return condition
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();
}

function extractWineTypeRules(methodBody: string): WineTypeRule[] {
  const rules: WineTypeRule[] = [];
  const regex = /if\s*\(([\s\S]*?)\)\s*\n\s*return\s+"([^"]+)"/g;
  let match: RegExpExecArray | null;
  const counts = new Map<string, number>();

  while ((match = regex.exec(methodBody)) !== null) {
    const rawCondition = match[1];
    const label = match[2];
    const count = (counts.get(label) ?? 0) + 1;
    counts.set(label, count);
    const idBase = label.toLowerCase().replace(/\s+/g, "-");
    const id = count > 1 ? `${idBase}-${count}` : idBase;

    const conditions = rawCondition
      .split("&&")
      .map((part) => cleanCondition(part))
      .filter(Boolean);

    rules.push({ id, label, conditions });
  }

  if (!rules.find((rule) => rule.label === "Undefined")) {
    rules.push({ id: "undefined", label: "Undefined", conditions: ["catch-all"] });
  }

  return rules;
}

function formatArray(value: string[]): string {
  return `[
      ${value.map((entry) => `"${entry.replace(/"/g, "\\\"")}"`).join(",\n      ")}
    ]`;
}

function writeRulesFile(rules: WineTypeRule[]): void {
  const styleRules = `export const styleRules: StyleRule[] = [
  {
    id: "sweetness-still",
    label: "Still wine sweetness",
    conditions: [
      "sugar < 4 => Dry",
      "sugar < 15 => Medium dry",
      "sugar < 45 => Sweet",
      "else => Liquor-like"
    ]
  },
  {
    id: "sweetness-sparkling",
    label: "Sparkling sweetness",
    conditions: [
      "sugar < 4 => Brut nature",
      "sugar < 7 => Extra-brut",
      "sugar < 13 => Brut",
      "sugar < 18 => Extra-dry",
      "sugar < 33 => Dry",
      "sugar < 51 => Semi-dry",
      "else => Sweet"
    ]
  },
  {
    id: "alcohol-body",
    label: "Alcohol body",
    conditions: ["alcohol > 13.5 => Full-bodied", "alcohol < 10 => Light"]
  },
  {
    id: "acidity-style",
    label: "Acidity",
    conditions: ["acidity > 7 => Crisp", "acidity < 4 => Smooth"]
  },
  {
    id: "tannins-style",
    label: "Tannins",
    conditions: ["tannins > 30 => Tannic"]
  },
  {
    id: "aromas-style",
    label: "Aromas",
    conditions: ["primary ratio > 0.5 => Aromatic", "tertiary ratio > 0.4 => Matured"]
  }
];`;

  const content = `export interface WineTypeRule {\n  id: string;\n  label: string;\n  conditions: string[];\n}\n\nexport interface StyleRule {\n  id: string;\n  label: string;\n  conditions: string[];\n}\n\nexport const wineTypeRules: WineTypeRule[] = [\n  ${rules
    .map(
      (rule) =>
        `{\n    id: "${rule.id}",\n    label: "${rule.label}",\n    conditions: ${formatArray(rule.conditions)}\n  }`
    )
    .join(",\n  ")}\n];\n\n${styleRules}\n`;

  const outputPath = path.resolve(process.cwd(), "src", "generated", "rules.ts");
  fs.writeFileSync(outputPath, content, "utf8");
}

function main() {
  const config = readConfig();
  const managerPath = path.resolve(config.managerFile);
  const content = fs.readFileSync(managerPath, "utf8");
  const body = extractMethodBody(content, "InferWineType");
  const rules = extractWineTypeRules(body);
  writeRulesFile(rules);
  console.log(`Updated rules from ${managerPath}`);
}

main();
