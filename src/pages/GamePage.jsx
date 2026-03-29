import { gamePillars } from "../data/siteContent";
import SectionHeading from "../components/ui/SectionHeading";

export default function GamePage() {
  return (
    <section className="section page-intro">
      <SectionHeading
        kicker="Le jeu"
        title="Un jeu de gestion coop où le joueur construit, vend et fait grandir son activité"
        text="Le projet mélange progression, expérimentation, business et notoriété dans un cadre plus léger qu'une simulation pure. Le but est de laisser une vraie marge de manoeuvre au joueur tout en récompensant les choix les plus solides."
      />
      <div className="card-grid three-up">
        {gamePillars.map((item) => (
          <article className="info-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
