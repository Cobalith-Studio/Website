import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

export const PHASE_OPTIONS = [
  { value: "vertical_slice", label: "Vertical Slice", short: "VS", className: "admin-chip--primary" },
  { value: "demo", label: "Démo publique", short: "Démo", className: "admin-chip--purple" },
  { value: "release", label: "Version 1.0", short: "1.0", className: "admin-chip--green" }
];

export const STATUS_CONFIG = {
  missing: { label: "Manquant", className: "admin-status--red", icon: AlertCircle },
  found_pack: { label: "Pack trouvé", className: "admin-status--amber", icon: Clock },
  temporary: { label: "Temporaire", className: "admin-status--blue", icon: Clock },
  done: { label: "Terminé", className: "admin-status--green", icon: CheckCircle2 }
};

export const MILESTONE_CONFIG = {
  vertical_slice: { label: "VS", fullLabel: "Vertical Slice", className: "admin-status--blue" },
  demo: { label: "Démo", fullLabel: "Démo publique", className: "admin-status--purple" },
  release: { label: "Sortie", fullLabel: "Version 1.0", className: "admin-status--green" }
};

export const ASSET_CATEGORIES = [
  "Basics",
  "Tools & Equipment",
  "Consumables",
  "Wine Stations",
  "Storage & Logistics",
  "Environment",
  "UI & FX"
];

export const NOTE_CATEGORIES = {
  production: { label: "Production", className: "admin-status--blue" },
  design: { label: "Design", className: "admin-status--purple" },
  business: { label: "Business", className: "admin-status--green" },
  tech: { label: "Tech", className: "admin-status--amber" },
  general: { label: "Général", className: "admin-status--slate" }
};

