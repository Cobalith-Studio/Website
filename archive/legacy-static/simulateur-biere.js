// simulateur-biere.js

document.addEventListener("DOMContentLoaded", () => {
    init();
    setupEvents();
    compute();
});

const choicesInstances = {};

// === Définition des malts et plages par catégorie ===
const maltCategories = {
    base: {
        id: "malt-base",
        label: "Malt de base",
        min: 51,
        max: 100,
        options: {
            "Pilsner":       { abv: 4, ebc: 2.5,  aromes: ["Céréale", "Pain blanc"] },
            "Pale Ale":      { abv: 3.8, ebc: 6,  aromes: ["Céréale", "Toasté léger"] },
            "Vienna":        { abv: 3.2, ebc: 9,  aromes: ["Biscuit", "Noisette"] },
            "Munich":        { abv: 2.8, ebc: 20, aromes: ["Pain", "Malté", "Caramel léger"] }
        }
    },
    touraille: {
        id: "malt-touraille",
        label: "Malt touraillé",
        min: 0,
        max: 30,
        options: {
            "Aucun": {},
            "Melano":        { abv: 0, ebc: 80, aromes: ["Malté", "Corps plein"] },
            "Abbaye":        { abv: 0, ebc: 45, aromes: ["Pain", "Caramel", "Sec"] },
            "Biscuit":       { abv: 0, ebc: 50, aromes: ["Pain grillé", "Biscuit"] },
            "Amber":         { abv: 0, ebc: 60, aromes: ["Toasté", "Pain", "Miel"] }
        }
    },
    caramel: {
        id: "malt-caramel",
        label: "Malt caramel",
        min: 0,
        max: 15,
        options: {
            "Aucun": {},
            "Cara Clair":    { abv: 0, ebc: 8,  aromes: ["Léger", "Miel"] },
            "Cara Blond":    { abv: 0, ebc: 20, aromes: ["Caramel", "Douceur"] },
            "Cara Ruby":     { abv: 0, ebc: 50, aromes: ["Caramel", "Fruits secs"] },
            "Cara Munich":   { abv: 0, ebc: 100, aromes: ["Sucré", "Toffee", "Raisin"] },
            "Special B":     { abv: 0, ebc: 300, aromes: ["Prune", "Raisin", "Sucre brun"] }
        }
    },
    torrefie: {
        id: "malt-torrefie",
        label: "Malt torréfié",
        min: 0,
        max: 10,
        options: {
            "Aucun": {},
            "Chocolat":      { abv: 0, ebc: 800, aromes: ["Chocolat", "Sec"] },
            "Black Patent":  { abv: 0, ebc: 1200, aromes: ["Brûlé", "Astringent"] },
            "Roasted Barley":{ abv: 0, ebc: 1000, aromes: ["Café", "Brûlé"] }
        }
    },
    autres: {
        id: "autres-malts",
        label: "Autres malts",
        min: 0,
        max: 30,
        options: {
            "Aucun": {},
            "Fumé":          { abv: 0, ebc: 10, aromes: ["Fumé", "Boisé"] },
            "Whisky":        { abv: 0, ebc: 20, aromes: ["Fumé", "Épicé"] },
            "Seigle":        { abv: 1, ebc: 10, aromes: ["Poivré", "Sec"] },
            "Blé":           { abv: 1, ebc: 5,  aromes: ["Léger", "Douceur"] },
            "Avoine":        { abv: 0, ebc: 2,  aromes: ["Onctueux", "Velouté"] },
            "Sarrasin":      { abv: 0, ebc: 3,  aromes: ["Noisette", "Terreux"] },
            "Épeautre":      { abv: 0, ebc: 4,  aromes: ["Pain", "Herbacé"] }
        }
    }
};

