// Wine simulation data - cépages, terroir, vinification parameters
export const cepages = {
  blancs: [
    { name: 'Chardonnay', sucre: 210, acidite: 6.5, tanins: 2, aromes_primaires: 7, type: 'blanc' },
    { name: 'Sauvignon Blanc', sucre: 190, acidite: 8.0, tanins: 1, aromes_primaires: 9, type: 'blanc' },
    { name: 'Sémillon', sucre: 220, acidite: 5.5, tanins: 2, aromes_primaires: 6, type: 'blanc' },
    { name: 'Chenin Blanc', sucre: 210, acidite: 7.5, tanins: 2, aromes_primaires: 8, type: 'blanc' },
    { name: 'Muscat Blanc', sucre: 230, acidite: 5.0, tanins: 1, aromes_primaires: 10, type: 'blanc' },
    { name: 'Viognier', sucre: 220, acidite: 5.0, tanins: 2, aromes_primaires: 9, type: 'blanc' },
    { name: 'Riesling', sucre: 195, acidite: 9.0, tanins: 1, aromes_primaires: 9, type: 'blanc' },
    { name: 'Gewurztraminer', sucre: 235, acidite: 5.5, tanins: 2, aromes_primaires: 10, type: 'blanc' },
    { name: 'Pinot Gris', sucre: 215, acidite: 6.0, tanins: 2, aromes_primaires: 7, type: 'blanc' },
    { name: 'Melon de Bourgogne', sucre: 185, acidite: 7.0, tanins: 1, aromes_primaires: 5, type: 'blanc' },
  ],
  rouges: [
    { name: 'Cabernet Sauvignon', sucre: 230, acidite: 6.0, tanins: 9, aromes_primaires: 7, type: 'rouge' },
    { name: 'Merlot', sucre: 225, acidite: 5.5, tanins: 6, aromes_primaires: 7, type: 'rouge' },
    { name: 'Syrah', sucre: 225, acidite: 6.0, tanins: 8, aromes_primaires: 8, type: 'rouge' },
    { name: 'Grenache Noir', sucre: 240, acidite: 5.0, tanins: 5, aromes_primaires: 7, type: 'rouge' },
    { name: 'Pinot Noir', sucre: 210, acidite: 7.0, tanins: 5, aromes_primaires: 9, type: 'rouge' },
    { name: 'Cabernet Franc', sucre: 215, acidite: 6.5, tanins: 7, aromes_primaires: 8, type: 'rouge' },
    { name: 'Malbec', sucre: 230, acidite: 5.5, tanins: 8, aromes_primaires: 7, type: 'rouge' },
    { name: 'Tannat', sucre: 220, acidite: 6.0, tanins: 10, aromes_primaires: 6, type: 'rouge' },
    { name: 'Gamay', sucre: 200, acidite: 7.0, tanins: 4, aromes_primaires: 9, type: 'rouge' },
    { name: 'Mourvèdre', sucre: 230, acidite: 5.5, tanins: 8, aromes_primaires: 6, type: 'rouge' },
  ]
};

export const vendanges = [
  { name: 'Pré-maturation', sucre: 0.90, acidite: 1.15, tanins: 0.90 },
  { name: 'Maturation', sucre: 1.00, acidite: 1.00, tanins: 1.00 },
  { name: 'Post-maturation', sucre: 1.15, acidite: 0.85, tanins: 1.05 },
];

export const sols = [
  { name: 'Argileux', sucre: 1.00, acidite: 0.95, tanins: 1.10 },
  { name: 'Calcaire', sucre: 0.95, acidite: 1.10, tanins: 1.00 },
  { name: 'Sableux', sucre: 1.10, acidite: 0.90, tanins: 0.90 },
  { name: 'Volcanique', sucre: 1.00, acidite: 1.05, tanins: 1.05 },
  { name: 'Schisteux', sucre: 1.05, acidite: 1.00, tanins: 1.05 },
  { name: 'Granitique', sucre: 1.00, acidite: 1.05, tanins: 0.95 },
];

export const ensoleillements = [
  { name: 'Faible', sucre: 0.90, acidite: 1.10 },
  { name: 'Modéré', sucre: 1.00, acidite: 1.00 },
  { name: 'Fort', sucre: 1.10, acidite: 0.90 },
];

export const precipitations = [
  { name: 'Basses', sucre: 1.10, acidite: 0.95, tanins: 1.10 },
  { name: 'Moyennes', sucre: 1.00, acidite: 1.00, tanins: 1.00 },
  { name: 'Élevées', sucre: 0.90, acidite: 1.10, tanins: 0.90 },
];

export const foulages = [
  { name: 'Aucun', tanins: 0.20, aromes_primaires: 1.00 },
  { name: 'Partiel', tanins: 0.50, aromes_primaires: 1.05 },
  { name: 'Complet', tanins: 1.00, aromes_primaires: 1.10 },
];

