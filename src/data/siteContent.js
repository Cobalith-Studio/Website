export const navigationItems = [
  { to: "/", label: "Accueil" },
  { to: "/le-jeu", label: "Le jeu" },
  { to: "/simulateur", label: "Simulateurs" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" }
];

export const homeHighlights = [
  {
    eyebrow: "Gestion",
    title: "Un business game libre et lisible",
    text: "Le coeur du projet mélange production, gestion, expérimentation et progression dans un format accessible, sans tomber dans le simulateur rigide."
  },
  {
    eyebrow: "Coop",
    title: "Une vraie expérience à plusieurs",
    text: "Le jeu est pensé pour fonctionner en solo comme en coop, avec assez de profondeur pour construire sérieusement et assez de souplesse pour jouer entre amis sans se prendre la tête."
  },
  {
    eyebrow: "Roadmap",
    title: "Un cap clair jusqu'à la sortie",
    text: "Page Steam visée début 2027, démo publique fin 2027, puis sortie officielle au printemps 2028 selon la feuille de route actuelle."
  }
];

export const gamePillars = [
  {
    title: "Production et recettes",
    text: "Le joueur débloque des matières premières, teste des recettes, affine ses processus et cherche le bon équilibre entre liberté de création, qualité et performance."
  },
  {
    title: "Business, notoriété et risques",
    text: "Développer son activité, viser une clientèle, gérer la concurrence, répondre à la demande, faire du commerce et naviguer dans un univers plus trouble font partie de la boucle de jeu."
  },
  {
    title: "Un ton léger, une logique solide",
    text: "Le projet reste accessible et amusant, mais s'appuie sur des systèmes cohérents et des références réelles pour récompenser les productions les plus convaincantes."
  }
];

export const showcaseCards = [
  {
    title: "Recettes, variétés et outils",
    text: "Le plaisir vient autant de la liberté offerte au joueur que de la satisfaction de maîtriser des recettes plus fines, des équipements plus poussés et des matières premières plus rares.",
    image: "/recettes.png"
  },
  {
    title: "Un tycoon social et vivant",
    text: "Commerce, demande, offre, prestige, clientèle, concurrence et prise de notoriété donnent au jeu une dimension business claire, avec assez de friction pour créer des choix intéressants.",
    image: "/gestion.png"
  },
  {
    title: "Une base documentaire sérieuse",
    text: "Le projet s'appuie sur une recherche terrain réelle : rencontres, visites, documentation technique et échanges avec des professionnels pour garder une base crédible sans perdre le fun.",
    image: "/simulateur-demo.png"
  }
];

export const simulatorCards = [
  {
    title: "Vinification",
    description: "Un module pour explorer les étapes, les choix de production et leurs effets sur le profil final.",
    href: "/simulateur/vin",
    accent: "graph"
  },
  {
    title: "Brassage",
    description: "Une lecture plus concrète des ingrédients, de l'équilibre et des décisions qui structurent une bière.",
    href: "/simulateur/biere",
    accent: "brew"
  },
  {
    title: "Spiritueux",
    description: "Un aperçu des logiques de base, de distillation, d'aromatisation et d'élevage qui nourrissent le projet.",
    href: "/simulateur/spiritueux",
    accent: "spirit"
  }
];

export const contactDetails = [
  { label: "Email", value: "contact@cobalithstudio.fr", href: "mailto:contact@cobalithstudio.fr" },
  { label: "LinkedIn", value: "linkedin.com/company/cobalith-studio", href: "https://www.linkedin.com/company/cobalith-studio" },
  { label: "Instagram", value: "@cobalithstudio", href: "https://instagram.com/cobalithstudio" },
  { label: "Discord", value: "discord.gg/yKXXXunr", href: "https://discord.gg/yKXXXunr" }
];

export const legalDetails = [
  "SIRET 945 406 965 00018",
  "91160 Longjumeau, France",
  "© 2026 Cobalith Studio"
];

export const aboutRoadmap = [
  {
    id: "project-origin",
    actualDate: "2025-05-30",
    date: "Mai 2025",
    title: "Naissance du projet",
    text: "Le concept du business game coop émergence avec une thématique gestion, production et expérimentation.",
    detail: "Base posée",
    status: "done",
    accent: "mint"
  },
  {
    id: "field-research",
    actualDate: "2025-06-15",
    date: "Juin 2025",
    title: "Recherche terrain",
    text: "Rencontres en distilleries et brasseries, échanges avec professionnels et enseignants spécialisés en fermentation.",
    detail: "Observation réelle",
    status: "done",
    accent: "gold"
  },
  {
    id: "system-foundations",
    actualDate: "2025-08-15",
    date: "Été 2025",
    title: "Fondations des systèmes",
    text: "Début des simulateurs et structuration des bases du gameplay en traduisant les processus réels en logique de jeu.",
    detail: "Premiers systèmes",
    status: "done",
    accent: "copper"
  },
  {
    id: "core-development",
    actualDate: "2026-03-15",
    date: "Début 2026",
    title: "Développement cœur (vin)",
    text: "Implémentation des systèmes clefs : inventaire, interactions, progression, commerce et vinification.",
    detail: "Production fonctionnelle",
    status: "done",
    accent: "mint"
  },
  {
    id: "process-refinement",
    actualDate: "2026-09-01",
    date: "Fin 2026",
    title: "Affinage des processus",
    text: "Précision des étapes, enrichissement des mécaniques et amélioration globale de la logique de production du vin.",
    detail: "Approfondissement",
    status: "planned",
    accent: "gold"
  },
  {
    id: "first-playable",
    actualDate: "2027-03-01",
    date: "Début 2027",
    title: "Première version jouable",
    text: "Intégration des premiers visuels, d'une map cohérente et validation d’un gameplay complet fonctionnel.",
    detail: "Prototype jouable",
    status: "planned",
    accent: "copper"
  },
  {
    id: "company-creation",
    actualDate: "2027-05-01",
    date: "Printemps 2027",
    title: "Création du studio",
    text: "Structuration officielle du projet avec la création d’une société pour encadrer le développement et la publication.",
    detail: "SASU",
    status: "planned",
    accent: "mint"
  },
  {
    id: "steam-page",
    actualDate: "2027-06-01",
    date: "Mi 2027",
    title: "Page Steam en ligne",
    text: "Première vitrine publique avec visuels et vidéos pour commencer à accumuler visibilité et wishlists.",
    detail: "Visibilité",
    status: "planned",
    accent: "gold"
  },
  {
    id: "global-expansion",
    actualDate: "2027-11-15",
    date: "Fin 2027",
    title: "Extension du jeu",
    text: "Finalisation du vin et intégration des systèmes bière et spiritueux avec équilibrage global du gameplay.",
    detail: "Contenu élargi",
    status: "planned",
    accent: "copper"
  },
  {
    id: "public-demo",
    actualDate: "2027-12-15",
    date: "Hiver 2027",
    title: "Démo publique",
    text: "Première version jouable diffusée pour tester l’expérience complète et recueillir des retours.",
    detail: "Validation terrain",
    status: "planned",
    accent: "mint"
  },
  {
    id: "feedback-iteration",
    actualDate: "2028-01-01",
    date: "Début 2028",
    title: "Corrections et ajustements",
    text: "Analyse des retours joueurs, correction des bugs et ajustements du gameplay pour stabiliser l’expérience avant sortie.",
    detail: "Polish final",
    status: "planned",
    accent: "gold"
  },
  {
    id: "official-release",
    actualDate: "2028-03-15",
    date: "Printemps 2028",
    title: "Sortie officielle",
    text: "Lancement complet du jeu avec un niveau de finition aligné avec l’ambition du projet.",
    detail: "Release",
    status: "planned",
    accent: "gold"
  }
];