// === Informations des houblons ===
const hopProfiles = {
    // === Houblons français ===
    "Aramis":                 { alpha: 8, type: "aromatique", aromas: ["Herbe", "Fleur", "Terre", "Citron"] },
    "Strisselspalt":          { alpha: 3, type: "aromatique", aromas: ["Herbe", "Épice", "Fleur"] },
    "Triskel":                { alpha: 7, type: "aromatique", aromas: ["Agrume", "Fleur", "Fruit à noyau"] },
    "Elixir":                 { alpha: 4, type: "aromatique", aromas: ["Épice", "Cassis", "Agrume", "Cèdre"] },
    "Mistral":                { alpha: 5, type: "aromatique", aromas: ["Fruits blancs", "Fleur", "Basilic"] },
    "Barbe Rouge":            { alpha: 4, type: "aromatique", aromas: ["Fraise", "Fruits rouges", "Agrume"] },
    "Précoce de Bourgogne":   { alpha: 5, type: "aromatique", aromas: ["Fruit rouge", "Floral"] },
    "Tardif de Bourgogne":    { alpha: 6, type: "aromatique", aromas: ["Fleur", "Fruits rouges"] },
    "Elsasser":               { alpha: 4.5, type: "aromatique", aromas: ["Fleur", "Léger", "Pilsner"] },

    // === Houblons européens classiques ===
    "Saaz":                   { alpha: 4, type: "aromatique", aromas: ["Épice", "Terre", "Fleur"] },
    "Hallertau":              { alpha: 4.5, type: "aromatique", aromas: ["Fleur", "Épice", "Terre"] },
    "Tettnang":               { alpha: 5, type: "aromatique", aromas: ["Épice", "Herbe", "Fleur"] },
    "Northern Brewer":        { alpha: 8, type: "dual",       aromas: ["Menthe", "Résine", "Boisé"] },

    // === Houblons américains très utilisés ===
    "Magnum":                 { alpha: 12, type: "amérisant", aromas: ["Résine", "Épice légère"] },
    "Nugget":                 { alpha: 13, type: "amérisant", aromas: ["Herbe", "Épice", "Résine"] },
    "Chinook":                { alpha: 13, type: "dual",      aromas: ["Pin", "Épice", "Pamplemousse"] },
    "Cascade":                { alpha: 6,  type: "aromatique", aromas: ["Agrume", "Fleur", "Pamplemousse"] },
    "Citra":                  { alpha: 12, type: "aromatique", aromas: ["Mangue", "Citron vert", "Tropical"] },
    "Mosaic":                 { alpha: 12, type: "dual",      aromas: ["Baies", "Fruit tropical", "Terre"] },
    "Amarillo":               { alpha: 9,  type: "dual",      aromas: ["Fleur", "Agrume", "Fruit à noyau"] },
    "Simcoe":                 { alpha: 13, type: "dual",      aromas: ["Pin", "Fruit tropical", "Bois"] },
    "Centennial":             { alpha: 10, type: "dual",      aromas: ["Citron", "Épice", "Floral"] },
    "Columbus":               { alpha: 15, type: "dual",      aromas: ["Résine", "Poivre", "Réglisse"] },

    // === Autres houblons notables ===
    "East Kent Goldings":     { alpha: 5, type: "aromatique", aromas: ["Miel", "Épice", "Thym", "Lavande"] },
    "Bramling Cross":         { alpha: 6, type: "aromatique", aromas: ["Mûre", "Groseille", "Citron"] },
    "Galaxy":                 { alpha: 14, type: "aromatique", aromas: ["Fruit de la passion", "Pêche", "Citrus"] },
    "Nelson Sauvin":          { alpha: 12, type: "aromatique", aromas: ["Raisin blanc", "Tropical", "Citron"] },

    // === Houblons amérisants additionnels ===
    "Pacific Gem":            { alpha: 15, type: "amérisant", aromas: ["Myrtille", "Pin", "Poivre noir"] },
    "Apollo":                 { alpha: 18, type: "amérisant", aromas: ["Résine", "Pamplemousse"] },
    "Bravo":                  { alpha: 16, type: "amérisant", aromas: ["Orange", "Résine", "Épice"] },
    "Admiral":                { alpha: 14, type: "amérisant", aromas: ["Orange", "Thé noir", "Boisé"] },
    "Brewer’s Gold":          { alpha: 9, type: "amérisant", aromas: ["Fruits noirs", "Épice", "Herbe"] },
    "Challenger":             { alpha: 8, type: "amérisant", aromas: ["Épice", "Herbacé", "Fruité"] }
};


