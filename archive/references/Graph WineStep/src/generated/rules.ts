export interface WineTypeRule {
  id: string;
  label: string;
  conditions: string[];
}

export interface StyleRule {
  id: string;
  label: string;
  conditions: string[];
}

export const wineTypeRules: WineTypeRule[] = [
  {
    id: "effervescent-white",
    label: "Effervescent (white base)",
    conditions: [
      "!isRed",
      "contains: Chardonnay | Chenin Blanc | Muscat Blanc a Petits Grains | Aligote | Clairette | Jacquere | Riesling",
      "harvest == pre-mature",
      "avg sugar < 200",
      "fermentation duration != long"
    ]
  },
  {
    id: "effervescent-red",
    label: "Effervescent (red base)",
    conditions: [
      "isRed",
      "contains: Pinot Noir | Gamay | Pinot Meunier",
      "harvest == pre-mature",
      "avg sugar < 200",
      "fermentation duration != long",
      "foulage != full",
      "maceration == none",
      "malo == no"
    ]
  },
  {
    id: "blanc-de-noirs",
    label: "Blanc de Noirs",
    conditions: [
      "isRed",
      "contains: Pinot Noir | Cabernet Franc | Pinot Meunier",
      "maceration == none",
      "foulage != full"
    ]
  },
  {
    id: "rose",
    label: "Rose",
    conditions: ["isRed", "maceration != long", "foulage != full"]
  },
  {
    id: "red",
    label: "Red",
    conditions: ["isRed", "foulage != none", "maceration != none"]
  },
  {
    id: "white",
    label: "White",
    conditions: ["!isRed"]
  },
  {
    id: "undefined",
    label: "Undefined",
    conditions: ["catch-all"]
  }
];

export const styleRules: StyleRule[] = [
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
];
