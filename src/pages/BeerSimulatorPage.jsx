import BeerSimulator from "../components/simulators/BeerSimulator";
import SectionHeading from "../components/ui/SectionHeading";

export default function BeerSimulatorPage() {
  return (
    <section className="section page-intro">
      <SectionHeading
        kicker="Bière"
        title="Module de brassage restructuré"
        text="La logique reste orientée recette et dérive de style, mais dans un composant lisible et maintenable."
      />
      <BeerSimulator />
    </section>
  );
}