// === Autres ingrédients ===
const yeasts = ["Saccharomyces cerevisiae", "Saccharomyces pastorianus", "Brettanomyces"];
const fermentations = ["Contrôlée", "Spontanée"];
const ajouts = ["Coriandre", "Orange", "Framboise", "Cerise", "Café", "Pomme", "Citrus"];
const empattage = ["Bas (60-63°C)", "Haut (67-70°C)"];
const tempFerment = ["Basse (10-13°C)", "Haute (18-24°C)"];
const dureeFerment = ["3 jours", "7 jours", "14 jours"];
const garde = ["Aucune", "1 semaine", "3 semaines", "3 mois"];
const carbonatation = ["Naturelle", "Forcée"];
const ebullition = ["60 min", "75 min", "90 min"];

// === Gestion de l'aromatique ===
const aromaGroups = {
    // CÉRÉALE
    "Céréale": "Céréale",
    "Pain blanc": "Céréale",
    "Pain": "Céréale",
    "Pain grillé": "Céréale",
    "Biscuit": "Céréale",
    "Biscuité": "Céréale",
    "Malté": "Céréale",

    // CARAMÉLISÉ
    "Caramel": "Caramélisé",
    "Sucré": "Caramélisé",
    "Toffee": "Caramélisé",
    "Sucre brun": "Caramélisé",

    // TORRÉFIÉ
    "Chocolat": "Torréfié",
    "Café": "Torréfié",
    "Brûlé": "Torréfié",
    "Noisette": "Torréfié",
    "Astringent": "Torréfié",
    "Sec": "Torréfié",

    // FRUITÉ
    "Fruit": "Fruité",
    "Fruits secs": "Fruité",
    "Fruit rouge": "Fruité",
    "Baies": "Fruité",
    "Pomme": "Fruité",
    "Poire": "Fruité",
    "Pêche": "Fruité",
    "Prune": "Fruité",
    "Raisin": "Fruité",
    "Tropical": "Fruité",
    "Agrume léger": "Fruité",
    "Pamplemousse": "Fruité",
    "Citrus": "Fruité",
    "Orange": "Fruité",
    "Framboise": "Fruité",
    "Cerise": "Fruité",
    "Fruit de la passion": "Fruité",

    // HERBACÉ
    "Herbe": "Herbacé",
    "Menthe": "Herbacé",
    "Evergreen": "Herbacé",
    "Résine": "Herbacé",
    "Pin": "Herbacé",
    "Terre": "Herbacé",

    // FLORAL
    "Fleur": "Floral",
    "Floral": "Floral",

    // ÉPICÉ
    "Épice": "Épicé",
    "Poivré": "Épicé",
    "Coriandre": "Épicé",

    // BOISÉ
    "Boisé": "Boisé",
    "Noble": "Boisé",

    // NEUTRE
    "Léger": "Neutre",
    "Onctueux": "Neutre",
    "Doux": "Neutre",
    "Pilsner": "Neutre",

    // FERMENTATION SAUVAGE
    "Funky": "Fermentation sauvage",
    "Acidulé": "Fermentation sauvage"
};

// === Génère une étiquette lisible pour chaque malt
function generateLabel(name, data) {
    const details = [];
    if (data.abv) details.push(`+${data.abv} ABV`);
    if (data.ebc) details.push(`+${data.ebc} EBC`);
    if (data.ibu) details.push(`+${data.ibu} IBU`);
    const aromes = data.aromes?.length ? data.aromes.join(" & ") : null;

    const meta = details.length ? ` (${details.join(", ")})` : "";
    const aroma = aromes ? ` - ${aromes}` : "";

    return `${name}${meta}${aroma}`;
}

