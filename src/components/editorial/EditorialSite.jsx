import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import CookiePreferences from "./CookiePreferences";
import RoadmapSection from "../about/RoadmapSection";
import {
  contactDetails,
  gamePillars,
  homeHighlights,
  navigationItems,
  simulatorCards,
} from "../../data/siteContent";
import "../../styles/editorial.css";
import "../../styles/editorial-simulators.css";

const assets = `${import.meta.env.BASE_URL}assets/editorial/`;
const logo = `${import.meta.env.BASE_URL}logo.png`;
const discord = contactDetails.find(({ label }) => label === "Discord");
export const editorialRoutes = [
"/simulateur/vin",
"/simulateur/vin/concevoir",
"/simulateur/vin/trouver",
"/simulateur/biere",
"/simulateur/spiritueux",
  "/",
  "/le-jeu",
  "/a-propos",
  "/contact",
  "/connexion",
  "/inscription",
  "/simulateur",
  "/mentions-legales",
  "/conditions-utilisation",
  "/confidentialite",
];
const titles = {
"/simulateur/vin":"Graphe de vinification",
"/simulateur/vin/concevoir":"Concevoir un vin",
"/simulateur/vin/trouver":"Trouver la recette",
"/simulateur/biere":"Simulateur de bière",
"/simulateur/spiritueux":"Simulateur de spiritueux",
  "/mentions-legales": "Mentions légales",
  "/conditions-utilisation": "Conditions d’utilisation",
  "/confidentialite": "Confidentialité & cookies",
  "/": "Millésime : The Mastercut",
  "/le-jeu": "Le jeu — Millésime : The Mastercut",
  "/a-propos": "À propos",
  "/contact": "Contact",
  "/connexion": "Connexion",
  "/inscription": "Demande d’accès",
  "/simulateur": "Simulateurs",
};

function ObjectArt({ name, className = "" }) {
  return (
    <svg
      className={`ce-object ${className}`}
      viewBox={name === "bottle" ? "0 0 180 380" : "0 0 190 230"}
      aria-hidden="true"
    >
      <use href={`${assets}objects.svg#${name}`} />
    </svg>
  );
}

function Chapter({ children, aside }) {
  return (
    <div className="ce-chapter flex items-center justify-between">
      <span>{children}</span>
      {aside && <span>{aside}</span>}
    </div>
  );
}

