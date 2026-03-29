import { Link } from "react-router-dom";
import WineRecipeFinder from "../components/simulators/WineRecipeFinder";
import SectionHeading from "../components/ui/SectionHeading";

export default function WineRecipeFinderPage() {
  return (
    <section className="section page-intro">
      <SectionHeading
        kicker="Vin"
        title="Trouver la recette"
        text="Partir du vin final souhaité, laisser certains critères ouverts, puis laisser le moteur proposer les chemins de vinification les plus proches."
      />
      <div className="section-actions wine-page-actions">
        <Link className="button button-secondary" to="/simulateur/vin">Retour au graphe</Link>
        <Link className="button button-secondary" to="/simulateur/vin/concevoir">Concevoir un vin</Link>
      </div>
      <WineRecipeFinder />
    </section>
  );
}