// === Initialisation
function init() {
    Object.entries(maltCategories).forEach(([key, cat]) => {
        const select = document.getElementById(`select-${cat.id}`);
        const slider = document.getElementById(`range-${cat.id}`);
        const span = document.getElementById(`percent-${cat.id}`);

        select.innerHTML = "";
        const empty = document.createElement("option");
        empty.value = "";
        empty.textContent = " ";
        empty.disabled = true;
        empty.selected = true;
        empty.hidden = true;
        select.appendChild(empty);

        Object.entries(cat.options).forEach(([name, data]) => {
            const opt = document.createElement("option");
            opt.value = name;
            opt.textContent = generateLabel(name, data);
            select.appendChild(opt);
        });

        new Choices(select, {
            searchEnabled: false,
            itemSelectText: "",
            allowHTML: false,
            placeholder: true,
            placeholderValue: "",
            shouldSort: false,
            removeItemButton: false,
            duplicateItemsAllowed: false
        });

        slider.min = 0;
        slider.max = 100;
        slider.value = key === "base" ? cat.max : 0;
        span.textContent = slider.value + "%";
    });

    populateHopSelects();

    function populateHopSelects() {
        const amers = Object.keys(hopProfiles).filter(h => hopProfiles[h].type !== 'aromatique');
        const aromes = Object.keys(hopProfiles).filter(h => hopProfiles[h].type !== 'amérisant');

        populate("select-houblons-amers", amers, true);
        populate("select-houblons-aromes", aromes, true);

        ["select-houblons-amers", "select-houblons-aromes"].forEach(id => {
            document.getElementById(id).addEventListener("change", () => {
                const selectedAmers = get("select-houblons-amers");
                const selectedAromes = get("select-houblons-aromes");

                Array.from(document.getElementById("select-houblons-amers").options).forEach(opt => {
                    opt.disabled = selectedAromes.includes(opt.value);
                });

                Array.from(document.getElementById("select-houblons-aromes").options).forEach(opt => {
                    opt.disabled = selectedAmers.includes(opt.value);
                });

                updateFermentationRules();
                updateGardeOptions();
                compute();
            });
        });
    }

    populate("select-levure", yeasts);
    populate("select-fermentation", fermentations);
    populate("select-ajouts", ajouts, true);
    populate("select-empattage", empattage);
    populate("select-ebullition", ebullition.map(t => {
        const coeffs = { "60 min": 1.00, "75 min": 1.10, "90 min": 1.20 };
        return `${t} (IBU ×${coeffs[t].toFixed(2)})`;
    }));
    populate("select-temp-fermentation", tempFerment);
    populate("select-duree-fermentation", dureeFerment);

    // Initialisation Choices avec stockage pour garde
    const gardeSelect = document.getElementById("select-garde");
    choicesInstances["select-garde"] = new Choices(gardeSelect, {
        searchEnabled: false,
        removeItemButton: false,
        itemSelectText: "",
        allowHTML: false,
        shouldSort: false,
        placeholder: true,
        placeholderValue: "",
        duplicateItemsAllowed: false
    });

    populate("select-carbonatation", carbonatation);
}

function populate(id, items, multiple = false) {
    const sel = document.getElementById(id);
    sel.innerHTML = "";

    if (!multiple) {
        const empty = document.createElement("option");
        empty.value = "";
        empty.textContent = " ";
        empty.selected = true;
        sel.appendChild(empty);
    }

    items.forEach(v => {
        const o = document.createElement("option");
        o.value = v;
        o.textContent = v;
        sel.appendChild(o);
    });

    new Choices(sel, {
        searchEnabled: false,
        removeItemButton: multiple,
        itemSelectText: "",
        allowHTML: false,
        shouldSort: false,
        placeholder: true,
        placeholderValue: "",
        duplicateItemsAllowed: false
    });
}

// === Sliders & Levures
function setupEvents() {
    document.querySelectorAll("input[type='range']").forEach(slider => {
        updateSliderVisual(slider);

        slider.addEventListener("input", () => {
            const id = slider.id.split("range-")[1];
            const cat = Object.values(maltCategories).find(c => c.id === id);
            let val = parseInt(slider.value);

            if (val < cat.min) val = cat.min;
            if (val > cat.max) val = cat.max;

            slider.value = val;
            document.getElementById(`percent-${cat.id}`).textContent = val + "%";

            updateSliderVisual(slider);
            balanceSliders(slider);
            compute();
        });
    });

    document.querySelectorAll("select").forEach(s => s.addEventListener("change", compute));

    // Gestion des règles dynamiques selon fermentation et levure
    document.getElementById("select-fermentation").addEventListener("change", () => {
        updateFermentationRules();
        updateGardeOptions(); // Ajouté ici pour forcer l'update correct
        compute();
    });
    document.getElementById("select-levure").addEventListener("change", () => {
        updateGardeOptions();
        compute();
    });
}