function TextLink({ to, children }) {
  return (
    <Link className="ce-text-link" to={to}>
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

function JoinStudio() {
  return (
    <section className="ce-join">
      <div className="ce-wrap ce-join-grid grid">
        <div>
          <p className="ce-label">COBALITH STUDIO / LE PROJET CONTINUE</p>
          <h2>
            Suivre
            <br />
            <em>l’aventure.</em>
          </h2>
          <a
            href={discord.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ce-solid-link"
          >
            Rejoindre la communauté<span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="ce-join-art">
          <ObjectArt name="bottle" />
          <ObjectArt name="grapes" />
          <span className="ce-label">MILLÉSIME : THE MASTERCUT</span>
        </div>
      </div>
    </section>
  );
}

/** Scoped to explicit public routes; simulator and account internals keep their existing shell. */
export function EditorialLayout({ children }) {
  const { pathname } = useLocation();
  const { isTeamMember, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const root = useRef(null);

  useEffect(() => {
    document.title = `${titles[pathname] ?? "Page introuvable"} — Cobalith Studio`;
    window.scrollTo({ top: 0, behavior: "instant" });
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = [...root.current.querySelectorAll("[data-ce-reveal]")];
    let observer;
    function configure() {
      observer?.disconnect();
      elements.forEach((el) => el.classList.remove("ce-reveal-pending"));
      if (media.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) {
              target.classList.remove("ce-reveal-pending");
              observer.unobserve(target);
            }
          }),
        { threshold: 0.08 },
      );
      elements.forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight) {
          el.classList.add("ce-reveal-pending");
          observer.observe(el);
        }
      });
    }
    configure();
    media.addEventListener("change", configure);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", configure);
    };
  }, [pathname]);

  function closeWithEscape(event) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false);
      menuButton.current?.focus();
    }
  }

  return (
    <div
      ref={root}
      className={`cobalith-editorial${pathname === "/" ? " ce-is-home" : ""}`}
      onKeyDown={closeWithEscape}
    >
      <a
        className="ce-skip"
        href="#ce-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("ce-main").focus();
        }}
      >
        Aller au contenu
      </a>
      <header className="ce-header">
        <div className="ce-header-inner flex items-center justify-between">
          <Link
            to="/"
            className="ce-brand flex items-center"
            aria-label="Cobalith Studio — Accueil"
          >
            <img src={logo} width="30" height="38" alt="" />
            <span>
              COBALITH<small>STUDIO</small>
            </span>
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="ce-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="ce-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Fermer −" : "Menu +"}
          </button>
          <nav
            id="ce-navigation"
            className={`ce-nav flex items-center${menuOpen ? " is-open" : ""}`}
            aria-label="Navigation principale"
          >
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              className="ce-account-link"
              to={isTeamMember ? "/equipe" : "/connexion"}
              onClick={() => setMenuOpen(false)}
            >
              {isTeamMember ? "Équipe" : user ? "Compte" : "Connexion"}
              <span aria-hidden="true">↗</span>
            </NavLink>
          </nav>
        </div>
      </header>
      <main id="ce-main" tabIndex={-1}>
        {pathname === "/connexion" || pathname === "/inscription" ? (
          <div className="ce-login-grid ce-wrap grid">
            <aside className="ce-login-art">
              <p className="ce-label">COBALITH STUDIO / ESPACE ÉQUIPE</p>
              <div className="ce-login-monogram" aria-hidden="true">
                C.
              </div>
              <ObjectArt name="bottle" />
              <p className="ce-login-game">
                Millésime
                <br />
                <em>The Mastercut</em>
              </p>
            </aside>
            {children ?? <Outlet />}
          </div>
        ) : (
          children ?? <Outlet />
        )}
      </main>
      <footer className="ce-footer">
        <div className="ce-wrap">
          <div className="ce-footer-links flex justify-between">
            <nav aria-label="Navigation secondaire" className="flex">
              <Link to="/le-jeu">LE JEU ↗</Link>
              <Link to="/a-propos">LE STUDIO ↗</Link>
              <Link to="/contact">CONTACT ↗</Link>
              <Link to="/connexion">CONNEXION ↗</Link>
            </nav>
            <a href={discord.href} target="_blank" rel="noopener noreferrer">
              DISCORD ↗
            </a>
          </div>
          <nav className="ce-footer-legal" aria-label="Informations légales">
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/conditions-utilisation">Conditions d’utilisation</Link>
            <Link to="/confidentialite">Confidentialité & données</Link>
            <CookiePreferences />
          </nav>
          <div className="ce-footer-small flex justify-between">
            <span>© 2025 - 2026 Cobalith Studio</span>
            <span>Millésime : The Mastercut</span>
            <span>Studio de développement indépendant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function EditorialHomePage() {
  return (
    <>
      <section className="ce-home-hero">
        <div className="ce-hero-top ce-label flex justify-between">
          <span>LE PREMIER JEU DE COBALITH STUDIO</span>
          <span>STUDIO INDÉPENDANT / FRANCE</span>
        </div>
        <div className="ce-hero-copy">
          <p className="ce-label">UN JEU DE GESTION COOP</p>
          <h1 aria-label="Millésime : The Mastercut">
            Millésime
            <span>
              <em>The Mastercut</em>
            </span>
          </h1>
          <p>
            Production, expérimentation et progression.
            <br />
            Un jeu de gestion à découvrir en solo ou en coop.
          </p>
          <TextLink to="/le-jeu">Découvrir le jeu</TextLink>
        </div>
        <img
          className="ce-hero-domaine"
          src={`${assets}domaine.svg`}
          width="1100"
          height="860"
          alt="Illustration low-poly d’un domaine entouré de vignes."
          fetchPriority="high"
        />
        <div className="ce-hero-bottom ce-label flex justify-between">
          <span>MILLÉSIME : THE MASTERCUT</span>
          <a
            href="#ce-discover"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("ce-discover").scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? "instant"
                  : "smooth",
              });
            }}
          >
            DÉCOUVRIR L’UNIVERS ↓
          </a>
          <span>EN DÉVELOPPEMENT</span>
        </div>
      </section>
      <section id="ce-discover" className="ce-section ce-wrap">
        <Chapter aside="L’EXPÉRIENCE">01 / LE JEU</Chapter>
        <div className="ce-manifest grid">
          <h2 data-ce-reveal>
            Produire.
            <br />
            Expérimenter.
            <br />
            <em>Progresser.</em>
          </h2>
          <ObjectArt name="grapes" />
          <div className="ce-manifest-copy">
            <p>{homeHighlights[0].text}</p>
            <TextLink to="/le-jeu">Explorer le projet</TextLink>
          </div>
        </div>
      </section>
      <section className="ce-feature-section ce-section">
        <div className="ce-wrap">
          <Chapter aside="SEUL OU À PLUSIEURS">
            02 / CONSTRUIRE SON ACTIVITÉ
          </Chapter>
          <div className="ce-section-heading flex justify-between">
            <h2 data-ce-reveal>
              La gestion.
              <br />
              <em>À votre façon.</em>
            </h2>
            <p>{homeHighlights[1].text}</p>
          </div>
          <div className="ce-home-bento grid">
            <figure className="ce-photo">
              <img
                src={`${assets}vineyard.webp`}
                srcSet={`${assets}vineyard-small.webp 768w, ${assets}vineyard.webp 1536w`}
                sizes="(max-width: 760px) 100vw, 65vw"
                width="1536"
                height="1024"
                alt="Visuel d’ambiance du domaine et de ses vignes."
                loading="lazy"
              />
              <figcaption>
                <span className="ce-label">MILLÉSIME : THE MASTERCUT</span>
                <h3>
                  Un univers
                  <br />
                  <em>à développer.</em>
                </h3>
              </figcaption>
            </figure>
            <article className="ce-coop-note">
              <span className="ce-label">L’EXPÉRIENCE / COOP</span>
              <h3>
                Faire grandir
                <br />
                <em>son activité.</em>
              </h3>
              <ObjectArt name="barrel" />
              <p>Production, gestion et expérimentation.</p>
            </article>
            <div className="ce-bento-bottom flex justify-between">
              <h3>
                Des recettes.
                <br />
                <em>Des décisions.</em>
              </h3>
              <p>
                Le joueur teste ses recettes et affine ses processus.
                <br />
                La progression accompagne l’expérimentation.
              </p>
              <span aria-hidden="true">↗</span>
            </div>
          </div>
        </div>
      </section>
      <section className="ce-section ce-wrap">
        <Chapter aside="DERRIÈRE LE JEU">03 / LE STUDIO</Chapter>
        <div className="ce-studio-teaser grid">
          <div>
            <h2 data-ce-reveal>
              Un studio
              <br />
              <em>indépendant.</em>
            </h2>
            <p>
              Le projet s’appuie sur la documentation, la recherche terrain et
              des échanges avec des professionnels.
            </p>
            <TextLink to="/a-propos">Le studio et sa roadmap</TextLink>
          </div>
          <figure>
            <img
              src={`${assets}cellar.webp`}
              width="1100"
              height="733"
              alt="Visuel d’ambiance de l’atelier de production."
              loading="lazy"
            />
            <figcaption className="ce-label">
              COBALITH STUDIO / MILLÉSIME : THE MASTERCUT
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="ce-simulator-teaser ce-section">
        <div className="ce-wrap flex justify-between">
          <div>
            <span className="ce-label">COMPRENDRE LES PROCÉDÉS</span>
            <h2 data-ce-reveal>
              Place à<br />
              <em>l’expérimentation.</em>
            </h2>
          </div>
          <div>
            <p>
              Vinification, brassage, spiritueux.
              <br />
              Trois modules pour explorer les logiques de production.
            </p>
            <TextLink to="/simulateur">Ouvrir les simulateurs</TextLink>
          </div>
        </div>
      </section>
      <JoinStudio />
    </>
  );
}

