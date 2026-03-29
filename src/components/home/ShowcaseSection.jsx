import { Link } from "react-router-dom";
import { showcaseCards } from "../../data/siteContent";
import SectionHeading from "../ui/SectionHeading";

export default function ShowcaseSection() {
  return (
    <section className="section section-muted">
      <SectionHeading
        kicker="Le jeu"
        title="Un projet pensé comme une vraie boucle de production et de notoriété"
        text="Le joueur développe son activité, découvre de nouvelles possibilités, construit ses recettes et cherche à vendre mieux, plus loin et à une clientèle choisie."
      />
      <div className="showcase-grid">
        {showcaseCards.map((card) => (
          <article className="showcase-card" key={card.title}>
            <img src={card.image} alt={card.title} />
            <div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="section-actions showcase-actions">
        <Link className="button button-primary" to="/le-jeu">
          Approfondir la vision du jeu
        </Link>
      </div>
    </section>
  );
}
