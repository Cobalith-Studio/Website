import { Link } from "react-router-dom";
import WineSimulator from "../components/simulators/WineSimulator";
import SectionHeading from "../components/ui/SectionHeading";

export default function WineSimulatorPage() {
  return (
    <section className="section page-intro">
      <SectionHeading
        kicker="Vin"
        title="Simulateur de vinification en graphe décisionnel"
        text="Le graphe reste l'entrée principale pour lire toute la logique. Deux systèmes complémentaires permettent ensuite soit de construire une recette unique, soit de chercher des recettes à partir d'un profil final cible."
      />
      <div className="section-actions wine-page-actions">
        <Link className="button button-secondary" to="/simulateur/vin/concevoir">Concevoir un vin</Link>
        <Link className="button button-secondary" to="/simulateur/vin/trouver">Trouver la recette</Link>
      </div>
      <WineSimulator />
    </section>
  );
}