export function EditorialGamePage() {
  return (
    <>
      <section className="ce-game-intro ce-section ce-wrap">
        <Chapter aside="EN DÉVELOPPEMENT">01 / LE JEU</Chapter>
        <div className="ce-game-title">
          <span className="ce-label">MILLÉSIME : THE MASTERCUT</span>
          <h1>
            Construire.
            <br />
            Produire.
            <br />
            <em>Faire grandir.</em>
          </h1>
          <div className="ce-game-bottle">
            <ObjectArt name="bottle" />
            <span className="ce-label">UN JEU DE COBALITH STUDIO</span>
          </div>
        </div>
        <div className="ce-game-lead">
          <p>
            Un jeu de gestion coop où le joueur construit, vend et fait grandir
            son activité.
          </p>
          <p>
            Le projet mélange progression, expérimentation, business et
            notoriété dans un cadre plus léger qu’une simulation pure. Le but
            est de laisser une vraie marge de manœuvre au joueur tout en
            récompensant les choix les plus solides.
          </p>
        </div>
      </section>
      <section className="ce-game-production ce-section">
        <div className="ce-wrap grid">
          <figure className="ce-workshop">
            <img
              src={`${assets}cellar.webp`}
              width="1100"
              height="733"
              alt="Visuel d’ambiance : bouteilles, fûts et cuves dans l’atelier."
              loading="lazy"
            />
            <figcaption className="ce-label">
              PRODUCTION / EXPÉRIMENTATION
            </figcaption>
          </figure>
          <div>
            <span className="ce-label">02 / LES PROCÉDÉS</span>
            <h2 data-ce-reveal>
              Production
              <br />
              <em>et recettes.</em>
            </h2>
            <p>{gamePillars[0].text}</p>
            <div className="ce-process-objects flex">
              <ObjectArt name="grapes" />
              <span aria-hidden="true">→</span>
              <ObjectArt name="tank" />
              <span aria-hidden="true">→</span>
              <ObjectArt name="bottle" />
            </div>
          </div>
        </div>
      </section>
      <section className="ce-section ce-wrap">
        <Chapter aside="LES CHOIX DU JOUEUR">03 / L’ACTIVITÉ</Chapter>
        <div className="ce-business grid">
          <h2 data-ce-reveal>
            Business,
            <br />
            notoriété
            <br />
            <em>et risques.</em>
          </h2>
          <div>
            <p>{gamePillars[1].text}</p>
            <div className="ce-word-list">
              <span>Commerce</span>
              <span>Clientèle</span>
              <span>Réputation</span>
            </div>
          </div>
        </div>
      </section>
      <section className="ce-game-statement ce-section">
        <div className="ce-wrap">
          <span className="ce-label">04 / L’INTENTION</span>
          <h2 data-ce-reveal>
            Un ton léger.
            <br />
            <em>Une logique solide.</em>
          </h2>
          <p>{gamePillars[2].text}</p>
          <TextLink to="/simulateur">Explorer les simulateurs</TextLink>
        </div>
      </section>
      <JoinStudio />
    </>
  );
}