function updateFermentationRules() {
    const fermentation = getVal("select-fermentation");
    const blocLevure = document.getElementById("bloc-levure");
    const selectLevure = document.getElementById("select-levure");

    if (fermentation === "Spontanée") {
        blocLevure.style.display = "none";
        selectLevure.value = "";
    } else {
        blocLevure.style.display = "block";
    }

    updateGardeOptions();
}

function updateGardeOptions() {
    const fermentation = getVal("select-fermentation");
    const levure = getVal("select-levure");
    const gardeSelect = document.getElementById("select-garde");
    const gardeBloc = document.getElementById("bloc-garde");

    const optionsMap = {
        "Saccharomyces cerevisiae": ["Aucune", "1 semaine"],
        "Saccharomyces pastorianus": ["1 semaine", "3 semaines", "3 mois"],
        "Brettanomyces": ["3 semaines", "3 mois"],
        "Spontanée": ["3 semaines", "3 mois"]
    };

    let allowed = [];
    if (fermentation === "Spontanée") {
        allowed = optionsMap["Spontanée"];
    } else if (optionsMap[levure]) {
        allowed = optionsMap[levure];
    }

    // ⚠️ Supprimer l’instance Choices existante
    if (choicesInstances["select-garde"]) {
        choicesInstances["select-garde"].destroy();
        delete choicesInstances["select-garde"];
    }

    // 💡 Nettoyage et recréation du <select>
    gardeSelect.innerHTML = "";
    if (allowed.length > 0) {
        gardeBloc.style.display = "block";

        const empty = document.createElement("option");
        empty.value = "";
        empty.textContent = " ";
        empty.selected = true;
        gardeSelect.appendChild(empty);

        allowed.forEach(opt => {
            const o = document.createElement("option");
            o.value = opt;
            o.textContent = opt;
            gardeSelect.appendChild(o);
        });
    } else {
        gardeBloc.style.display = "none";
    }

    // 🧩 Recréation et stockage de Choices
    choicesInstances["select-garde"] = new Choices(gardeSelect, {
        searchEnabled: false,
        removeItemButton: false,
        itemSelectText: "",
        allowHTML: false,
        shouldSort: false,
        placeholder: true,
        placeholderValue: "",
        duplicateItemsAllowed: false
    });

    // ⛔ Réinitialise valeur si invalide
    if (!allowed.includes(gardeSelect.value)) {
        gardeSelect.value = "";
    }
}

function updateSliderVisual(slider) {
    const id = slider.id.split("range-")[1];
    const cat = Object.values(maltCategories).find(c => c.id === id);

    const validStart = (cat.min / 100) * 100;
    const validEnd = (cat.max / 100) * 100;

    slider.style.background = `
        linear-gradient(to right,
            #8e2e2e 0%,
            #8e2e2e ${validStart}%,
            var(--main-color) ${validStart}%,
            var(--main-color) ${validEnd}%,
            #8e2e2e ${validEnd}%,
            #8e2e2e 100%)`;
}

function balanceSliders(changedSlider) {
    const total = getTotalPercent();
    if (total <= 100) return;

    const excess = total - 100;
    const sliders = Array.from(document.querySelectorAll("input[type='range']")).filter(s => s !== changedSlider);

    let remaining = excess;
    for (const s of sliders) {
        const cat = Object.values(maltCategories).find(c => `range-${c.id}` === s.id);
        const min = parseInt(cat.min);
        const reducible = parseInt(s.value) - min;
        const reduction = Math.min(reducible, remaining);
        s.value = parseInt(s.value) - reduction;
        document.getElementById(`percent-${cat.id}`).textContent = s.value + "%";
        updateSliderVisual(s);
        remaining -= reduction;
        if (remaining <= 0) break;
    }
}

