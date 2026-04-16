import { homeHighlights } from "../../data/siteContent";
import SectionHeading from "../ui/SectionHeading";

export default function HighlightGrid() {
  return (
    <section className="section section--first" id="home-vision">
      <SectionHeading
        kicker="Vision"
        title="Un jeu de gestion qui mise sur la liberté, la progression et le plaisir de jouer ensemble"
        text="Le projet cherche un bon équilibre entre profondeur, accessibilité et rejouabilité. Le but n'est pas de copier la réalité à la lettre, mais de construire un système crédible, lisible et fun."
      />
      <div className="card-grid three-up">
        {homeHighlights.map((item) => (
          <article className="info-card" key={item.title}>
            <p className="card-kicker">{item.eyebrow}</p>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