export function EditorialAboutPage() {
  return (
    <>
      <section className="ce-section ce-wrap ce-about-intro">
        <Chapter aside="COBALITH STUDIO">01 / LE STUDIO</Chapter>
        <div className="ce-about-title grid">
          <div>
            <h1>
              Indépendant.
              <br />
              <em>Par conviction.</em>
            </h1>
            <p>
              Cobalith Studio est un jeune studio indépendant qui construit un
              jeu de gestion coop : <strong>Millésime : The Mastercut</strong>.
            </p>
          </div>
          <div className="ce-studio-mark">
            <img
              src={logo}
              width="260"
              height="260"
              alt="Emblème de Cobalith Studio"
            />
            <span className="ce-label">COBALITH / STUDIO INDÉPENDANT</span>
          </div>
        </div>
        <div className="ce-about-copy grid">
          <span className="ce-label">LE FOND AVANT TOUT</span>
          <div>
            <p>
              Le projet avance avec une logique simple : poser des bases
              claires, travailler sérieusement le fond, et faire monter le
              niveau du jeu sans perdre son accessibilité ni son potentiel de
              fun à plusieurs.
            </p>
            <p>
              Une partie importante du travail passe par la documentation, la
              recherche terrain et des échanges avec des professionnels afin de
              garder des systèmes lisibles, inspirés du réel et suffisamment
              solides pour soutenir la boucle de jeu.
            </p>
            <p>
              L’objectif n’est pas seulement d’empiler des fonctionnalités, mais
              de construire un projet qui gagne en crédibilité, en identité et
              en impact à mesure qu’il avance.
            </p>
          </div>
        </div>
      </section>
      <section className="ce-roadmap-section ce-section">
        <div className="ce-wrap">
          <Chapter aside="HISTORIQUE & PRÉVISIONS">02 / LA ROADMAP</Chapter>
          <div className="ce-section-heading flex justify-between">
            <h2 data-ce-reveal>
              Une vision.
              <br />
              <em>Des étapes.</em>
            </h2>
            <p>
              La roadmap réunit l’historique du projet et sa projection
              prévisionnelle jusqu’à la sortie. Les échéances futures sont des
              objectifs de développement.
            </p>
          </div>
          <RoadmapSection />
        </div>
      </section>
      <JoinStudio />
    </>
  );
}