export const levures = [
  { name: 'Indigènes', alcool: 1.00, aromes_secondaires: 1.10 },
  { name: 'Artificielles', alcool: 1.05, aromes_secondaires: 1.00 },
];

export const macerations = [
  { name: 'Aucune', tanins: 1.00, aromes_primaires: 1.00 },
  { name: 'Courte', tanins: 1.10, aromes_primaires: 1.05 },
  { name: 'Longue', tanins: 1.30, aromes_primaires: 1.10 },
];

export const fermentationTemps = [
  { name: 'Basse', alcool: 0.95, aromes_secondaires: 1.00 },
  { name: 'Haute', alcool: 1.05, aromes_secondaires: 1.15 },
];

export const fermentationDurees = [
  { name: 'Courte', alcool: 0.95, aromes_secondaires: 1.05 },
  { name: 'Longue', alcool: 1.05, aromes_secondaires: 1.10 },
];

export const malolactiques = [
  { name: 'Oui', acidite: 0.75, aromes_tertiaires: 1.20 },
  { name: 'Non', acidite: 1.00, aromes_tertiaires: 1.00 },
];

export const elevageTypes = [
  { name: 'Cuve inox', tanins: 1.00, aromes_tertiaires: 1.00 },
  { name: 'Fût français', tanins: 1.05, aromes_tertiaires: 1.15 },
  { name: 'Fût américain', tanins: 1.10, aromes_tertiaires: 1.20 },
];

export const elevageDurees = [
  { name: 'Courte', tanins: 1.00, aromes_tertiaires: 1.00 },
  { name: 'Longue', tanins: 1.10, aromes_tertiaires: 1.20 },
];

export const elevageChauffes = [
  { name: 'Légère', aromes_tertiaires: 1.00 },
  { name: 'Moyenne', aromes_tertiaires: 1.08 },
  { name: 'Forte', aromes_tertiaires: 1.16 },
];

export function simulateWine(params) {
  const cepage = params.cepage;
  const vend = params.vendange;
  const sol = params.sol;
  const ensol = params.ensoleillement;
  const precip = params.precipitation;
  const foul = params.foulage;
  const lev = params.levure;
  const mac = params.maceration;
  const fermTemp = params.fermentationTemp;
  const fermDuree = params.fermentationDuree;
  const malo = params.malolactique;
  const elevType = params.elevageType;
  const elevDuree = params.elevageDuree;
  const elevChauffe = params.elevageChauffe;

  // Base values from cépage
  let sucre = cepage.sucre * vend.sucre * sol.sucre * ensol.sucre * precip.sucre;
  let acidite = cepage.acidite * vend.acidite * sol.acidite * ensol.acidite * precip.acidite * malo.acidite;
  let tanins = cepage.tanins * vend.tanins * sol.tanins * precip.tanins * foul.tanins * mac.tanins * elevType.tanins * elevDuree.tanins;
  
  let aromes_primaires = cepage.aromes_primaires * foul.aromes_primaires * mac.aromes_primaires;
  let aromes_secondaires = 5 * lev.aromes_secondaires * fermTemp.aromes_secondaires * fermDuree.aromes_secondaires;
  let aromes_tertiaires = 5 * malo.aromes_tertiaires * elevType.aromes_tertiaires * elevDuree.aromes_tertiaires * elevChauffe.aromes_tertiaires;

  // Alcohol calculation
  let alcool = (sucre * 0.06) * lev.alcool * fermTemp.alcool * fermDuree.alcool;
  // Residual sugar
  let sucreResiduel = Math.max(0, sucre - (alcool / 0.06 * 0.85));

  // Determine wine style
  let style = '';
  let wineType = cepage.type === 'rouge' ? 'Rouge' : 'Blanc';
  
  if (sucreResiduel > 45) style = 'Liquoreux';
  else if (sucreResiduel > 12) style = 'Moelleux';
  else if (sucreResiduel > 4) style = 'Demi-sec';
  else style = 'Sec';

  // Clamp values
  sucreResiduel = Math.round(sucreResiduel * 10) / 10;
  acidite = Math.round(acidite * 10) / 10;
  tanins = Math.round(Math.min(10, Math.max(0, tanins)) * 10) / 10;
  alcool = Math.round(Math.min(20, Math.max(0, alcool)) * 10) / 10;
  aromes_primaires = Math.round(Math.min(10, Math.max(0, aromes_primaires)) * 10) / 10;
  aromes_secondaires = Math.round(Math.min(10, Math.max(0, aromes_secondaires)) * 10) / 10;
  aromes_tertiaires = Math.round(Math.min(10, Math.max(0, aromes_tertiaires)) * 10) / 10;

  return {
    type: wineType,
    style,
    cepage: cepage.name,
    sucre: sucreResiduel,
    acidite,
    tanins,
    alcool,
    aromes_primaires,
    aromes_secondaires,
    aromes_tertiaires,
  };
}