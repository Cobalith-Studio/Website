import SpiritsSimulator from "../components/simulators/SpiritsSimulator";
import SectionHeading from "../components/ui/SectionHeading";

export default function SpiritsSimulatorPage() {
  return (
    <section className="section page-intro">
      <SectionHeading
        kicker="Spiritueux"
        title="Distillation, aromatisation et élevage"
        text="Le simulateur de spiritueux suit le même principe: moins de bruit de code, plus de structure et de clarté."
      />
      <SpiritsSimulator />
    </section>
  );
}