export function EditorialContactPage() {
  return (
    <section className="ce-contact ce-section ce-wrap">
      <Chapter aside="COBALITH STUDIO">CONTACT / SUIVRE LE PROJET</Chapter>
      <div className="ce-contact-top grid">
        <div>
          <h1>
            Parlons
            <br />
            <em>du projet.</em>
          </h1>
          <p>
            Le projet est encore en développement.
            <br />
            Pour suivre son évolution ou entrer en contact avec le studio.
          </p>
        </div>
        <div className="ce-contact-art">
          <ObjectArt name="grapes" />
          <span className="ce-label">MILLÉSIME : THE MASTERCUT</span>
        </div>
      </div>
      <div className="ce-contact-grid grid">
        <div className="ce-contact-links">
          {contactDetails.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                item.href.startsWith("mailto:")
                  ? undefined
                  : "noopener noreferrer"
              }
            >
              <span className="ce-label">
                0{index + 1} / {item.label}
              </span>
              <span>{item.value}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <aside className="ce-legal">
          <span className="ce-label">INFORMATIONS LÉGALES</span>
          <h2>
            Cobalith
            <br />
            <em>Studio.</em>
          </h2>
          <p>Studio de développement indépendant.</p>
          <TextLink to="/mentions-legales">Mentions légales</TextLink>
        </aside>
      </div>
    </section>
  );
}

export function EditorialSimulatorHubPage() {
  const illustrations = ["bottle", "barrel", "tank"];
  return (
    <>
      <section className="ce-section ce-wrap ce-sim-intro">
        <Chapter aside="VIN / BIÈRE / SPIRITUEUX">LES SIMULATEURS</Chapter>
        <div className="ce-sim-heading grid">
          <div>
            <h1>
              Comprendre
              <br />
              <em>les procédés.</em>
            </h1>
            <p>
              Choisissez un module de simulation pour explorer les ingrédients,
              les étapes et les choix de production.
            </p>
          </div>
          <ObjectArt name="press" />
        </div>
        <div className="ce-module-list">
          {simulatorCards.map((item, index) => (
            <Link
              to={item.href}
              key={item.href}
              className={`ce-module ce-module-${index} grid`}
            >
              <span className="ce-module-index">0{index + 1}</span>
              <ObjectArt name={illustrations[index]} />
              <div>
                <span className="ce-label">MODULE / SIMULATION</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <span className="ce-module-open">
                Ouvrir le simulateur <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="ce-sim-note ce-wrap">
        <span className="ce-label">COBALITH STUDIO</span>
        <p>
          Des outils pour explorer les logiques de production
          <br />
          qui nourrissent le projet.
        </p>
        <TextLink to="/le-jeu">Découvrir Millésime : The Mastercut</TextLink>
      </section>
    </>
  );
}
