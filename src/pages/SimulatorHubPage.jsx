import { Link } from "react-router-dom";
import { simulatorCards } from "../data/siteContent";
import SectionHeading from "../components/ui/SectionHeading";

export default function SimulatorHubPage() {
  return (
    <section className="section page-intro">
      <SectionHeading
        kicker="Hub"
        title="Choisis un module de simulation"
        text="Chaque simulateur a maintenant sa page, sa logique métier et son rendu propre."
      />
      <div className="card-grid three-up">
        {simulatorCards.map((item) => (
          <Link key={item.href} to={item.href} className={`simulator-card accent-${item.accent}`}>
            <span className="simulator-badge">Accéder</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
