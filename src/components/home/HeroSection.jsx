import { Link } from "react-router-dom";

export default function HeroSection() {
  const heroTitleLines = [
    "Un tycoon coop",
    "plus vivant, ",
    "plus libre,",
    "plus riche."
  ];

  return (
    <section className="hero hero-immersive">
      <div className="hero-immersive-media" aria-hidden="true">
        <img src="/banniere-hero.png?v=2026-04-16-1253" alt="" />
      </div>

      <div className="hero-immersive-content">
        <div className="hero-immersive-copy hero-immersive-copy--surface">
          <p className="hero-kicker hero-kicker--hero">Jeune studio independant</p>
          <h1>
            {heroTitleLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < heroTitleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>
          <p className="hero-lead">
            Production, experimentation et progression dans une entree de site plus epuree, avec le contenu detaille reporte apres le scroll.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="https://discord.gg/yKXXXunr" target="_blank" rel="noreferrer">
              Suivre le projet
            </a>
            <Link className="button button-secondary" to="/le-jeu">
              Decouvrir le jeu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