const assetGroups = [
  {
    category: "Basics",
    subcategory: "Vins",
    assets: [
      ["Red wine", "Vin rouge"],
      ["White wine", "Vin blanc"],
      ["Rose wine", "Rosé"],
      ["Effervescent wine", "Vin pétillant"],
      ["Blanc de Noir wine", "Blanc de Noir"],
      ["Orange wine", "Vin orange"],
      ["Liquor wine", "Liquoreux"]
    ]
  },
  { category: "Basics", subcategory: "Graines", assets: [["Grape seed", "Graine de cépage"]] },
  {
    category: "Basics",
    subcategory: "Raisins",
    assets: [
      ["Red grape", "Raisin rouge"],
      ["White grape", "Raisin blanc"]
    ]
  },
  {
    category: "Basics",
    subcategory: "Items temporaires",
    assets: [
      ["Red bucket", "Seau de moût de rouge"],
      ["White bucket", "Seau de moût de blanc"]
    ]
  },
  {
    category: "Tools & Equipment",
    subcategory: "Outils de plantation et d’entretien",
    assets: [
      ["Spade", "Bêche"],
      ["Rake", "Râteau"],
      ["Pruning Shears", "Sécateur"],
      ["Advanced Pruning Shears", "Sécateur avancé"],
      ["Loppers", "Coupe-branches"],
      ["Watering Can", "Arrosoir"],
      ["Pressurized Watering Can", "Arrosoir sous pression"],
      ["Hose", "Tuyau d’arrosage"],
      ["Irrigation Kit", "Kit d’irrigation"],
      ["Drip Irrigation Line", "Ligne d’irrigation goutte-à-goutte"],
      ["Irrigation Pump", "Pompe d’irrigation"],
      ["Hand Sprayer", "Pulvérisateur manuel"],
      ["Backpack Sprayer", "Pulvérisateur dorsal"],
      ["Motorized Sprayer", "Pulvérisateur motorisé"]
    ]
  },
  {
    category: "Tools & Equipment",
    subcategory: "Mesure et contrôle",
    assets: [
      ["Soil Probe", "Sonde de sol"],
      ["Moisture Meter", "Mesureur d’humidité"],
      ["Thermometer", "Thermomètre"],
      ["Weather Station", "Station météo"]
    ]
  },
  {
    category: "Tools & Equipment",
    subcategory: "Récolte et manutention",
    assets: [
      ["Harvest Basket", "Panier de récolte"],
      ["Large Harvest Basket", "Grand panier de récolte"],
      ["Harvest Crate", "Cagette de récolte"],
      ["Picking Bin", "Bac de vendange"],
      ["Sorting Table", "Table de tri"],
      ["Portable Scale", "Balance portative"],
      ["Wheelbarrow", "Brouette"],
      ["Vineyard Cart", "Chariot de vigne"],
      ["Small Trailer", "Petite remorque"],
      ["Large Trailer", "Grande remorque"]
    ]
  },
  {
    category: "Tools & Equipment",
    subcategory: "Structures de vigne",
    assets: [
      ["Trellis Kit", "Kit de treillis"],
      ["Reinforced Trellis Kit", "Kit de treillis renforcé"],
      ["Support Post", "Poteau de support"],
      ["Wire Spool", "Bobine de fil"],
      ["Vine Guard", "Protection de vigne"],
      ["Shade Net", "Filet d’ombrage"],
      ["Bird Net", "Filet anti-oiseaux"]
    ]
  },
  {
    category: "Consumables",
    subcategory: "Entretien de la vigne",
    assets: [
      ["Compost", "Compost"],
      ["Manure", "Fumier"],
      ["Fertilizer", "Engrais"],
      ["Pesticide", "Pesticide"],
      ["Fungicide", "Fongicide"],
      ["Copper Sulfate Treatment", "Traitement au sulfate de cuivre"],
      ["Sulfur Treatment", "Traitement au soufre"],
      ["Weed Control Mix", "Mélange désherbant"],
      ["Insect Trap", "Piège à insectes"],
      ["Frost Protection Candle", "Bougie antigel"]
    ]
  },
  {
    category: "Consumables",
    subcategory: "Levures et cultures",
    assets: [
      ["Saccharomyces Cerevisiae", "Saccharomyces cerevisiae"],
      ["Saccharomyces pastorianus", "Saccharomyces pastorianus"],
      ["Brettanomyces Culture", "Culture de Brettanomyces"],
      ["Malolactic Bacteria Culture", "Culture bactérienne malolactique"]
    ]
  },
  {
    category: "Consumables",
    subcategory: "Embouteillage",
    assets: [
      ["Natural Cork", "Bouchon naturel"],
      ["Technical Cork", "Bouchon technique"],
      ["Synthetic Cork", "Bouchon synthétique"],
      ["Screw Cap", "Capsule à vis"],
      ["Foil Capsule", "Capsule métallique"],
      ["Wax Seal", "Cire de scellement"],
      ["Label Roll", "Rouleau d’étiquettes"],
      ["Premium Label Roll", "Rouleau d’étiquettes premium"],
      ["Glass Bottle Small", "Bouteille en verre petite"],
      ["Glass Bottle", "Bouteille en verre"],
      ["Glass Bottle Magnum", "Bouteille Magnum"],
      ["Green Bottle", "Bouteille verte"],
      ["Clear Bottle", "Bouteille transparente"],
      ["Premium Bottle", "Bouteille premium"]
    ]
  },
  {
    category: "Wine Stations",
    subcategory: "Containers",
    assets: [
      ["Plastic Bucket", "Seau en plastique"],
      ["Food Grade Bucket", "Seau alimentaire"],
      ["Wooden Vat", "Cuve en bois"],
      ["Small Stainless Steel Tank", "Petite cuve inox"],
      ["Medium Stainless Steel Tank", "Cuve inox moyenne"],
      ["Large Stainless Steel Tank", "Grande cuve inox"]
    ]
  },
  {
    category: "Wine Stations",
    subcategory: "Crushing",
    assets: [
      ["Manual Crusher", "Fouloir manuel"],
      ["Improved Crusher", "Fouloir amélioré"],
      ["Motorized Crusher", "Fouloir motorisé"]
    ]
  },
  {
    category: "Wine Stations",
    subcategory: "Maceration",
    assets: [
      ["Small Maceration Vat", "Petite cuve de macération"],
      ["Medium Maceration Vat", "Cuve de macération moyenne"],
      ["Large Maceration Vat", "Grande cuve de macération"],
      ["Temperature Controlled Maceration Tank", "Cuve de macération thermorégulée"]
    ]
  },
  {
    category: "Wine Stations",
    subcategory: "Pressing",
    assets: [
      ["Basket Press", "Pressoir à panier"],
      ["Screw Press", "Pressoir à vis"],
      ["Hydraulic Press", "Pressoir hydraulique"],
      ["Pneumatic Press", "Pressoir pneumatique"]
    ]
  },
  {
    category: "Wine Stations",
    subcategory: "Alcoholic Fermentation",
    assets: [
      ["Basic Fermentation Vat", "Cuve de fermentation basique"],
      ["Wood Fermentation Vat", "Cuve de fermentation en bois"],
      ["Plastic Fermentation Vat", "Cuve de fermentation en plastique"],
      ["Stainless Fermentation Tank", "Cuve de fermentation en inox"],
      ["Jacketed Fermentation Tank", "Cuve de fermentation thermorégulée"],
      ["Temperature Control Unit", "Unité de contrôle de température"]
    ]
  },
  {
    category: "Wine Stations",
    subcategory: "Malolactic Fermentation",
    assets: [
      ["Basic Malolactic Vat", "Cuve malolactique basique"],
      ["Malolactic Tank", "Cuve malolactique"],
      ["Temperature Controlled Malolactic Tank", "Cuve malolactique thermorégulée"],
      ["Malolactic Chamber", "Chambre malolactique"]
    ]
  },
  {
    category: "Wine Stations",
    subcategory: "Aging",
    assets: [
      ["New Oak Barrel", "Barrique neuve"],
      ["Used Oak Barrel", "Barrique usagée"],
      ["French Oak Barrel", "Barrique de chêne français"],
      ["American Oak Barrel", "Barrique de chêne américain"],
      ["Chestnut Barrel", "Fût de châtaignier"],
      ["Neutral Barrel", "Barrique neutre"],
      ["Large Aging Cask", "Grand foudre d’élevage"]
    ]
  },
  {
    category: "Wine Stations",
    subcategory: "Bottling",
    assets: [
      ["Manual Bottle Filler", "Remplisseuse manuelle"],
      ["Semi Auto Bottle Filler", "Remplisseuse semi-automatique"],
      ["Auto Bottle Filler", "Remplisseuse automatique"],
      ["Manual Corker", "Boucheuse manuelle"],
      ["Floor Corker", "Boucheuse sur pied"],
      ["Automatic Corker", "Boucheuse automatique"],
      ["Capsule Applicator", "Capsuleuse"],
      ["Labeling Station", "Station d’étiquetage"],
      ["Bottle Washer", "Lave-bouteilles"],
      ["Bottle Drying Rack", "Égouttoir à bouteilles"],
      ["Packaging Station", "Station d’emballage"]
    ]
  },
  {
    category: "Storage & Logistics",
    subcategory: "Stockage interne",
    assets: [
      ["Wooden Shelf", "Étagère en bois"],
      ["Metal Shelf", "Étagère métallique"],
      ["Storage Bin", "Bac de stockage"],
      ["Ingredient Cabinet", "Armoire à ingrédients"],
      ["Barrel Storage Rack", "Rack de stockage pour barriques"],
      ["Bottle Crate", "Caisse de bouteilles"],
      ["Pallet", "Palette"]
    ]
  },
  {
    category: "Storage & Logistics",
    subcategory: "Manutention",
    assets: [
      ["Hand Truck", "Diable"],
      ["Delivery Crate", "Caisse de livraison"],
      ["Shipping Box", "Carton d’expédition"]
    ]
  }
];

function toAssetId(name) {
  return `asset-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
}

export const seedAssets = assetGroups.flatMap((group) =>
  group.assets.map(([name_en, name_fr]) => ({
    id: toAssetId(`${group.category}-${group.subcategory}-${name_en}`),
    name_en,
    name_fr,
    category: group.category,
    subcategory: group.subcategory,
    status: "missing",
    milestone: "vertical_slice",
    pack_url: "",
    pack_name: "",
    notes: "",
    icon_name: ""
  }))
);