function getTotalPercent() {
    return Array.from(document.querySelectorAll("input[type='range']"))
        .map(s => parseInt(s.value))
        .reduce((a, b) => a + b, 0);
}

// --- Calcul final ---
function compute() {
    let abv = 0, ebc = 5, aromes = [];
    let baseValid = false;

    // --- Malts ---
    Object.entries(maltCategories).forEach(([key, cat]) => {
        const name = document.getElementById(`select-${cat.id}`).value;
        const percent = parseInt(document.getElementById(`range-${cat.id}`).value);
        if (!name || percent === 0) return;

        const ratio = percent / 100;
        const malt = cat.options[name];

        if (key === "base" && percent >= 51) baseValid = true;
        if (malt.abv) abv += malt.abv * ratio;
        if (malt.ebc) ebc += malt.ebc * ratio;
        if (malt.aromes) aromes.push(...malt.aromes);
    });

    const total = getTotalPercent();
    if (total !== 100 || !baseValid) {
        set("val-type", "Erreur");
        set("val-style", "⚠ Malts non valides (total ≠ 100% ou aucun malt de base ≥51%)");
        set("val-abv", "—");
        set("val-ibu", "—");
        set("val-ebc", "—");
        set("val-aromes", "—");
        set("val-arome-dominant", "—");
        updateIBUVisual(null);
        return;
    }

    // --- Récupération des sélections ---
    const ham = get("select-houblons-amers");
    const har = get("select-houblons-aromes");
    const lev = getVal("select-levure");
    const fermType = getVal("select-fermentation");
    const aj = get("select-ajouts");
    const ebu = getVal("select-ebullition").split(" ")[0];
    const emp = getVal("select-empattage");
    const tf = getVal("select-temp-fermentation");
    const duree = getVal("select-duree-fermentation");
    const garde = getVal("select-garde");
    const carbo = getVal("select-carbonatation");

    // --- IBU et arômes houblons ---
    let ibu = 0;
    const usedHops = new Set();

    [...ham, ...har].forEach(h => {
        if (usedHops.has(h)) return;
        usedHops.add(h);

        const hop = hopProfiles[h];
        if (!hop) return;

        if (ham.includes(h)) ibu += hop.alpha * 1.5;
        if (har.includes(h)) ibu += hop.alpha * 0.5;

        if (hop.type !== 'amérisant' && hop.aromas)
            aromes.push(...hop.aromas);
    });

    const boilMultiplier = { "60": 1, "75": 1.1, "90": 1.2 };
    ibu *= boilMultiplier[ebu] || 1;

    // --- Levure ---
    if (/cerevisiae/i.test(lev)) abv += 1;
    else if (/pastorianus/i.test(lev)) abv += 0.5;
    else if (/Brett/i.test(lev)) {
        abv += 0.3;
        aromes.push("Funky", "Acidulé");
    }

    // --- Fermentation & empâtage ---
    if (emp.includes("Haut (67-70°C)")) abv += 0.5;
    if (tf.includes("Haute (18-24°C)")) abv += 0.3;

    if (duree === "14 jours") {
        abv += 0.3;
        aromes.push("Biscuit", "Caramel");
    }
    else if (duree === "3 jours") {
        abv -= 0.2;
        aromes.push("Fruit","Fleur");
    }

    // --- Garde & carbonatation ---
    let styleTags = [];
    if (garde === "3 mois") {
        abv += 0.2;
        aromes.push("Toffee", "Raisin", "Pain grillé");
        styleTags.push("Vieillie");
    }
    else if (garde === "3 semaines") {
        aromes.push("Fruits secs", "Caramel");
    }
    else if (garde === "1 semaine") {
        aromes.push("Léger", "Frais");
        styleTags.push("Jeune");
    }

    if (carbo === "Naturelle") {
        aromes.push("Onctueux", "Doux");
        styleTags.push("Douce");
    }
    else if (carbo === "Forcée") {
        aromes.push("Sec", "Épice");
        styleTags.push("Sèche");
    }

    // --- Limite d'alcool ---
    abv = Math.min(abv, 12);
    aromes.push(...aj);

    // --- Type & style principal ---
    let type = "Ale";
    if (/pastorianus|Lager/i.test(lev)) type = "Lager";
    else if (/Brett/i.test(lev) || fermType === "Spontanée") type = "Lambic";

    let style = "—";
    if (type === "Ale") {
        if (ibu > 50) style = "IPA";
        else if (ebc > 30) style = "Stout / Porter";
        else style = "Pale Ale";
    } else if (type === "Lager") {
        style = ebc < 15 ? "Pilsner" : "Vienna Dunkel";
    } else if (type === "Lambic") {
        style = aj.includes("Framboise") || aj.includes("Cerise") ? "Fruit Lambic" : "Gueuze";
    }

    // Ajout des tags (vieillie/jeune/douce/sèche)
    if (styleTags.length) style += " (" + styleTags.join(", ") + ")";

    // --- Affichage ---
    set("val-abv", abv.toFixed(1) + "% vol");
    set("val-ibu", ibu.toFixed(0));
    set("val-ebc", ebc.toFixed(0));
    set("val-aromes", aromes.length ? [...new Set(aromes)].join(", ") : "—");
    set("val-type", type);
    set("val-style", style);

    // --- Arôme dominant ---
    const groupedFreq = {};
    aromes.forEach(a => {
        const group = aromaGroups[a] || a;
        groupedFreq[group] = (groupedFreq[group] || 0) + 1;
    });
    const sortedGroups = Object.entries(groupedFreq).sort((a, b) => b[1] - a[1]);
    const dominant = sortedGroups.length > 0 ? sortedGroups[0][0] : "—";
    set("val-arome-dominant", dominant);

    // --- Jauges ---
    updateIBUVisual(ibu);
    updateEBCVisual(ebc);
}

