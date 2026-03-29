import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="hero">
      <img className="hero-image" src="/banniere-hero.png" alt="Vignoble au coucher du soleil" />
      <div className="hero-copy">
        <p className="hero-kicker">Jeune studio indépendant</p>
        <h1 className="hero-title--compact">Un business game coop autour de la production d'alcool, entre gestion, expérimentation et progression.</h1>
        <p>
          Cobalith Studio développe un jeu de gestion plus libre, plus vivant et plus social qu'un simple simulateur.
          L'objectif est de laisser de la place aux essais, aux stratégies, au chaos entre amis et aux productions bien construites qui performent vraiment en jeu.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="https://discord.gg/yKXXXunr" target="_blank" rel="noreferrer">
            Suivre le projet
          </a>
          <Link className="button button-secondary" to="/le-jeu">
            Voir le jeu
          </Link>
          <Link className="button button-secondary" to="/simulateur">
            Explorer les simulateurs
          </Link>
        </div>
      </div>
    </section>
  );
}
