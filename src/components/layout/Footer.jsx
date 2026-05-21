import { ExternalLink, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const navigationLinks = [
  { to: "/", label: "Accueil" },
  { to: "/le-jeu", label: "Le Jeu" },
  { to: "/simulateur", label: "Simulateur" },
  { to: "/a-propos", label: "À propos" }
];

const communityLinks = [
  { href: "https://discord.gg/yKXXXunr", label: "Discord" },
  { href: "https://instagram.com/cobalithstudio", label: "Instagram" },
  { href: "https://www.linkedin.com/company/cobalith-studio", label: "LinkedIn" }
];

export default function Footer() {
  return (
    <footer className="cobalith-footer" aria-label="Pied de page">
      <div className="cobalith-footer-inner">
        <div className="cobalith-footer-grid">
          <section className="cobalith-footer-brand-block">
            <Link
              to="/"
              className="cobalith-footer-brand"
              aria-label="Retour à l'accueil Cobalith Studio"
            >
              <img className="cobalith-footer-logo" src="/logo.png" alt="" aria-hidden="true" />
              <span>Cobalith Studio</span>
            </Link>
            <p className="cobalith-footer-description">
              Studio indépendant français dédié à la création de jeux vidéo originaux et immersifs.
            </p>
          </section>

          <nav className="cobalith-footer-section" aria-label="Navigation du pied de page">
            <h2>Navigation</h2>
            <div className="cobalith-footer-link-list">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="cobalith-footer-link"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav className="cobalith-footer-section" aria-label="Liens communauté">
            <h2>Communauté</h2>
            <div className="cobalith-footer-link-list">
              {communityLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cobalith-footer-link cobalith-footer-external-link"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="cobalith-footer-small-icon" strokeWidth={2} aria-hidden="true" />
                </a>
              ))}
            </div>
          </nav>

          <section className="cobalith-footer-section">
            <h2>Contact</h2>
            <a
              href="mailto:contact@cobalithstudio.fr"
              className="cobalith-footer-link cobalith-footer-contact-link"
            >
              <Mail className="cobalith-footer-contact-icon" strokeWidth={2} aria-hidden="true" />
              <span>contact@cobalithstudio.fr</span>
            </a>
          </section>
        </div>

        <div className="cobalith-footer-bottom">
          <p>© 2026 Cobalith Studio — Association loi 1901 — SIRET 945 406 965 00018</p>
          <p>91160 Longjumeau, France</p>
        </div>
      </div>
    </footer>
  );
}
