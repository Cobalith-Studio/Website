// === Fonction pour remplir un select proprement ===
function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = "";

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "";
    empty.disabled = true;
    empty.selected = true;
    empty.hidden = true;
    select.appendChild(empty);

    options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        select.appendChild(o);
    });

    new Choices(select, {
        searchEnabled: false,
        itemSelectText: '',
        shouldSort: false,
        allowHTML: false,
        placeholder: true,
        placeholderValue: "",
        allowEmpty: true
    });
}

// === Initialisation DOM ===
document.addEventListener("DOMContentLoaded", () => {
    // Matière de départ
    populateSelect("select-matiere", ["Mout", "Alcool surfin", "Mélasse", "Jus de canne"]);
    const cereales = ["Blé", "Maïs", "Seigle"];
    populateSelect("select-mout1", ["Orge maltée", ...cereales]);
    populateSelect("select-mout2", ["Aucune", ...cereales]);

    // Fermentation
    populateSelect("select-levure", ["S. cerevisiae", "Levure indigène", "Spontanée"]);
    populateSelect("select-temp-fermentation", ["20°C", "25°C", "30°C", "35°C"]);
    populateSelect("select-duree-fermentation", ["24h", "48h", "72h", "1 semaine"]);

    // Aromatisation
    populateSelect("select-aromes-oui-non", ["Non", "Oui"]);
    populateSelect("select-aromate-tech", ["Macération", "Infusion liquide", "Infusion vapeur"]);
    populateSelect("select-aromes", [
        "Genièvre", "Coriandre", "Angélique", "Écorce d’orange",
        "Cardamome", "Réglisse", "Lavande", "Poivre rose", "Concombre", "Thé vert"
    ]);

    // Distillation
    populateSelect("select-alambic", ["Colonne", "Repasse"]);
    populateSelect("select-passe1", ["Pot Still", "Bain-Marie"]);
    populateSelect("select-passe2", ["Aucun", "Pot Still", "Bain-Marie"]);

    // Élevage
    populateSelect("select-dilution", ["37.5", "40.0", "45.0", "47.5", "50.0", "55.0", "60.0"]);
    populateSelect("select-vieillissement", ["Aucun", "6 mois", "1 an", "2 ans", "3 ans", "5 ans", "10 ans"]);
    populateSelect("select-fut", ["Inox", "Fût de chêne", "Fût de bourbon", "Fût de xérès"]);
    populateSelect("select-sucre", ["Aucun", "Léger", "Modéré", "Important"]);
    populateSelect("select-filtration", ["Aucun", "Charbon actif", "Filtration à froid", "Toile fine"]);

    setupDynamicBehaviors();
    setupResultComputation();
});

// === Affichage conditionnel ===
function setupDynamicBehaviors() {
    const matiere = document.getElementById("select-matiere");
    const moutChoixBloc = document.getElementById("bloc-mout-choix");
    const fermentationBloc = document.getElementById("bloc-fermentation");
    const aromBloc = document.getElementById("bloc-aromatisation");
    const aromYN = document.getElementById("select-aromes-oui-non");
    const aromDetail = document.getElementById("bloc-aromes-detail");
    const alambic = document.getElementById("select-alambic");
    const passe2 = document.getElementById("select-passe2");
    const passesBloc = document.getElementById("bloc-distillation-passes");
    const vieillissement = document.getElementById("select-vieillissement");
    const blocFut = document.getElementById("bloc-fut");

    function updateMatiere() {
        const val = matiere.value;
        const isMout = val === "Mout";
        const isAlcool = val === "Alcool surfin";

        moutChoixBloc.style.display = isMout ? "block" : "none";
        fermentationBloc.style.display = isMout ? "block" : "none";
        aromBloc.style.display = isAlcool ? "block" : "none";

        passe2.disabled = isAlcool;
        if (isAlcool) passe2.value = "Aucun";

        passesBloc.style.display = alambic.value === "Repasse" ? "block" : "none";
    }

    matiere.addEventListener("change", updateMatiere);
    alambic.addEventListener("change", updateMatiere);

    aromYN.addEventListener("change", () => {
        aromDetail.style.display = (aromYN.value === "Oui") ? "block" : "none";
    });

    vieillissement.addEventListener("change", () => {
        blocFut.style.display = (vieillissement.value !== "Aucun") ? "block" : "none";
    });

    updateMatiere(); // Initialisation à l'ouverture
}

