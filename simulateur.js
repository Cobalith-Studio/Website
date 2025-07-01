// === Données des cépages ===
const cepages = {
    "🥂 Chardonnay": { sucre: 200, acidite: 6.7, tanins: 10, aromes: "floral", aromesSecSpecifiques: "fruits mûr", aromesTertSpecifiques: "noisette, amande" },
    "🥂 Sauvignon Blanc": { sucre: 180, acidite: 7.5, tanins: 5, aromes: "agrumes / fruits exotiques,  buis / poivron vert", aromesSecSpecifiques: "", aromesTertSpecifiques: "asperge" },
    "🥂 Sémillon": { sucre: 220, acidite: 5.5, tanins: 5, aromes: "fruits mûr, cire", aromesSecSpecifiques: "", aromesTertSpecifiques: "abricot sec, miel" },
    "🥂 Chenin Blanc": { sucre: 200, acidite: 7.0, tanins: 11, aromes: "agrumes / fruits exotiques, floral", aromesSecSpecifiques: "", aromesTertSpecifiques: "cire, miel" },
    "🥂 Muscat Blanc à Petits Grains": { sucre: 230, acidite: 6.0, tanins: 8, aromes: "abricot, pêche", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🥂 Viognier ": { sucre: 240, acidite: 4.5, tanins: 5, aromes: "floral", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🥂 Ugni Blanc": { sucre: 170, acidite: 7.5, tanins: 5, aromes: "neutre", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🥂 Colombard": { sucre: 190, acidite: 7.2, tanins: 5, aromes: "agrumes / fruits exotiques", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🥂 Melon de Bourgogne": { sucre: 180, acidite: 7.0, tanins: 5, aromes: "minéral, neutre", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🥂 Aligoté": { sucre: 180, acidite: 6.8, tanins: 5, aromes: "végétal, citron, pomme", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🥂 Gros Manseng": { sucre: 210, acidite: 7.0, tanins: 10, aromes: "agrumes / fruits exotiques", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🥂 Petit Manseng": { sucre: 250, acidite: 7.5, tanins: 10, aromes: "fruits exotiques", aromesSecSpecifiques: "mangue, passion", aromesTertSpecifiques: "" },
    "🥂 Clairette": { sucre: 200, acidite: 5.5, tanins: 10, aromes: "floral, pomme", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🥂 Roussanne": { sucre: 210, acidite: 5.8, tanins: 15, aromes: "floral, poire, abricot", aromesSecSpecifiques: "", aromesTertSpecifiques: "miel, fruits secs, thé" },
    "🥂 Marsanne": { sucre: 225, acidite: 5.2, tanins: 15, aromes: "fruits jaunes", aromesSecSpecifiques: "miel", aromesTertSpecifiques: "safran" },
    "🥂 Jacquère": { sucre: 180, acidite: 7.2, tanins: 5, aromes: "floral, neutre", aromesSecSpecifiques: "pain", aromesTertSpecifiques: "" },
    "🥂 Gewurztraminer": { sucre: 240, acidite: 5.0, tanins: 15, aromes: "rose, litchi, canelle", aromesSecSpecifiques: "gingenbre", aromesTertSpecifiques: "" },
    "🥂 Pinot Gris": { sucre: 230, acidite: 5.5, tanins: 15, aromes: "coing, mirabelle, fumé", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🥂 Riesling": { sucre: 200, acidite: 8.0, tanins: 5, aromes: "citron, tilleul, minéral", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },

    "🍷 Cabernet Sauvignon": { sucre: 220, acidite: 6.0, tanins: 55, aromes: "cassis, poivron / fruits exotiques", aromesSecSpecifiques: "café, tabac", aromesTertSpecifiques: "" },
    "🍷 Merlot": { sucre: 230, acidite: 5.0, tanins: 45, aromes: "prune, cerise", aromesSecSpecifiques: "", aromesTertSpecifiques: "chocolat, truffe" },
    "🍷 Syrah": { sucre: 220, acidite: 5.5, tanins: 50, aromes: "mûre, violette, olive noire, poivre", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🍷 Grenache Noir": { sucre: 240, acidite: 4.5, tanins: 35, aromes: "fraise, pruneau, poivre, canelle", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🍷 Pinot Noir": { sucre: 210, acidite: 6.5, tanins: 30, aromes: "cerise, framboise, violette, rose", aromesSecSpecifiques: "", aromesTertSpecifiques: "épices" },
    "🍷 Pinot Meunier": { sucre: 215, acidite: 6.3, tanins: 25, aromes: "cerise, framboise, champignon", aromesSecSpecifiques: "", aromesTertSpecifiques: "épices" },
    "🍷 Cabernet Franc": { sucre: 210, acidite: 6.0, tanins: 40, aromes: "framboise, poivron, bourgeon", aromesSecSpecifiques: "réglisse", aromesTertSpecifiques: "" },
    "🍷 Carignan": { sucre: 230, acidite: 5.5, tanins: 55, aromes: "fruits noirs, épices", aromesSecSpecifiques: "résine", aromesTertSpecifiques: "" },
    "🍷 Malbec": { sucre: 220, acidite: 5.8, tanins: 55, aromes: "fruits noirs, violette", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🍷 Tannat": { sucre: 210, acidite: 5.8, tanins: 65, aromes: "épices, fruits noirs", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🍷 Gamay": { sucre: 220, acidite: 6.2, tanins: 28, aromes: "fruits rouges, banane", aromesSecSpecifiques: "bonbon", aromesTertSpecifiques: "" },
    "🍷 Mourvèdre": { sucre: 230, acidite: 5.2, tanins: 60, aromes: "cuir, épices, fruits noirs", aromesSecSpecifiques: "", aromesTertSpecifiques: "truffe" },
    "🍷 Cinsault": { sucre: 230, acidite: 5.0, tanins: 25, aromes: "fruits rouges, rose", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🍷 Niellucciu": { sucre: 220, acidite: 6.3, tanins: 45, aromes: "réglisse, thym, romarin", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🍷 Mondeuse": { sucre: 210, acidite: 6.8, tanins: 55, aromes: "poivre, cassis, myrtille", aromesSecSpecifiques: "", aromesTertSpecifiques: "" },
    "🍷 Fer Servadou": { sucre: 210, acidite: 6.0, tanins: 55, aromes: "fraise, groseille, épices", aromesSecSpecifiques: "", aromesTertSpecifiques: "" }
};

// === Liste des vins rouges ===
const vinsRouges = [
    "🍷 Cabernet Sauvignon",
    "🍷 Merlot",
    "🍷 Syrah",
    "🍷 Grenache Noir",
    "🍷 Pinot Noir",
    "🍷 Cabernet Franc",
    "🍷 Carignan",
    "🍷 Malbec",
    "🍷 Tannat",
    "🍷 Gamay",
    "🍷 Mourvèdre",
    "🍷 Cinsault",
    "🍷 Niellucciu",
    "🍷 Mondeuse",
    "🍷 Fer Servadou"
];

// === Modificateurs ===
const vendanges = {
    "pré-maturation": { sucre: 0.90, acidite: 1.15, tanins: 0.90 },
    "maturation":     { sucre: 1.00, acidite: 1.00, tanins: 1.00 },
    "post-maturation":{ sucre: 1.15, acidite: 0.85, tanins: 1.05 }
};

const sols = {
    argileux:     { sucre: 1.00, acidite: 0.95, tanins: 1.10 },
    calcareux:     { sucre: 0.95, acidite: 1.10, tanins: 1.00 },
    sableux:      { sucre: 1.10, acidite: 0.90, tanins: 0.90 },
    volcanique:   { sucre: 1.00, acidite: 1.05, tanins: 1.05 },
    schisteux:    { sucre: 1.05, acidite: 1.00, tanins: 1.05 },
    graniteux:    { sucre: 1.00, acidite: 1.05, tanins: 0.95 }
};

const soleils = {
    faible:  { sucre: 0.90, acidite: 1.10 },
    modéré:  { sucre: 1.00, acidite: 1.00 },
    fort:    { sucre: 1.10, acidite: 0.90 }
};

const pluies = {
    basses:    { sucre: 1.10, acidite: 0.95, tanins: 1.10 },
    moyennes: { sucre: 1.00, acidite: 1.00, tanins: 1.00 },
    élevées:  { sucre: 0.90, acidite: 1.10, tanins: 0.90 }
};

const foulages = {
    aucun:  { tanins: 0.20, aromesPrim: 1.00 },
    partiel:{ tanins: 0.50, aromesPrim: 1.05 },
    complet:{ tanins: 1.00, aromesPrim: 1.10 }
};

const levures = {
    "Indigènes": { alcool: 1.00, aromesSec: 1.10 },
    "Artificielles": { alcool: 1.05, aromesSec: 1.00 }
};

const macerations = {
    aucune:  { tanins: 1.00, aromesPrim: 1.00 },
    courte:  { tanins: 1.10, aromesPrim: 1.05 },
    longue:  { tanins: 1.30, aromesPrim: 1.10 }
};

const fermentations = {
    temp: {
        basse: { alcool: 0.95, aromesSec: 1.00 },
        haute: { alcool: 1.05, aromesSec: 1.15 }
    },
    duree: {
        courte: { alcool: 0.95, aromesSec: 1.05 },
        longue: { alcool: 1.05, aromesSec: 1.10 }
    }
};

const malolactique = {
    oui:  { acidite: 0.75, aromesTert: 1.20 },
    non:  { acidite: 1.00, aromesTert: 1.00 }
};

const elevage = {
    type: {
        "Cuve en inox":       { tanins: 1.00, aromesTert: 1.00 },
        "Fût français":   { tanins: 1.05, aromesTert: 1.15 },
        "Fût américain":  { tanins: 1.10, aromesTert: 1.20 }
    },
    duree: {
        courte: { tanins: 1.00, aromesTert: 1.00 },
        longue: { tanins: 1.10, aromesTert: 1.20 }
    },
    chauffe: {
        légère:   { aromesTert: 1.00 },
        moyenne:  { aromesTert: 1.08 },
        forte:    { aromesTert: 1.16 }
    }
};

// === Ciblage HTML ===
const selectCepage = document.getElementById("select-cepage");
const selectVendange = document.getElementById("select-vendange");

const valNom = document.getElementById("val-nom");
const valType = document.getElementById("val-type");
const valSucre = document.getElementById("val-sucre");
const valAcidite = document.getElementById("val-acidite");
const valTanins = document.getElementById("val-tanins");
const valAlcool = document.getElementById("val-alcool");
const valAromesPrimaire = document.getElementById("val-aromes-primaire");
const valAromesSecondaire = document.getElementById("val-aromes-secondaire");
const valAromesTertiaire = document.getElementById("val-aromes-tertiaire");


const selectSol = document.getElementById("select-sol");
const selectSoleil = document.getElementById("select-soleil");
const selectPluie = document.getElementById("select-pluie");

const selectFoulage = document.getElementById("select-foulage");
const selectLevures = document.getElementById("select-levures");
const selectMaceration = document.getElementById("select-maceration");
const selectFermentationTemp = document.getElementById("select-fermentation-temp");
const selectFermentationDuree = document.getElementById("select-fermentation-duree");
const selectMalolactique = document.getElementById("select-malolactique");
const selectElevageType = document.getElementById("select-elevage-type");
const selectElevageDuree = document.getElementById("select-elevage-duree");
const selectElevageChauffe = document.getElementById("select-elevage-chauffe");

let instanceMaceration = null;
let instanceChauffe = null;

// === Fonction principale ===
function updateInfos() {
    const key = selectCepage.value;
    const moment = selectVendange.value;
    const sol = selectSol.value;
    const soleil = selectSoleil.value;
    const pluie = selectPluie.value;

    const foulage = selectFoulage.value;
    const levure = selectLevures.value;
    const maceration = selectMaceration.value;
    const fermentTemp = selectFermentationTemp.value;
    const fermentDuree = selectFermentationDuree.value;
    const malo = selectMalolactique.value;
    const elevType = selectElevageType.value;
    const elevDuree = selectElevageDuree.value;
    const chauffe = selectElevageChauffe.value;

    const isRouge = vinsRouges.includes(key);

    const base = cepages[key];
    if (!base) {
        valNom.textContent = "—";
        valType.textContent = "—";
        valSucre.textContent = "—";
        valAcidite.textContent = "—";
        valTanins.textContent = "—";
        valAlcool.textContent = "0.0";
        valAromesPrimaire.textContent = "N/A";
        valAromesSecondaire.textContent = "N/A";
        valAromesTertiaire.textContent = "N/A";
        return;
    }

    // Aide : fonction de fallback
    const safeMod = (obj, key) => (obj?.[key] ?? {});

    const modVend = safeMod(vendanges, moment);
    const modSol = safeMod(sols, sol);
    const modSoleil = safeMod(soleils, soleil);
    const modPluie = safeMod(pluies, pluie);
    const modFoulage = safeMod(foulages, foulage);
    const modLevure = safeMod(levures, levure);
    const modMaceration = safeMod(macerations, maceration);
    const modFermentTemp = safeMod(fermentations.temp, fermentTemp);
    const modFermentDuree = safeMod(fermentations.duree, fermentDuree);
    const modMalo = safeMod(malolactique, malo);
    const modElevType = safeMod(elevage.type, elevType);
    const modElevDuree = safeMod(elevage.duree, elevDuree);
    const modChauffe = safeMod(elevage.chauffe, chauffe);

    // Désactiver macération si vin blanc
    if (!isRouge) {
        selectMaceration.disabled = true;
        selectMaceration.innerHTML = `<option value="">Impossible pour ce cépage</option>`;
    } else if (selectMaceration.disabled) {
        selectMaceration.disabled = false;
        selectMaceration.innerHTML = `
            <option value="" disabled selected hidden>-- Choisir macération --</option>
            <option value="aucune">Aucune</option>
            <option value="courte">Courte</option>
            <option value="longue">Longue</option>
        `;
    }

    // Désactiver chauffe si inox
    if (elevType === "Cuve en inox") {
        selectElevageChauffe.disabled = true;
        selectElevageChauffe.innerHTML = `<option value="">Non applicable</option>`;
    } else {
        selectElevageChauffe.disabled = false;
        if (!selectElevageChauffe.querySelector("option[value='legere']")) {
            selectElevageChauffe.innerHTML = `
                <option value="" disabled selected hidden></option>
                <option value="legere">Légère</option>
                <option value="moyenne">Moyenne</option>
                <option value="forte">Forte</option>
            `;
        }
    }

    // === Données de base
    const sucreBase = base.sucre;
    const aciditeBase = base.acidite;
    const taninsBase = base.tanins;

    const sucreVendange = sucreBase * (modVend.sucre || 1);
    const aciditeVendange = aciditeBase * (modVend.acidite || 1);
    const taninsVendange = taninsBase * (modVend.tanins || 1);

    const sucreTerrain = sucreVendange * (modSol.sucre || 1) * (modSoleil.sucre || 1) * (modPluie.sucre || 1);
    const aciditeTerrain = aciditeVendange * (modSol.acidite || 1) * (modSoleil.acidite || 1) * (modPluie.acidite || 1);
    const taninsTerrain = taninsVendange * (modSol.tanins || 1) * (modPluie.tanins || 1);

    const sucreFinal = sucreTerrain;
    const aciditeFinal = aciditeTerrain * (modMalo.acidite || 1);
    const taninsFinal = taninsTerrain * (modFoulage.tanins || 1) * (modMaceration.tanins || 1) * (modElevType.tanins || 1) * (modElevDuree.tanins || 1);

    // === Arômes
    const aromesPrimList = (base.aromes || "").split(",").map(a => a.trim());
    const aromesSecSpecifiquesList = (base.aromesSecSpecifiques || "").split(",").map(a => a.trim()).filter(Boolean);
    const aromesTertSpecifiquesList = (base.aromesTertSpecifiques || "").split(",").map(a => a.trim()).filter(Boolean);

    // === Poids initiaux réalistes : primaire dominant
    let poidsPrimaires = 1.5;
    let poidsSecondaires = 0.8;
    let poidsTertiaires = 0.5;

    // === Boosts primaires
    poidsPrimaires *= modFoulage.aromesPrim || 1;
    poidsPrimaires *= modMaceration.aromesPrim || 1;
    if (levure === "Indigènes") poidsPrimaires *= 1.10;

    // === Boosts secondaires
    poidsSecondaires *= modFermentTemp.aromesSec || 1;
    poidsSecondaires *= modFermentDuree.aromesSec || 1;
    if (levure === "Artificielles") poidsSecondaires *= 1.05;
    if (aromesSecSpecifiquesList.length > 0 && fermentDuree === "longue") poidsSecondaires += 0.07;

    // === Boosts tertiaires
    poidsTertiaires *= modMalo.aromesTert || 1;
    poidsTertiaires *= modElevType.aromesTert || 1;
    poidsTertiaires *= modElevDuree.aromesTert || 1;
    poidsTertiaires *= modChauffe.aromesTert || 1;
    if (malo === "oui") poidsTertiaires *= 1.05;
    if (aromesTertSpecifiquesList.length > 0 && elevDuree === "longue") poidsTertiaires += 0.07;

    // === Ratios normalisés
    const totalPoids = poidsPrimaires + poidsSecondaires + poidsTertiaires;
    const repartition = {
        primaires: totalPoids > 0 ? poidsPrimaires / totalPoids : 0,
        secondaires: totalPoids > 0 ? poidsSecondaires / totalPoids : 0,
        tertiaires: totalPoids > 0 ? poidsTertiaires / totalPoids : 0
    };

    // === Texte affiché
    const formatPct = x => `${(x * 100).toFixed(1)}%`;
    const aromesTrad = aromesPrimList;

    const fermentProfileBase = (modFermentTemp.aromesSec || 1) * (modFermentDuree.aromesSec || 1) >= 1.10
        ? "fleurs fraîches"
        : "levures";

    let finalFermentProfile;
    if (aromesSecSpecifiquesList.length > 0 && fermentDuree === "longue") {
        finalFermentProfile = `${fermentProfileBase}, ${aromesSecSpecifiquesList.join(", ")}`;
    } else {
        finalFermentProfile = fermentProfileBase;
    }

    let tertProfileBase = "notes de profondeur";
    if (elevType === "Fût français") tertProfileBase = "vanille";
    if (elevType === "Fût américain") tertProfileBase = "toast, cacao, fumé";
    if (malo === "oui") tertProfileBase += ", beurre";
    if (elevType !== "Cuve en inox") {
        if (chauffe === "legere") tertProfileBase += ", coco, fruits secs";
        if (chauffe === "moyenne") tertProfileBase += ", pain grillé";
        if (chauffe === "forte") tertProfileBase += ", torréfié, bois brûlé";
    }

    let finalTertProfile;
    if (aromesTertSpecifiquesList.length > 0 && elevDuree === "longue") {
        finalTertProfile = `${tertProfileBase}, ${aromesTertSpecifiquesList.join(", ")}`;
    } else {
        finalTertProfile = tertProfileBase;
    }

    valAromesPrimaire.textContent = repartition.primaires > 0
        ? `${aromesTrad.join(", ")} (${formatPct(repartition.primaires)})`
        : "—";
    valAromesSecondaire.textContent = repartition.secondaires > 0
        ? `${finalFermentProfile} (${formatPct(repartition.secondaires)})`
        : "—";
    valAromesTertiaire.textContent = repartition.tertiaires > 0
        ? `${finalTertProfile} (${formatPct(repartition.tertiaires)})`
        : "—";

    // === Alcool
    const typeVin = isRouge ? "rouge" : "blanc";
    let sucreToAlcoolRatio = 17;
    if (levure === "Indigènes") sucreToAlcoolRatio = typeVin === "rouge" ? 18 : 16.5;
    else if (levure === "Artificielles") sucreToAlcoolRatio = typeVin === "rouge" ? 17.5 : 16.0;

    const rendementFermentation = (modFermentTemp.alcool || 1) * (modFermentDuree.alcool || 1);
    const alcoolPotentiel = sucreFinal / sucreToAlcoolRatio;
    const alcoolProduit = Math.min(alcoolPotentiel * rendementFermentation, 15.5);
    const sucreFermente = alcoolProduit * sucreToAlcoolRatio;
    const sucreResidual = Math.max(sucreFinal - sucreFermente, 0);

    // === Affichage infos
    valSucre.textContent = `${sucreBase} (${sucreVendange.toFixed(0)}) ⇒ ${sucreTerrain.toFixed(0)} (${sucreResidual.toFixed(1)})`;
    valAcidite.textContent = `${aciditeBase.toFixed(2)} (${aciditeVendange.toFixed(2)}) ⇒ ${aciditeTerrain.toFixed(2)} (${aciditeFinal.toFixed(2)})`;
    valTanins.textContent = `${taninsBase} (${taninsVendange.toFixed(1)}) ⇒ ${taninsTerrain.toFixed(1)} (${taninsFinal.toFixed(1)})`;
    valAlcool.textContent = `${alcoolProduit.toFixed(1)}`;

    // Affichage type, nom et style
    valNom.textContent = nettoyerNomCepage(key);
    let type = "Indéfini";

    const nomCepage = nettoyerNomCepage(key);

    const blancsEffervescents = [
        "Chardonnay", "Chenin Blanc", "Muscat Blanc à Petits Grains",
        "Aligoté", "Clairette", "Jacquère", "Riesling"
    ];

    const rougesEffervescents = [
        "Pinot Noir", "Gamay", "Pinot Meunier"
    ];

    const blancsDeNoirs = [
        "Pinot Noir", "Cabernet Franc", "Pinot Meunier"
    ];

    if (
        !isRouge &&
        blancsEffervescents.includes(nomCepage) &&
        moment === "pré-maturation" &&
        sucreVendange < 200 &&
        fermentDuree !== "longue"
    ) {
        type = "Effervescent";
    }

    else if (
        isRouge &&
        rougesEffervescents.includes(nomCepage) &&
        moment === "pré-maturation" &&
        sucreVendange < 200 &&
        fermentDuree !== "longue" &&
        foulage !== "complet" &&
        maceration === "aucune" &&
        malo === "non"
    ) {
        type = "Effervescent";
    }

    else if (
        isRouge &&
        blancsDeNoirs.includes(nomCepage) &&
        maceration === "aucune" &&
        foulage !== "complet"
    ) {
        type = "Blanc de Noirs";
    }

    else if (
        isRouge &&
        maceration !== "longue" &&
        foulage !== "complet"
    ) {
        type = "Rosé";
    }

    else if (
        isRouge &&
        foulage !== "aucun" &&
        maceration !== "aucune"
    ) {
        type = "Rouge";
    }

    else if (!isRouge) {
        type = "Blanc";
    }

    valType.textContent = type;

    let style = [];

    if (type === "Effervescent") {
        if (sucreResidual <= 3) {
            style.push("Brut nature");
        } else if (sucreResidual <= 6) {
            style.push("Extra-Brut");
        } else if (sucreResidual <= 12) {
            style.push("Brut");
        } else if (sucreResidual <= 17) {
            style.push("Extra-Sec");
        } else if (sucreResidual <= 32) {
            style.push("Sec");
        } else if (sucreResidual <= 50) {
            style.push("Demi-Sec");
        } else {
            style.push("Doux");
        }

    } else {
        if (sucreResidual < 4) {
            style.push("Sec");
        } else if (sucreResidual < 15) {
            style.push("Demi-sec");
        } else if (sucreResidual < 45) {
            style.push("Moelleux");
        } else {
            style.push("Liquoreux");
        }
    }

    if (alcoolProduit > 13.5) style.push("Corsé");
    else if (alcoolProduit < 10) style.push("Léger");

    if (aciditeFinal > 7) style.push("Vif");
    else if (aciditeFinal < 4) style.push("Souple");

    if (taninsFinal > 30) style.push("Tannique");
    if (repartition.primaires > 0.5) style.push("Aromatique");
    if (repartition.tertiaires > 0.4) style.push("Évolué");

    const styleFinal = style.join(", ");
    document.getElementById("val-style").textContent = styleFinal;
}

function initChoicesAvecDescriptions(selectElement, dataMap, keysToFormat) {
    const instance = new Choices(selectElement, {
        searchEnabled: false,
        itemSelectText: '',
        shouldSort: false,
        allowHTML: true
    });

    const format = (label, value) => {
        const ratio = value.toFixed(2);
        if (value > 1) return `<span style="color: green;">${label} ×${ratio}</span>`;
        if (value < 1) return `<span style="color: red;">${label} ×${ratio}</span>`;
        return `${label} ×${ratio}`;
    };

    const choices = Object.entries(dataMap).map(([key, mods]) => {
        const nom = key.charAt(0).toUpperCase() + key.slice(1);
        const description = keysToFormat.map(k => format(k[0], mods[k[1]])).join(" / ");
        return {
            value: key,
            label: `${nom} (${description})`,
            customProperties: { innerHTML: `${nom} (${description})` }
        };
    });

    instance.clearChoices();
    instance.setChoices([], 'value', 'label', true);
    instance.setChoices(choices, 'value', 'label', false);

    return instance;
}

function verrouillerMacerationSiBlanc() {
    const key = selectCepage.value;
    const isRouge = vinsRouges.includes(key);

    if (!instanceMaceration) return;

    // Cas cépage blanc → macération désactivée
    if (!isRouge) {
        instanceMaceration.clearChoices();
        instanceMaceration.setChoices(
            [{ value: "", label: "Impossible pour les cépages blancs", disabled: true, selected: true }],
            'value', 'label', false
        );
        instanceMaceration.disable();
    }

    // Cas cépage rouge → macération activée avec options normales
    else {
        instanceMaceration.enable();
        instanceMaceration.clearChoices();
        instanceMaceration.setChoices(
            [
                { value: "", label: "", disabled: true, selected: true },
                { value: "aucune", label: "Aucune" },
                { value: "courte", label: "Courte" },
                { value: "longue", label: "Longue" }
            ],
            'value', 'label', false
        );
    }
}

function verrouillerChauffeSiInox() {
    if (!instanceChauffe) return;

    const elevType = selectElevageType.value;

    if (!elevType || elevType === "") {
        instanceChauffe.clearChoices();
        instanceChauffe.setChoices(
            [{ value: "", label: "", disabled: true, selected: true }],
            'value', 'label', false
        );
        instanceChauffe.enable();
        return;
    }

    if (elevType === "Cuve en inox") {
        instanceChauffe.clearChoices();
        instanceChauffe.setChoices(
            [{ value: "", label: "Non applicable pour les cuves en inox", disabled: true, selected: true }],
            'value', 'label', false
        );
        instanceChauffe.disable();
    } else {
        instanceChauffe.enable();
        instanceChauffe.clearChoices();
        instanceChauffe.setChoices(
            [
                { value: "", label: "", disabled: true, selected: true },
                { value: "legere", label: "Légère" },
                { value: "moyenne", label: "Moyenne" },
                { value: "forte", label: "Forte" }
            ],
            'value', 'label', false
        );
    }
}

function nettoyerNomCepage(key) {
    return key.replace(/^[^a-zA-Z0-9]+/, "").trim();
}

// === Événements ===

selectCepage.addEventListener("change", updateInfos);
selectVendange.addEventListener("change", updateInfos);
selectSol.addEventListener("change", updateInfos);
selectSoleil.addEventListener("change", updateInfos);
selectPluie.addEventListener("change", updateInfos);
selectFoulage.addEventListener("change", updateInfos);
selectLevures.addEventListener("change", updateInfos);
selectMaceration.addEventListener("change", updateInfos);
selectFermentationTemp.addEventListener("change", updateInfos);
selectFermentationDuree.addEventListener("change", updateInfos);
selectMalolactique.addEventListener("change", updateInfos);
selectElevageType.addEventListener("change", updateInfos);
selectElevageDuree.addEventListener("change", updateInfos);
selectElevageChauffe.addEventListener("change", updateInfos);

selectCepage.addEventListener("change", () => {
    verrouillerMacerationSiBlanc();
    updateInfos();
});

selectElevageType.addEventListener("change", () => {
    verrouillerChauffeSiInox();
    updateInfos();
});

document.addEventListener("DOMContentLoaded", () => {
    const instanceCepage = new Choices(selectCepage, {
        searchEnabled: false,
        itemSelectText: '',
        shouldSort: false,
        allowHTML: true,
        placeholder: true,
        placeholderValue: ""
    });

    const cepageChoices = Object.entries(cepages).map(([key, props]) => {
        const nom = key.replace(/^. /, "").replace(/\s*\(.*?\)/, "");
        return {
            value: key,
            label: nom,
            customProperties: { innerHTML: nom }
        };
    });

    instanceCepage.clearChoices();
    instanceCepage.setChoices(cepageChoices, 'value', 'label', false);


    initChoicesAvecDescriptions(selectVendange, vendanges, [
        ["Sucre", "sucre"], ["Acidité", "acidite"], ["Tanins", "tanins"]
    ]);

    initChoicesAvecDescriptions(selectSol, sols, [
        ["Sucre", "sucre"], ["Acidité", "acidite"], ["Tanins", "tanins"]
    ]);

    initChoicesAvecDescriptions(selectSoleil, soleils, [
        ["Sucre", "sucre"], ["Acidité", "acidite"]
    ]);

    initChoicesAvecDescriptions(selectPluie, pluies, [
        ["Sucre", "sucre"], ["Acidité", "acidite"], ["Tanins", "tanins"]
    ]);

    initChoicesAvecDescriptions(selectFoulage, foulages, [
        ["Tanins", "tanins"], ["Arômes prim.", "aromesPrim"]
    ]);

    initChoicesAvecDescriptions(selectLevures, levures, [
        ["Alcool", "alcool"], ["Arômes sec.", "aromesSec"]
    ]);

    initChoicesAvecDescriptions(selectFermentationTemp, fermentations.temp, [
        ["Alcool", "alcool"], ["Arômes sec.", "aromesSec"]
    ]);

    initChoicesAvecDescriptions(selectFermentationDuree, fermentations.duree, [
        ["Alcool", "alcool"], ["Arômes sec.", "aromesSec"]
    ]);

    initChoicesAvecDescriptions(selectMalolactique, malolactique, [
        ["Acidité", "acidite"], ["Arômes tert.", "aromesTert"]
    ]);

    initChoicesAvecDescriptions(selectElevageType, elevage.type, [
        ["Tanins", "tanins"], ["Arômes tert.", "aromesTert"]
    ]);

    initChoicesAvecDescriptions(selectElevageDuree, elevage.duree, [
        ["Tanins", "tanins"], ["Arômes tert.", "aromesTert"]
    ]);

    instanceMaceration = initChoicesAvecDescriptions(selectMaceration, macerations, [
        ["Tanins", "tanins"], ["Arômes prim.", "aromesPrim"]
    ]);

    instanceChauffe = initChoicesAvecDescriptions(selectElevageChauffe, elevage.chauffe, [
        ["Arômes tert.", "aromesTert"]
    ]);

});