function updateIBUVisual(ibu) {
    const fill = document.getElementById("ibu-fill");
    const text = document.getElementById("ibu-level-text");

    if (ibu === null) {
        fill.style.width = "0%";
        text.textContent = "—";
        return;
    }

    fill.style.width = Math.min(ibu, 120) + "%";

    text.textContent =
        ibu < 15 ? "Très faible" :
            ibu < 30 ? "Modérée" :
                ibu < 50 ? "Amère" :
                    "Très amère";
}

function updateEBCVisual(ebc) {
    const ebcFill = document.getElementById("ebc-fill");
    const ebcText = document.getElementById("ebc-level-text");

    const ebcPct = Math.min(100, (ebc / 60) * 100);
    ebcFill.style.width = `${ebcPct}%`;
    ebcFill.style.backgroundColor = getEbcColor(ebc);

    ebcText.textContent = getEbcLabel(ebc); // affiche le nom de la couleur
}

function getEbcLabel(ebc) {
    if (ebc <= 4) return "Blanche";
    if (ebc <= 8) return "Blonde";
    if (ebc <= 12) return "Dorée";
    if (ebc <= 16) return "Rousse";
    if (ebc <= 20) return "Ambrée claire";
    if (ebc <= 25) return "Ambrée";
    if (ebc <= 30) return "Ambrée foncée";
    if (ebc <= 40) return "Brune";
    if (ebc <= 50) return "Brune foncée";
    return "Noire";
}

function getEbcColor(ebc) {
    if (ebc <= 4) return "#f5f0c3";  // blanche
    if (ebc <= 8) return "#fbe29b";  // blonde
    if (ebc <= 12) return "#f5c46b"; // dorée
    if (ebc <= 16) return "#e4a148"; // rousse
    if (ebc <= 20) return "#d18e3b"; // ambrée claire
    if (ebc <= 25) return "#c97c3d"; // ambrée
    if (ebc <= 30) return "#b1622e"; // ambrée foncée
    if (ebc <= 40) return "#8b4513"; // brune
    if (ebc <= 50) return "#5a2d0c"; // brune foncée
    return "#2c1b10";                // noire
}

// === Utilitaires
function get(id) {
    return Array.from(document.getElementById(id)?.selectedOptions || []).map(o => o.value);
}
function getVal(id) {
    return document.getElementById(id)?.value || "";
}
function set(id, val) {
    document.getElementById(id).textContent = val;
}