// === Calcul du résultat final ===
function setupResultComputation() {
    const inputs = document.querySelectorAll("select");
    inputs.forEach(select => {
        select.addEventListener("change", computeResult);
    });

    function computeResult() {
        const matiere = document.getElementById("select-matiere").value;
        const mout1 = document.getElementById("select-mout1").value;
        const mout2 = document.getElementById("select-mout2").value;
        const aromesOuiNon = document.getElementById("select-aromes-oui-non").value;
        const aromes = Array.from(document.getElementById("select-aromes").selectedOptions).map(opt => opt.value);
        const dilution = parseFloat(document.getElementById("select-dilution").value || 0);
        const sucre = document.getElementById("select-sucre").value;
        const fut = document.getElementById("select-fut").value;
        const vieillissement = document.getElementById("select-vieillissement").value;
        const aromTech = document.getElementById("select-aromate-tech").value;

        // === TYPE (conforme aux règlements UE 2019/787) ===
        let type = "—";
        let style = "—";
        const ageOk = ["3 ans", "5 ans", "10 ans"].includes(vieillissement);

        if (matiere === "Mout") {
            const ageOk = ["3 ans","5 ans","10 ans"].includes(vieillissement);
            const isOnlyMalt = mout1 === "Orge maltée" && mout2 === "Aucune";
            const isMelangeMalt = mout1 === "Orge maltée" && mout2 !== "Aucune";
            const isAutreCereale = mout1 !== "Orge maltée";

            if (isOnlyMalt) {
                if (ageOk) {
                    type = "Whisky";
                    style = "Single Malt";
                } else {
                    type = "Eau-de-vie de malt";
                    style = "Jeune distillat";
                }
            } else if (isMelangeMalt && ageOk) {
                type = "Whisky";
                style = "Blended";
            } else if (isAutreCereale && ageOk) {
                type = "Whisky";
                style = "Grain Whisky";
            } else if (isAutreCereale && !ageOk) {
                type = "Eau-de-vie de céréales";
                style = "New make de grain";
            } else {
                type = "Boisson spiritueuse de céréales";
                style = "—";
            }
        } else if (matiere === "Mélasse") {
            type = "Rhum industriel";
            if (ageOk) style = "Rhum vieux";
            else style = "Rhum blanc ou ambré";
        } else if (matiere === "Jus de canne") {
            type = "Rhum agricole";
            if (ageOk) style = "Rhum vieux agricole";
            else style = "Rhum blanc agricole";
        } else if (matiere === "Alcool surfin") {
            if (aromesOuiNon === "Oui") {
                if (aromes.includes("Genièvre")) {
                    type = "Gin";
                    style = "Gin aromatique";
                    if (aromTech === "Infusion vapeur" && dilution >= 70) {
                        style = "London Dry Gin";
                    } else if (aromTech === "Infusion vapeur") {
                        style = "Distilled Gin";
                    }
                } else {
                    type = "Vodka aromatisée";
                }
            } else {
                type = "Vodka neutre";
                style = "Filtrée au charbon";
            }
        }

        // === SUCRE (et dénominations liqueurs/crèmes) ===
        let sucreText = "—";
        if (sucre === "Aucun") sucreText = "0 g/L (sec)";
        else if (sucre === "Léger") sucreText = "10–30 g/L";
        else if (sucre === "Modéré") sucreText = "30–80 g/L";
        else if (sucre === "Important") sucreText = ">100 g/L";

        if (sucre === "Important") {
            if (matiere === "Alcool surfin" && aromesOuiNon === "Oui") {
                type = "Liqueur";
                style = "Aromatisée aux plantes";
            } else if (aromes.length > 0) {
                type = "Liqueur de " + aromes[0];
            }
        }

        if (sucre === "Important" && dilution < 30) {
            style = "Crème";
        }

        // === ALCOL ===
        const alcool = dilution ? dilution.toFixed(1) : "—";

        // === COULEUR ===
        let couleur = "Transparent";
        if (fut.includes("bourbon")) couleur = "Doré ambré";
        else if (fut.includes("xérès")) couleur = "Acajou";
        else if (fut.includes("chêne")) couleur = "Or soutenu";
        else if (fut && fut !== "Inox") couleur = "Ambré";

        if (vieillissement === "5 ans") couleur += " profond";
        else if (vieillissement === "10 ans") couleur += " foncé";

        if (aromesOuiNon === "Oui" && type !== "Gin" && type !== "Vodka aromatisée") {
            couleur = "Infusé / Teinté";
        }

        // === ARÔMES (description sensorielle simple) ===
        const aromesText = aromes.length > 0 ? aromes.join(", ") : "—";

        // === Affichage final ===
        document.getElementById("val-type").textContent = type;
        document.getElementById("val-style").textContent = style;
        document.getElementById("val-alcool").textContent = alcool;
        document.getElementById("val-sucre").textContent = sucreText;
        document.getElementById("val-couleur").textContent = couleur;
        document.getElementById("val-aromes").textContent = aromesText;
    }
}
