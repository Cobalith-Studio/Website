import { DAYS, SERVICES } from "./scheduleTypes";
import { normalizeSchedule } from "./scheduleUtils";

export const CHATGPT_SCHEDULE_PROMPT = `Tu dois lire cette image de planning de service restaurant et me rendre UNIQUEMENT un JSON valide, sans markdown, sans explication.

Structure du planning:
- colonnes: lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche;
- lignes: une personne par ligne, nom/prenom dans la colonne de gauche;
- chaque jour contient deux services: midi et soir;
- REP signifie repos;
- entre parentheses, par exemple (r11.00 11.30), c'est la pause pendant le service;
- si une information est absente, floue ou incertaine, mets exactement "UNDETECTED".
- ne refuse pas de faire l'extraction globale si certaines cases sont difficiles: marque uniquement les cases difficiles en UNDETECTED;
- certaines pauses peuvent sembler incoherentes avec le service, mais si elles sont ecrites ainsi sur le planning, recopie-les telles quelles;
- lis le tableau ligne par ligne: nom du serveur, puis lundi a dimanche, midi puis soir;
- les noms proches de la colonne gauche doivent etre repris tels qu'ils apparaissent, sans inventer de personne.

Format JSON exact attendu:
{
  "weekLabel": "Semaine du JJ/MM au JJ/MM",
  "people": [
    {
      "name": "NOM Prenom",
      "days": {
        "monday": {
          "lunch": { "status": "work", "start": "11:00", "end": "15:30", "breakStart": "11:00", "breakEnd": "11:30" },
          "dinner": { "status": "rest" }
        },
        "tuesday": {
          "lunch": { "status": "unknown", "value": "UNDETECTED" },
          "dinner": { "status": "work", "start": "18:00", "end": "23:00", "breakStart": "18:30", "breakEnd": "19:00" }
        },
        "wednesday": { "lunch": { "status": "rest" }, "dinner": { "status": "rest" } },
        "thursday": { "lunch": { "status": "rest" }, "dinner": { "status": "rest" } },
        "friday": { "lunch": { "status": "rest" }, "dinner": { "status": "rest" } },
        "saturday": { "lunch": { "status": "rest" }, "dinner": { "status": "rest" } },
        "sunday": { "lunch": { "status": "rest" }, "dinner": { "status": "rest" } }
      }
    }
  ]
}

Regles obligatoires:
- N'invente aucun nom.
- Garde tous les serveurs visibles.
- Normalise les heures en HH:mm.
- Pour un service travaille, status = "work" et start/end sont obligatoires.
- Pour un repos, status = "rest".
- Si doute: status = "unknown", value = "UNDETECTED".
- Tous les jours doivent exister pour chaque personne.
- Chaque jour doit contenir lunch et dinner.
- Si une seule partie d'un service est illisible, mets tout le service en UNDETECTED plutot que d'inventer.
- Si la pause est absente mais le service est lisible, garde le service work avec start/end et omets breakStart/breakEnd.
- Avant de produire le JSON, verifie mentalement que chaque personne a bien 7 jours et 14 services.
- Retourne uniquement le JSON.`;

export function createBlankSchedule() {
  return normalizeSchedule({
    weekLabel: "Semaine a completer",
    source: "manual",
    people: []
  });
}

export function parseScheduleTextImport(input) {
  const text = String(input || "").trim();
  if (!text) {
    throw new Error("Colle le JSON genere par ChatGPT avant d'importer.");
  }

  const jsonText = extractJson(text);
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Le texte colle n'est pas un JSON valide. Redemande a ChatGPT de retourner uniquement le JSON.");
  }

  const people = Array.isArray(parsed.people) ? parsed.people : [];
  if (!people.length) {
    throw new Error("Aucun serveur trouve dans le JSON.");
  }

  return normalizeSchedule({
    weekLabel: parsed.weekLabel || "Semaine importee",
    source: "text-import",
    people: people.map((person, index) => ({
      id: slugify(person.name || `person-${index + 1}`),
      name: person.name || `Personne ${index + 1}`,
      role: "SERVEUR",
      days: normalizeImportedDays(person.days || {})
    }))
  });
}

function normalizeImportedDays(days) {
  return DAYS.reduce((acc, day) => {
    const sourceDay = days[day.key] || {};
    acc[day.key] = SERVICES.reduce((serviceAcc, service) => {
      serviceAcc[service.key] = normalizeImportedService(sourceDay[service.key]);
      return serviceAcc;
    }, {});
    return acc;
  }, {});
}

function normalizeImportedService(service) {
  if (!service || service.status === "unknown" || service.value === "UNDETECTED") {
    return {
      value: "",
      status: "unknown",
      confidence: 0,
      needsReview: true
    };
  }

  if (service.status === "rest") {
    return {
      value: "Repos",
      status: "rest",
      confidence: 1,
      needsReview: false
    };
  }

  if (service.status === "work" && service.start && service.end) {
    const pause = service.breakStart && service.breakEnd ? ` (pause ${service.breakStart}-${service.breakEnd})` : "";
    return {
      value: `${service.start}-${service.end}${pause}`,
      status: "work",
      start: service.start,
      end: service.end,
      breakStart: service.breakStart || "",
      breakEnd: service.breakEnd || "",
      confidence: 1,
      needsReview: false
    };
  }

  return {
    value: "",
    status: "unknown",
    confidence: 0,
    needsReview: true
  };
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
