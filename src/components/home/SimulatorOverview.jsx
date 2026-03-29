import { Link } from "react-router-dom";
import { simulatorCards } from "../../data/siteContent";
import SectionHeading from "../ui/SectionHeading";

export default function SimulatorOverview() {
  return (
    <section className="section">
      <SectionHeading
        kicker="Simulateurs"
        title="Des prototypes jouables pour montrer les logiques qui nourrissent le projet"
        text="Ces modules ne représentent pas encore le jeu final, mais ils permettent déjà d'explorer une partie des systèmes, des choix et du travail de recherche derrière l'univers."
      />
      <div className="card-grid three-up">
        {simulatorCards.map((item) => (
          <Link className={`simulator-card accent-${item.accent}`} key={item.href} to={item.href}>
            <span className="simulator-badge">Prototype</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
