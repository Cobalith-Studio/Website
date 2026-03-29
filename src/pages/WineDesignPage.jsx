import { Link } from "react-router-dom";
import WineDesignSimulator from "../components/simulators/WineDesignSimulator";
import SectionHeading from "../components/ui/SectionHeading";

export default function WineDesignPage() {
  return (
    <section className="section page-intro">
      <SectionHeading
        kicker="Vin"
        title="Concevoir un vin"
        text="Simulation directe d'une recette unique de vinification, avec toutes les étapes dans leur ordre logique et un résultat final complet."
      />
      <div className="section-actions wine-page-actions">
        <Link className="button button-secondary" to="/simulateur/vin">Retour au graphe</Link>
        <Link className="button button-secondary" to="/simulateur/vin/trouver">Trouver la recette</Link>
      </div>
      <WineDesignSimulator />
    </section>
  );
}
